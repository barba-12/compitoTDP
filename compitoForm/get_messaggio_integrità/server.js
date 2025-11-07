const fs = require("fs");
const http = require("http");
const url = require("url");

function requestHandler(request, response) {
  const oggettourl = url.parse(request.url, true); // <-- true per ottenere query come oggetto
  const path = oggettourl.pathname;

  switch (path) {
    case '/':
      fs.readFile('index.html', function (error, data) {
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
      const dati = oggettourl.query;

      console.log(dati);

      let messaggio = "";
      let invia = true;

      // --- Controllo campi vuoti ---
      if (!dati.nome) {
        invia = false;
        messaggio += "Non inserito nome\n";
      }
      if (!dati.cognome) {
        invia = false;
        messaggio += "Non inserito cognome\n";
      }
      if (!dati.email) {
        invia = false;
        messaggio += "Non inserita email\n";
      }
      if (!dati.categoriautente) {
        invia = false;
        messaggio += "Non inserita categoria utente\n";
      }
      if (!dati.tiporichiesta) {
        invia = false;
        messaggio += "Non inserito tipo di richiesta\n";
      }

      // --- Controllo di integrità con regex ---
      if (dati.nome && !/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,30}$/.test(dati.nome)) {
        invia = false;
        messaggio += "Il nome contiene caratteri non validi\n";
      }

      if (dati.cognome && !/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,30}$/.test(dati.cognome)) {
        invia = false;
        messaggio += "Il cognome contiene caratteri non validi\n";
      }

      if (dati.email && !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(dati.email)) {
        invia = false;
        messaggio += "L'email non è in un formato valido\n";
      }

      if (dati.commenti && dati.commenti.length > 500) {
        invia = false;
        messaggio += "Il commento è troppo lungo (max 500 caratteri)\n";
      }

      // --- Risposta ---
      response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      if (invia) {
        response.end("Dati ricevuti in modo corretto ");
      } else {
        response.end("Errori riscontrati:\n" + messaggio);
      }

      break;

    default:
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Pagina non trovata");
  }
}

const server = http.createServer(requestHandler);
server.listen(3000, () => {
  console.log("Server in ascolto su http://localhost:3000");
});
