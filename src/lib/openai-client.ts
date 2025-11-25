import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;
let groqInstance: OpenAI | null = null;

export type AIProvider = "groq" | "openai";

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
 */
export function getModelName(provider: AIProvider = "groq"): string {
  if (provider === "groq") {
    return "llama-3.3-70b-versatile";
  }
  return "gpt-4o-mini";
}

