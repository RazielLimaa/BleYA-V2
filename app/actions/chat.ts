// Define que este arquivo SÓ PODE ser executado no servidor.
"use server"; 

import { GoogleGenerativeAI } from "@google/generative-ai"; // Ou use "@google/generative-ai"

// Instância do cliente Gemini (Singleton).
let aiClient: GoogleGenerativeAI | null = null;

// Função auxiliar para obter e inicializar o cliente Gemini.
function getGeminiClient(): GoogleGenerativeAI | { error: string } {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is not set");
    return {
      error:
        "API key is not configured. Please add GEMINI_API_KEY to your environment variables.",
    };
  }

  // Inicializa a instância apenas na primeira vez.
  if (!aiClient) {
    try {
      // Passar a chave explicitamente para garantir que ela seja usada.
      aiClient = new GoogleGenerativeAI(apiKey); 
    } catch (e) {
      console.error("❌ Failed to initialize Gemini Client:", e);
      return { error: "Failed to initialize Google Generative AI client." };
    }
  }

  return aiClient;
}

/**
 * Envia uma mensagem de texto para o modelo Gemini 2.5 Flash.
 *
 * @param message O prompt de texto.
 * @returns Um objeto com 'success' e 'message' (resposta da IA) ou 'error'.
 */
export async function sendMessageToGemini(message: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const clientOrError = getGeminiClient();

  if ("error" in clientOrError) {
    return { success: false, error: clientOrError.error };
  }

  const ai = clientOrError;
  const modelName = "gemini-2.5-flash";

  try {
    // Obtém o modelo generativo do cliente Gemini.
    const model = ai.getGenerativeModel({ model: modelName });

    // Chama generateContent no modelo, passando o prompt.
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    // Extrai o texto gerado do campo correto na resposta.
    const aiResponse =
      response.response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (aiResponse) {
      return {
        success: true,
        message: aiResponse,
      };
    } else {
      console.error("⚠️ Empty or blocked response from API:", response);
      return {
        success: false,
        error: "Sorry, the model did not generate a response (it might have been blocked by safety settings).",
      };
    }
  } catch (error: any) {
    console.error("🔥 Error calling Gemini API:", error.message || error);
    return {
      success: false,
      error: `Sorry, there was an error processing your request: ${
        error.message || "Unknown error."
      }`,
    };
  }
}
