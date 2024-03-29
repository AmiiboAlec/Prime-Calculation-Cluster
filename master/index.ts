import fs from 'fs';
import http from 'http';
import url from 'url';
import qs from 'querystring';


class jobManager {
    jobCounter: number;

    constructor() {
        this.jobCounter = 0;
    }

    getNextJob(): string {
        return (this.jobCounter++).toString();
    }
}

declare module "http" {
    interface IncomingMessage {
        body: string;
    }
}
let jm = new jobManager();
const server = http.createServer(function (request, response) {
    switch (request.method) {
        case "GET":
            if (request.url == undefined) {
                console.log("NULL URL");
                break;
            }
            let url_parts = url.parse(request.url);
            if (url_parts.pathname == null) {
                console.log("NULL URL");
                break;
            }
            console.log(url_parts.pathname)
            switch (url_parts.pathname) {
                case "/initializer":
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    const num_list_file = "../utilities/30030.txt";
                    fs.readFile(num_list_file, function(err, data) {
                        if (err) throw err;
                        response.end(data);
                    })
                    break;
                case "/newjob":
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.end(jm.getNextJob());
                    break;
                default:
                    console.log("INVALID URL" + url_parts.pathname);
                    response.writeHead(404, {'Content-Type': 'text/plain'});
                    response.end("Nope.");
            }
            break;
        case "POST":
            request.body="";
            request.on('data', function(data) {
                console.log(data);
                request.body += data;
            })
            request.on('end', function() {
                console.log(request.body);
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end("thanks");
                let post = qs.parse(request.body);
                fs.appendFile("output.txt", <string>post["primes"]!, function(err) {
                    if (err) throw err;
                    console.log("Output Written");
                })
            })
            break;
        default:
            console.log("INVALID REQUEST" + request);
    }
});

const port = 9003;
server.listen(port);