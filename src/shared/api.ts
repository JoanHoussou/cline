export type ApiProvider =
	| "anthropic"
	| "openrouter"
	| "bedrock"
	| "vertex"
	| "openai"
	| "ollama"
	| "lmstudio"
	| "gemini"
	| "openai-native"
	| "mistral"

export interface ApiHandlerOptions {
	apiModelId?: string
	apiKey?: string // anthropic
	anthropicBaseUrl?: string
	openRouterApiKey?: string
	openRouterModelId?: string
	openRouterModelInfo?: ModelInfo
	awsAccessKey?: string
	awsSecretKey?: string
	awsSessionToken?: string
	awsRegion?: string
	awsUseCrossRegionInference?: boolean
	vertexProjectId?: string
	vertexRegion?: string
	openAiBaseUrl?: string
	openAiApiKey?: string
	openAiModelId?: string
	ollamaModelId?: string
	ollamaBaseUrl?: string
	lmStudioModelId?: string
	lmStudioBaseUrl?: string
	geminiApiKey?: string
	openAiNativeApiKey?: string
	azureApiVersion?: string
	mistralBaseUrl?: string
	mistralApiKey?: string
	mistralModelId?: string
}


export type ApiConfiguration = ApiHandlerOptions & {
	apiProvider?: ApiProvider
}

// Models

export interface ModelInfo {
	maxTokens?: number
	contextWindow?: number
	pricePer1kInput?: number
	pricePer1kOutput?: number
	supportsVision?: boolean
	supportsTools?: boolean
	supportsJson?: boolean
	// Legacy properties
	supportsImages?: boolean
	supportsComputerUse?: boolean
	supportsPromptCache?: boolean
	inputPrice?: number
	outputPrice?: number
	cacheWritesPrice?: number
	cacheReadsPrice?: number
	description?: string
}

// Anthropic
// https://docs.anthropic.com/en/docs/about-claude/models
export type AnthropicModelId = keyof typeof anthropicModels
export const anthropicDefaultModelId: AnthropicModelId = "claude-3-5-sonnet-20241022"
export const anthropicModels = {
	"claude-3-5-sonnet-20241022": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsVision: true,
		supportsTools: true,
		supportsJson: true,
		pricePer1kInput: 3.0, // $3 per million input tokens
		pricePer1kOutput: 15.0, // $15 per million output tokens
	},
	"claude-3-5-haiku-20241022": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsVision: false,
		supportsJson: true,
		pricePer1kInput: 1.0,
		pricePer1kOutput: 5.0,
	},
	"claude-3-opus-20240229": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 15.0,
		pricePer1kOutput: 75.0,
	},
	"claude-3-haiku-20240307": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 0.25,
		pricePer1kOutput: 1.25,
	},
} as const satisfies Record<string, ModelInfo> // as const assertion makes the object deeply readonly

// AWS Bedrock
// https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html
export type BedrockModelId = keyof typeof bedrockModels
export const bedrockDefaultModelId: BedrockModelId = "anthropic.claude-3-5-sonnet-20241022-v2:0"
export const bedrockModels = {
	"anthropic.claude-3-5-sonnet-20241022-v2:0": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsVision: true,
		supportsTools: true,
		supportsJson: true,
		pricePer1kInput: 3.0,
		pricePer1kOutput: 15.0,
	},
	"anthropic.claude-3-5-haiku-20241022-v1:0": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsVision: false,
		supportsJson: true,
		pricePer1kInput: 1.0,
		pricePer1kOutput: 5.0,
	},
	"anthropic.claude-3-5-sonnet-20240620-v1:0": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 3.0,
		pricePer1kOutput: 15.0,
	},
	"anthropic.claude-3-opus-20240229-v1:0": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 15.0,
		pricePer1kOutput: 75.0,
	},
	"anthropic.claude-3-sonnet-20240229-v1:0": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 3.0,
		pricePer1kOutput: 15.0,
	},
	"anthropic.claude-3-haiku-20240307-v1:0": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 0.25,
		pricePer1kOutput: 1.25,
	},
} as const satisfies Record<string, ModelInfo>

// OpenRouter
// https://openrouter.ai/models?order=newest&supported_parameters=tools
export const openRouterDefaultModelId = "anthropic/claude-3.5-sonnet:beta" // will always exist in openRouterModels
export const openRouterDefaultModelInfo: ModelInfo = {
	maxTokens: 8192,
	contextWindow: 200_000,
	supportsVision: true,
	supportsTools: true,
	supportsJson: true,
	pricePer1kInput: 3.0,
	pricePer1kOutput: 15.0,
}

