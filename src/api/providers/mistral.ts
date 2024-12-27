import { Anthropic } from "@anthropic-ai/sdk"
import { ApiHandler } from "../"
import { ApiHandlerOptions, mistralDefaultModelId, MistralModelId, mistralModels, ModelInfo } from "../../shared/api"
import { ApiStream } from "../transform/stream"

export class MistralHandler implements ApiHandler {
    private options: ApiHandlerOptions
    private apiUrl: string
    private lastCommandResult?: { success: boolean; output: string }

    constructor(options: ApiHandlerOptions) {
        if (!options.mistralApiKey) {
            throw new Error("API key is required for Mistral")
        }
        this.options = options
        this.apiUrl = this.options.mistralBaseUrl || "https://api.mistral.ai/v1"
    }

    async *createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream {
        const model = this.getModel()
        
        // Transform messages into Mistral format with command results context
        const mistralMessages = messages.map(msg => {
            // Check if this is a tool result message
            const isToolResult = Array.isArray(msg.content) && 
                msg.content.some(c => c.type === "tool_result")

            if (isToolResult && this.lastCommandResult) {
                // Add command result context
                return {
                    role: msg.role,
                    content: `Command result: ${this.lastCommandResult.success ? 'SUCCESS' : 'FAILED'}\nOutput: ${this.lastCommandResult.output}\n\n${
                        Array.isArray(msg.content) 
                            ? msg.content.map(c => {
                                if (c.type === "text") {
                                    return c.text
                                }
                                return ""
                            }).join("\n")
                            : msg.content
                    }`
                }
            }

            return {
                role: msg.role === "assistant" ? "assistant" : "user",
                content: Array.isArray(msg.content) 
                    ? msg.content.map(c => {
                        if (c.type === "text") {
                            return c.text
                        }
                        return ""
                    }).join("\n")
                    : msg.content
            }
        })

        // Add system prompt as first user message
        mistralMessages.unshift({
            role: "system",
            content: systemPrompt
        })

        const response = await fetch(`${this.apiUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.options.mistralApiKey}`
            },
            body: JSON.stringify({
                model: model.id,
                messages: mistralMessages,
                temperature: 0,
                stream: true,
                max_tokens: model.info.maxTokens || 4096
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Mistral API error: ${response.status} ${response.statusText} - ${errorText}`)
        }

        const reader = response.body?.getReader()
        if (!reader) {
            throw new Error("Mistral API error: No response body")
        }

        try {
            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = new TextDecoder().decode(value)
                const lines = chunk.split("\n").filter(line => line.trim() !== "")

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue
                    const jsonData = line.replace("data: ", "").trim()
                    if (jsonData === "[DONE]") break

                    try {
                        const data = JSON.parse(jsonData)
                        if (data.choices?.[0]?.delta?.content) {
                            yield {
                                type: "text",
                                text: data.choices[0].delta.content
                            }
                        }
                    } catch (parseError) {
                        console.error("Error parsing JSON data:", parseError)
                    }
                }
            }
        } finally {
            reader.releaseLock()
        }

        // Add usage information at the end
        yield {
            type: "usage",
            inputTokens: 0, // Mistral API doesn't provide token counts yet
            outputTokens: 0
        }
    }

    // Méthode pour mettre à jour le résultat de la dernière commande
    updateLastCommandResult(success: boolean, output: string) {
        this.lastCommandResult = { success, output }
    }

    getModel(): { id: MistralModelId; info: ModelInfo } {
        const modelId = this.options.apiModelId
        if (modelId && modelId in mistralModels) {
            const id = modelId as MistralModelId
            return { id, info: mistralModels[id] }
        }
        return { id: mistralDefaultModelId, info: mistralModels[mistralDefaultModelId] }
    }
}
