import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;
let groqInstance: OpenAI | null = null;

export type AIProvider = "groq" | "openai";
export type GroqModel = "llama-3.1-8b-instant" | "llama-3.3-70b-versatile";

/**
 * Gets or creates the OpenAI client instance.
 * This is called lazily at runtime to ensure environment variables are available.
 */
export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_APIKEY;
    
    if (!apiKey) {
      throw new Error(
        "OpenAI API key is not set in environment variables. " +
        "Please set OPENAI_APIKEY in your .env.local file and restart the dev server."
      );
    }

    openaiInstance = new OpenAI({
      apiKey,
    });
  }

  return openaiInstance;
}

/**
 * Gets or creates the Groq client instance.
 * Groq uses OpenAI-compatible API, so we can use the OpenAI SDK with a different baseURL.
 */
export function getGroqClient(): OpenAI {
  if (!groqInstance) {
    const apiKey = process.env.GROQAI_APIKEY;
    
    if (!apiKey) {
      throw new Error(
        "Groq API key is not set in environment variables. " +
        "Please set GROQAI_APIKEY in your .env.local file and restart the dev server."
      );
    }

    groqInstance = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  return groqInstance;
}

/**
 * Gets the appropriate AI client based on the provider.
 */
export function getAIClient(provider: AIProvider = "groq"): OpenAI {
  if (provider === "groq") {
    return getGroqClient();
  }
  return getOpenAIClient();
}

/**
 * Gets the model name based on the provider.
 * @param provider - The AI provider (groq or openai)
 * @param model - Optional specific model name (for Groq: llama-3.1-8b-instant or llama-3.3-70b-versatile)
 */
export function getModelName(provider: AIProvider = "groq", model?: string): string {
  if (provider === "groq") {
    // If a specific model is provided and it's a valid Groq model, use it
    if (model && (model === "llama-3.1-8b-instant" || model === "llama-3.3-70b-versatile")) {
      return model;
    }
    // Default to llama-3.1-8b-instant
    return "llama-3.1-8b-instant";
  }
  return "gpt-4o-mini";
}