// Vertex AI
// https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude
export type VertexModelId = keyof typeof vertexModels
export const vertexDefaultModelId: VertexModelId = "claude-3-5-sonnet-v2@20241022"
export const vertexModels = {
	"claude-3-5-sonnet-v2@20241022": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsVision: true,
		supportsTools: true,
		supportsJson: true,
		pricePer1kInput: 3.0,
		pricePer1kOutput: 15.0,
	},
	"claude-3-5-sonnet@20240620": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 3.0,
		pricePer1kOutput: 15.0,
	},
	"claude-3-5-haiku@20241022": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsVision: false,
		supportsJson: true,
		pricePer1kInput: 1.0,
		pricePer1kOutput: 5.0,
	},
	"claude-3-opus@20240229": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 15.0,
		pricePer1kOutput: 75.0,
	},
	"claude-3-haiku@20240307": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 0.25,
		pricePer1kOutput: 1.25,
	},
} as const satisfies Record<string, ModelInfo>

export const openAiModelInfoSaneDefaults: ModelInfo = {
	maxTokens: -1,
	contextWindow: 128_000,
	supportsVision: true,
	supportsJson: true,
	pricePer1kInput: 0,
	pricePer1kOutput: 0,
}

// Gemini
// https://ai.google.dev/gemini-api/docs/models/gemini
export type GeminiModelId = keyof typeof geminiModels
export const geminiDefaultModelId: GeminiModelId = "gemini-2.0-flash-thinking-exp-1219"
export const geminiModels = {
	"gemini-2.0-flash-thinking-exp-1219": {
		maxTokens: 8192,
		contextWindow: 32_767,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 0,
		pricePer1kOutput: 0,
	},
	"gemini-2.0-flash-exp": {
		maxTokens: 8192,
		contextWindow: 1_048_576,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 0,
		pricePer1kOutput: 0,
	},
	"gemini-exp-1206": {
		maxTokens: 8192,
		contextWindow: 2_097_152,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 0,
		pricePer1kOutput: 0,
	},
	"gemini-1.5-flash-002": {
		maxTokens: 8192,
		contextWindow: 1_048_576,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 0,
		pricePer1kOutput: 0,
	},
	"gemini-1.5-flash-exp-0827": {
		maxTokens: 8192,
		contextWindow: 1_048_576,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 0,
		pricePer1kOutput: 0,
	},
	"gemini-1.5-flash-8b-exp-0827": {
		maxTokens: 8192,
		contextWindow: 1_048_576,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 0,
		pricePer1kOutput: 0,
	},
	"gemini-1.5-pro-002": {
		maxTokens: 8192,
		contextWindow: 2_097_152,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 0,
		pricePer1kOutput: 0,
	},
	"gemini-1.5-pro-exp-0827": {
		maxTokens: 8192,
		contextWindow: 2_097_152,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 0,
		pricePer1kOutput: 0,
	},
} as const satisfies Record<string, ModelInfo>

// OpenAI Native
// https://openai.com/api/pricing/
export type OpenAiNativeModelId = keyof typeof openAiNativeModels
export const openAiNativeDefaultModelId: OpenAiNativeModelId = "gpt-4o"
export const openAiNativeModels = {
	// don't support tool use yet
	"o1-preview": {
		maxTokens: 32_768,
		contextWindow: 128_000,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 15,
		pricePer1kOutput: 60,
	},
	"o1-mini": {
		maxTokens: 65_536,
		contextWindow: 128_000,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 3,
		pricePer1kOutput: 12,
	},
	"gpt-4o": {
		maxTokens: 4_096,
		contextWindow: 128_000,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 5,
		pricePer1kOutput: 15,
	},
	"gpt-4o-mini": {
		maxTokens: 16_384,
		contextWindow: 128_000,
		supportsVision: true,
		supportsJson: true,
		pricePer1kInput: 0.15,
		pricePer1kOutput: 0.6,
	},
} as const satisfies Record<string, ModelInfo>

// Azure OpenAI
// https://learn.microsoft.com/en-us/azure/ai-services/openai/api-version-deprecation
// https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#api-specs
export const azureOpenAiDefaultApiVersion = "2024-08-01-preview"

// Mistral
// https://docs.mistral.ai/models/
export type MistralModelId =
    | "mistral-tiny"
    | "mistral-small"
    | "mistral-medium"
    | "mistral-large-latest";

export const mistralDefaultModelId: MistralModelId = "mistral-small";
export const mistralModels: Record<MistralModelId, ModelInfo> = {
    "mistral-tiny": {
        maxTokens: 4096,
        contextWindow: 32_768,
        pricePer1kInput: 0.14,
        pricePer1kOutput: 0.42,
    },
    "mistral-small": {
        maxTokens: 4096,
        contextWindow: 32_768,
        pricePer1kInput: 0.20,
        pricePer1kOutput: 0.60,
    },
    "mistral-medium": {
        maxTokens: 4096,
        contextWindow: 32_768,
        pricePer1kInput: 0.60,
        pricePer1kOutput: 1.80,
    },
    "mistral-large-latest": {
        maxTokens: 4096,
        contextWindow: 32_768,
        pricePer1kInput: 2.00,
        pricePer1kOutput: 6.00,
    },
};
