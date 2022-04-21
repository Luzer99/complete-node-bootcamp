import * as http from "http";

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.end("Hello from the server!");
  }
);

server.listen(8000, "127.0.0.1", () => {
  console.log("Listen to requests on http://localhost:8000");
});
