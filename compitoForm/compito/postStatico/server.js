const fs = require("fs");
const http = require("http");
const url = require("url");

const hostname = "127.0.0.1";
const port = 3000;

function requestHandler(request, response) {
    const parsedUrl = url.parse(request.url, true);
    const path = parsedUrl.pathname;

    switch (path) {
        case '/':
            fs.readFile('index.html', (error, data) => {
                if (error) {
                    response.writeHead(404);
                } else {
                    response.writeHead(200, { "Content-Type": "text/html" });
                    response.write(data, "utf8");
                }
                response.end();
            });
            break;
        case '/form':
            fs.readFile('form.html', (error, data) => {
                if (error) {
                    response.writeHead(404);
                } else {
                    response.writeHead(200, { "Content-Type": "text/html" });
                    response.write(data, "utf8");
                }
                response.end();
            });
            break;
        case '/recuperadati':
            if (request.method === 'POST') {
                let body = '';
                request.on('data', chunk => body += chunk.toString());
                request.on('end', () => {
                    const dati = Object.fromEntries(new URLSearchParams(body));

                    let messaggio = "";
                    let invia = true;

                    let ragexNomeCognome = /^[A-Za-zÀ-ÖØ-öø-ÿ\s']+$/;
                    let ragexEmail = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
                    let ragexTelefono = /^[+]?[\d\s()-]{8,15}$/;

                    if (!dati.nome) { invia = false; messaggio += "Nome mancante\n"; }
                    if (!dati.cognome) { invia = false; messaggio += "Cognome mancante\n"; }
                    if (!dati.numeroMatricola) { invia = false; messaggio += "Numero matricola mancante\n"; }
                    if (!dati.regione || dati.regione === "Seleziona una regione") { invia = false; messaggio += "Regione non selezionata\n"; }
                    if (!dati.email && !dati.telefono) { invia = false; messaggio += "Email e Telefono mancanti\n"; }

                    if (!ragexNomeCognome.test(dati.nome) || !ragexNomeCognome.test(dati.cognome)) { invia = false; messaggio += "Nome o cognome non sono nel formato coretto\n"; }
                    if (!ragexEmail.test(dati.email)) { invia = false; messaggio += "Email non valida\n"; }
                    if (!ragexTelefono.test(dati.telefono)) { invia = false; messaggio += "Numero di telefono non valido\n";}

                    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                    if (invia) {
                        response.end("Dati ricevuti in modo corretto");
                    } else {
                        response.end("Errori riscontrati:\n" + messaggio);
                    }
                });
            } else {
                response.writeHead(405, { 'Content-Type': 'text/plain' });
                response.end("Metodo non consentito");
            }
            break;
        default:
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.end("Pagina non trovata");
    }
}

const server = http.createServer(requestHandler);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});