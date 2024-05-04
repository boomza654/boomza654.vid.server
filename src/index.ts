import express , {Request, Response} from "express";
import { GeminiResponse, geminiSummarize } from "./summarizer";
// import process from "process";

const app = express();
const port = process.env.PORT || 3001;
const GEMINI_APIKEY = process.env.GEMINI_APIKEY || "";




/**
 * 
 * @param req 
 * @param res 
 */
async function handleSummarize(req : Request, res : Response)  {
    console.log(req.body);
    let transcript = req.body.transcript;
    let errorResponse : GeminiResponse = {
        status :"error",
        text : "Invalid Request",
        error : ""
    }
    if(typeof(transcript) !== "string") {
        res.type('json').send(errorResponse)
        return;
    }
    let summary = await geminiSummarize(transcript);
    res.type('json').send(summary);
}

app.use(express.json());
app.post("/summarize", handleSummarize);

app.get("/", (req, res) => res.type('html').send("Helloworld2"));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;