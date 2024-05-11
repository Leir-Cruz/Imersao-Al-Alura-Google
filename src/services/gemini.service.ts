import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

interface sendAudio {
  instrument: string;
  music: string;
  generatedModel: generateModelDTO;
  audioBase64: unknown;
}

interface generateModelDTO {
  model: GenerativeModel;
  genAI: GoogleGenerativeAI;
}

const generateModel = (apiKey: string): generateModelDTO => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
  return { genAI, model };
};

const sendMessage = async (params: sendAudio) => {
  const { instrument, music, audioBase64, generatedModel } = params;

  const response = await generatedModel.model.generateContent([
    `O instrumento a seguir trata-se de um ${instrument}. A música ou trecho é de ${music}. Forneça feedbacks sobre o aúdio, como limpeza do som do instrumento, consistência e dinâmica. Dê dicas simples e claras, como um professor iniciante`,
  ]);

  console.log("response", response.response.text());

  return response.response.text();
};

export const gemini = {
  generateModel,
  sendMessage,
};
