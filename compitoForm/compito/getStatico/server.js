const fs=require("fs");
const http=require("http");
const url = require("url");
const hostname='127.0.0.1';
const port=3000;
function requestHandler(request,response) {
    const oggettourl = url.parse(request.url, true);
    const path =oggettourl.pathname; //per ottenere il nome della pagina richiesta

    switch (path){
        case '/':
          fs.readFile ('index.html',function(error,data){
           if (error) {
                  response.writeHead(404);        	  }
             else {
            response.writeHead(200,{"content-Type":"text/html"});
            response.write(data,"utf8");
             }
          response.end();
        });
        break;
        case '/recuperadati':
            const dati = oggettourl.query;

            console.log(dati);

            let messaggio = "";
            let invia = true;

            // --- Controllo di integrità se i campi sono vuoti ---
            if (!dati.email) {
                invia = false;
                messaggio += "Non inserita email\n";
            }
            if (!dati.name) {
                invia = false;
                messaggio += "Non inserito nome\n";
            }
            if (!dati.surname) {
                invia = false;
                messaggio += "Non inserito cognome\n";
            }
            //checkbox gestite in automatico come array
            if(!dati.gender) {
                invia = false;
                messaggio += "Selezionare genere\n";
            }
            if(!dati.date) {
                invia = false;
                messaggio += "Selezionare una data\n";
            }      
            if(!dati.password) {
                invia = false;
                messaggio += "Non inserita password\n";
            }
            if(dati.scuola == "Scuola superiore frequentata") {
                invia = false;
                messaggio += "Non selezionata scuola\n";
            }

            // patenti = dati.patente.join(", ");
            // commenti = dati.commenti;

            // --- Controllo di integrità con regex ---
            if (dati.email && !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(dati.email)) {
                invia = false;
                messaggio += "L'email non è in un formato valido\n";
            }
            if (dati.name && !/^[a-zA-Z\s]+$/.test(dati.name)) {
                invia = false;
                messaggio += "Il nome non è in un formato valido\n";
            }    
            if (dati.surname && !/^[a-zA-Z\s]+$/.test(dati.surname)) {
                invia = false;
                messaggio += "Il cognome non è in un formato valido\n";
            }     
            if (dati.password && !/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/.test(dati.password)) {
                invia = false;
                messaggio += "La password non è in un formato valido\n";
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
const server=http.createServer(requestHandler);
server.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});