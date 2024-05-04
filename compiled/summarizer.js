"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiSummarize = exports.geminiSendRaw = void 0;
const generative_ai_1 = require("@google/generative-ai");
const GEMINI_APIKEY = process.env.GEMINI_APIKEY || "";
// Raw Request spam
function geminiSendRaw(text) {
    return __awaiter(this, void 0, void 0, function* () {
        let gemini_client = new generative_ai_1.GoogleGenerativeAI(GEMINI_APIKEY);
        let gemini_model = gemini_client.getGenerativeModel({ model: "gemini-1.5-pro-latest" }, { apiVersion: 'v1beta' });
        gemini_model.safetySettings = [{
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
            }, {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
            }, {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
            }, {
                category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
            }];
        let response;
        try {
            response = yield gemini_model.generateContent({
                contents: [{ role: "user", parts: [{ text: text }] }],
                generationConfig: {
                    temperature: 0.1,
                }
            });
        }
        catch (err) {
            return {
                status: "error",
                text: `Cannot perform LLM inference. Probaly due to invalid API Key`,
                error: `${err}`
            };
        }
        try {
            let candidate = response.response.candidates[0];
            if (candidate.finishReason === generative_ai_1.FinishReason.MAX_TOKENS)
                return { status: "error", text: "Transcript too long to be processed" };
            let out = candidate.content.parts[0].text;
            if (out === undefined) {
                return { status: "error", text: "Cannot extract summary" };
            }
            return { status: "suceed", text: out };
        }
        catch (err) {
            return {
                status: "error",
                text: "Unexpected LLM response Format",
                error: `${err}`
            };
        }
    });
}
exports.geminiSendRaw = geminiSendRaw;
function geminiSummarize(transcript) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield geminiSendRaw("Arrange the transcript into bullet points in Thai according to the conversation topic. Do not leave out important content as well as any actionables from the output.\n\n" + transcript);
    });
}
exports.geminiSummarize = geminiSummarize;
