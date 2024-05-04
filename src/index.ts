import express , {Request, Response} from "express";
import { GeminiResponse, geminiSummarize } from "./summarizer";
import cors, { CorsOptions } from "cors";

// import process from "process";

const app = express();
const port = process.env.PORT || 3001;
// const GEMINI_APIKEY = process.env.GEMINI_APIKEY || "";



let corsOptions : CorsOptions = {
    origin: ['https://boomza654.github.io/', 'http://localhost:5173'],
    methods: "POST",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(express.json());


async function doSummarize(req : Request)  {
    let transcript = req.body.transcript;
    let errorResponse : GeminiResponse = {
        status :"error",
        text : "Invalid Request",
        error : ""
    }
    if(typeof(transcript) !== "string") {
        return errorResponse;
    }
    let summary = await geminiSummarize(transcript);
    return summary;
}

async function handleSummarize(req : Request, res : Response) {

    console.log("req", req.body);
    let resp = await doSummarize(req);
    console.log("resp", resp);
    res.type("json").send(resp).end();
}



app.post("/summarize", handleSummarize);

app.get("/", (req, res) => res.type('html').send("Helloworld2"));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;