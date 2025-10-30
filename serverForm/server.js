const http = require("http");
const fs = require("fs");
const querystring = require("querystring");

const server = http.createServer((request, response) => {
    if (request.url === "/" && request.method === "GET") {
        fs.readFile("index.html", (err, data) => {
            if (err) {
                response.writeHead(404);
                response.end("Pagina non trovata");
            } else {
                response.writeHead(200, { "Content-Type": "text/html" });
                response.end(data);
            }
        });
    } 
    else if (request.url === "/recuperaDati" && request.method === "POST") {
        let body = "";

        // Legge i dati dal body
        request.on("data", chunk => {
            body += chunk.toString();
        });

        request.on("end", () => {
            const parsedBody = querystring.parse(body);
            const username = parsedBody.username || "ospite";

            if(username == "admin" && parsedBody.password == "123"){
              // Crea l'HTML dinamico con lo username
              const paginaHtml = `
                  <!DOCTYPE html>
                  <html lang="it">
                  <head>
                      <meta charset="UTF-8">
                      <title>Benvenuto</title>
                  </head>
                  <body>
                      <h1>Benvenuto ${username} nel nostro sito!</h1>
                  </body>
                  </html>
              `;

              response.writeHead(200, { "Content-Type": "text/html" });
              response.end(paginaHtml);
            } else {
              response.writeHead(200, { "Content-Type": "text/plain" });
              response.end("Credenziali errate");
            }
        });
    } 
    else {
        response.writeHead(404);
        response.end("Pagina non trovata");
    }
});

server.listen(3000, () => {
    console.log("Server in ascolto sulla porta 3000");
});