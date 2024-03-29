"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const querystring_1 = __importDefault(require("querystring"));
class jobManager {
    constructor() {
        this.jobCounter = 0;
    }
    getNextJob() {
        return (this.jobCounter++).toString();
    }
}
let jm = new jobManager();
const server = http_1.default.createServer(function (request, response) {
    switch (request.method) {
        case "GET":
            if (request.url == undefined) {
                console.log("NULL URL");
                break;
            }
            let url_parts = url_1.default.parse(request.url);
            if (url_parts.pathname == null) {
                console.log("NULL URL");
                break;
            }
            console.log(url_parts.pathname);
            switch (url_parts.pathname) {
                case "/initializer":
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    const num_list_file = "../utilities/30030.txt";
                    fs_1.default.readFile(num_list_file, function (err, data) {
                        if (err)
                            throw err;
                        response.end(data);
                    });
                    break;
                case "/newjob":
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.end(jm.getNextJob());
                    break;
                default:
                    console.log("INVALID URL" + url_parts.pathname);
                    response.writeHead(404, { 'Content-Type': 'text/plain' });
                    response.end("Nope.");
            }
            break;
        case "POST":
            request.body = "";
            request.on('data', function (data) {
                console.log(data);
                request.body += data;
            });
            request.on('end', function () {
                console.log(request.body);
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.end("thanks");
                let post = querystring_1.default.parse(request.body);
                fs_1.default.appendFile("output.txt", post["primes"], function (err) {
                    if (err)
                        throw err;
                    console.log("Output Written");
                });
            });
            break;
        default:
            console.log("INVALID REQUEST" + request);
    }
});
const port = 9003;
server.listen(port);
