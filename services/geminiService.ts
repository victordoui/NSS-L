/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `Você é o assistente técnico da NSS Engenharia.
      Contexto: a NSS Engenharia atua com engenharia diagnóstica, patologia das construções, inspeções, laudos, perícias, projetos estruturais, drenagem, terraplanagem, acessibilidade, contenção, reformas, sondagem SPT e sondagem rotativa.

      Tom: profissional, claro, técnico e conciso.

      Informações-chave:
      - O foco é segurança, rigor técnico, viabilidade, qualidade e responsabilidade.
      - Explique os serviços em português claro, sem prometer diagnóstico final sem inspeção.
      - Oriente uma avaliação técnica quando o usuário citar fissuras, infiltrações, recalques, manifestações patológicas ou risco estrutural.

      Mantenha respostas curtas e úteis. Não invente preços, prazos ou certificações.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Assistente indisponível no momento. (Chave de API ausente)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Não foi possível gerar uma resposta agora.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível responder agora. Tente novamente mais tarde.";
  }
};
