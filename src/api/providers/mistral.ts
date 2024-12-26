import { Anthropic } from "@anthropic-ai/sdk";
import {
	ApiHandlerOptions,
	ModelInfo,
	openAiModelInfoSaneDefaults,
} from "../../shared/api";
import { ApiHandler } from "../index";
import { convertToOpenAiMessages } from "../transform/openai-format";
import { ApiStream } from "../transform/stream";

export class MistralHandler implements ApiHandler {
	private options: ApiHandlerOptions;
	private apiUrl: string;

	constructor(options: ApiHandlerOptions) {
		if (!options.mistralApiKey) {
			throw new Error("API key is required for Mistral");
		}
		this.options = options;
		this.apiUrl = this.options.mistralBaseUrl || "https://api.mistral.ai/v1";
	}

	async *createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream {
		const mistralMessages = convertToOpenAiMessages(messages);
		if (systemPrompt) {
			mistralMessages.unshift({ role: "system", content: systemPrompt });
		}

		const response = await fetch(`${this.apiUrl}/chat/completions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.options.mistralApiKey}`,
			},
			body: JSON.stringify({
				model: this.getModel().id,
				messages: mistralMessages,
				temperature: 0.7,
				stream: true,
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Mistral API error: ${response.status} ${response.statusText} - ${errorText}`);
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error("Mistral API error: No response body");
		}

		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}

			const chunk = new TextDecoder().decode(value);
			try {
				const lines = chunk.split("\n").filter((line) => line.trim() !== "");
				for (const line of lines) {
					if (!line.startsWith("data: ")) continue;
					const jsonData = line.replace("data: ", "").trim();
					if (jsonData === "[DONE]") break;
					
					try {
						const data = JSON.parse(jsonData);
						if (data.choices && data.choices[0]?.delta?.content) {
							yield {
								type: "text",
								text: data.choices[0].delta.content,
							};
						}
						if (data.usage) {
							yield {
								type: "usage",
								inputTokens: data.usage.prompt_tokens || 0,
								outputTokens: data.usage.completion_tokens || 0,
							};
						}
					} catch (parseError) {
						console.error("Error parsing JSON data:", parseError, "Line:", jsonData);
					}
				}
			} catch (error) {
				console.error("Error processing chunk:", error, "Chunk:", chunk);
			}
		}
	}

	getModel(): { id: string; info: ModelInfo } {
		return {
			id: this.options.mistralModelId || "mistral-tiny",
			info: openAiModelInfoSaneDefaults,
		};
	}
}
