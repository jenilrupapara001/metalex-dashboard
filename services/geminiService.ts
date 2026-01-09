
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Fixed: Initializing GoogleGenAI using a named parameter and direct process.env.API_KEY usage
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateTechnicalDescription(params: {
    system: string;
    width: number;
    height: number;
    type: string;
    glazing: string;
  }) {
    const prompt = `Generate a professional technical description for a high-end window quotation. 
    Product: ${params.type}
    Dimensions: ${params.width}mm x ${params.height}mm
    System: ${params.system}
    Glazing: ${params.glazing}
    
    Format the output as a concise 1-2 sentence technical summary similar to "Window Elements ${params.width} mm x ${params.height} mm, Consisting of a Fixed Sash. System: ${params.system}."`;

    try {
      // Fixed: Using gemini-3-flash-preview for text generation tasks and correctly accessing the text property
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text || "Technical description unavailable.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return `Element ${params.width}mm x ${params.height}mm, ${params.type} configuration. System: ${params.system}.`;
    }
  }

  async suggestDesignOptimization(itemDetails: string) {
    const prompt = `As a senior architectural engineer, review these window dimensions and system specs for potential structural or aesthetic issues: ${itemDetails}. Provide brief feedback.`;
    
    try {
      // Fixed: Using gemini-3-pro-preview for complex reasoning tasks and setting correct thinkingConfig
      const response = await this.ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 32768 } }
      });
      return response.text;
    } catch (error) {
      return null;
    }
  }
}

export const geminiService = new GeminiService();
