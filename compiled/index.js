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
const cors_1 = __importDefault(require("cors"));
// import process from "process";
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// const GEMINI_APIKEY = process.env.GEMINI_APIKEY || "";
let corsOptions = {
    origin: ['https://boomza654.github.io', 'https://boomza654.github.io/', 'http://localhost:5173'],
    methods: "POST",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
function doSummarize(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let transcript = req.body.transcript;
        let errorResponse = {
            status: "error",
            text: "Invalid Request",
            error: ""
        };
        if (typeof (transcript) !== "string") {
            return errorResponse;
        }
        let summary = yield (0, summarizer_1.geminiSummarize)(transcript);
        return summary;
    });
}
function handleSummarize(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("req", req.body);
        let resp = yield doSummarize(req);
        console.log("resp", resp);
        res.type("json").send(resp).end();
    });
}
app.post("/summarize", handleSummarize);
app.get("/", (req, res) => res.type('html').send("Helloworld2"));
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
