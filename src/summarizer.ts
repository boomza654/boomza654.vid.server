

import { FinishReason, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, GenerativeModel, GenerateContentResult } from "@google/generative-ai";
export type GeminiResponse = {
    status: "suceed" | "error";
    text?: string | undefined;
    error?: string | undefined;
}


const GEMINI_APIKEY = process.env.GEMINI_APIKEY || "";

// Raw Request spam

export async function geminiSendRaw(text: string): Promise<GeminiResponse> {

    let gemini_client = new GoogleGenerativeAI(GEMINI_APIKEY);
    let gemini_model = gemini_client.getGenerativeModel({ model: "gemini-1.5-pro-latest" }, { apiVersion: 'v1beta' });
    gemini_model.safetySettings = [{
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    }, {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    }, {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    }, {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    }]
    let response: GenerateContentResult;
    try {
        response = await gemini_model.generateContent({
            contents: [{ role: "user", parts: [{ text: text }] }],
            generationConfig: {
                temperature: 0.1,
            }
        })
    } catch (err) {
        return {
            status: "error",
            text: `Cannot perform LLM inference. Probaly due to invalid API Key`,
            error: `${err}` 
        };
    }

    try {
        let candidate = response.response.candidates![0]!;
        if (candidate.finishReason === FinishReason.MAX_TOKENS)
            return { status: "error", text: "Transcript too long to be processed" }
        let out = candidate.content.parts[0].text;
        if (out === undefined) {
            return { status: "error", text: "Cannot extract summary" };
        }
        return { status: "suceed", text: out }
    } catch (err) {
        return {
            status: "error",
            text: "Unexpected LLM response Format" ,
            error: `${err}`
        };
    }
}

export async function geminiSummarize(transcript: string): Promise<GeminiResponse> {
    return await geminiSendRaw("Arrange the transcript into bullet points in Thai according to the conversation topic. Do not leave out important content as well as any actionables from the output.\n\n" + transcript);
}
