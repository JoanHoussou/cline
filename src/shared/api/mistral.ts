import { ModelInfo } from "./types";

export type MistralModelId = "mistral-tiny" | "mistral-small" | "mistral-medium";

export const mistralDefaultModelId: MistralModelId = "mistral-small";

export const mistralModels: Record<MistralModelId, ModelInfo> = {
    "mistral-tiny": {
        name: "Mistral Tiny",
        description: "Rapide et efficace pour des tâches simples",
        maxTokens: 4096,
        trainingCutoff: "2023-12",
        pricePerInputToken: 0.00014,
        pricePerOutputToken: 0.00042,
    },
    "mistral-small": {
        name: "Mistral Small",
        description: "Bon équilibre entre performance et coût",
        maxTokens: 4096,
        trainingCutoff: "2023-12",
        pricePerInputToken: 0.00024,
        pricePerOutputToken: 0.00072,
    },
    "mistral-medium": {
        name: "Mistral Medium",
        description: "Modèle le plus performant pour des tâches complexes",
        maxTokens: 4096,
        trainingCutoff: "2023-12",
        pricePerInputToken: 0.00072,
        pricePerOutputToken: 0.00216,
    },
};
