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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const summarizer_1 = require("./summarizer");
// import process from "process";
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const GEMINI_APIKEY = process.env.GEMINI_APIKEY || "";
/**
 *
 * @param req
 * @param res
 */
function handleSummarize(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        let transcript = req.body.transcript;
        let errorResponse = {
            status: "error",
            text: "Invalid Request",
            error: ""
        };
        if (typeof (transcript) !== "string") {
            res.type('json').send(errorResponse);
            return;
        }
        let summary = yield (0, summarizer_1.geminiSummarize)(transcript);
        res.type('json').send(summary);
    });
}
app.use(express_1.default.json());
app.post("/summarize", handleSummarize);
app.get("/", (req, res) => res.type('html').send("Helloworld2"));
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
