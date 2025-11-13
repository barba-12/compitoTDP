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
            //per validazione sulla stessa pagina html
            let messaggio = "";
            let invia = false;
            messaggio = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <!-- boostrap -->
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <title>Document</title>
            </head>
            <body>
                <form name="RequestForm" action="/recuperadati" method="get">
                    <div style="margin: 2% 25%; border: 1px solid black; border-radius: 20px; text-align: center;">
                        <label style="margin-top: 1%;">FORM</label>
            `;

            // dichiarazione regex
            const regexEmail = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
            const regexName = /^[a-zA-Z\s]+$/;
            const regexPassword = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

            // form validation
            //nome
            if (oggettourl.query.name === "" || !regexName.test(oggettourl.query.name)) {
                invia = true;
                messaggio += `
                <div class="mb-3" style="margin: 3% 5%;">
                    <input class="form-control" name="name" placeholder="name">
                    <div style="margin-top: 1%;" class="alert alert-warning" role="alert">inserire un nome valido</div>
                </div>`;
            } else {
                messaggio += `
                <div class="mb-3" style="margin: 3% 5%;">
                    <input class="form-control" value="${oggettourl.query.name}" name="name" placeholder="name">
                </div>`;
            }

            //cognome
            if (oggettourl.query.surname === "" || !regexName.test(oggettourl.query.surname)) {
                invia = true;
                messaggio += `
                <div class="mb-3" style="margin: 3% 5%;">
                    <input class="form-control" name="surname" placeholder="surname">
                    <div style="margin-top: 1%;" class="alert alert-warning" role="alert">inserire un cognome valido</div>
                </div>`;
            } else {
                messaggio += `
                <div class="mb-3" style="margin: 3% 5%;">
                    <input class="form-control" value="${oggettourl.query.surname}" name="surname" placeholder="surname">
                </div>`;
            }

            //email
            if (oggettourl.query.email === "" || !regexEmail.test(oggettourl.query.email)) {
                invia = true;
                messaggio += `
                <div class="mb-3" style="margin: 3% 5%;">
                    <input class="form-control" id="exampleFormControlInput1" name="email" placeholder="name@example.com">
                    <div style="margin-top: 1%;" class="alert alert-warning" role="alert">inserire una email valida</div>
                </div>`;
            } else {
                messaggio += `
                <div class="mb-3" style="margin: 3% 5%;">
                    <input class="form-control" id="exampleFormControlInput1" value="${oggettourl.query.email}" name="email" placeholder="email@example.com">
                </div>`;
            }
            
            //data
            const dataInserita = oggettourl.query.date || "";
            if (dataInserita === ""){
                messaggio += `
                <div class="form-group" style="margin: 3% 25%;">
                    <input class="form-control" type="date" name="date">
                    <div style="margin-top: 1%;" class="alert alert-warning" role="alert">inserire una data</div>
                </div>`
            } else {
                messaggio += `
                <div class="form-group" style="margin: 3% 25%;">
                    <input class="form-control" type="date" value="${oggettourl.query.date}" name="date">
                </div>`
            }


            //gender
            if (!oggettourl.query.gender) {
                invia = true;
                messaggio += `
                <div style="margin: 3% 5%; text-align: left !important;">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="gender" value="Male" id="radioDefault1">
                        <label class="form-check-label">
                            Male
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="gender" value="Female" id="radioDefault2">
                        <label class="form-check-label">
                            Female
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="gender" value="Other" id="radioDefault3">
                        <label class="form-check-label">
                            Other
                        </label>
                    </div>
                </div>
                <div style="margin: 1% 5%;" class="alert alert-warning" role="alert">selezionare un genere</div>`;
            } else {
                const gender = oggettourl.query.gender;
                const checked = (val) => (gender === val ? "checked" : "");
                messaggio += `
                <div style="margin: 3% 5%; text-align: left !important;">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="gender" value="Male" id="radioDefault1" ${checked("Male")}>
                        <label class="form-check-label">
                            Male
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="gender" value="Female" id="radioDefault2" ${checked("Female")}>
                        <label class="form-check-label">
                            Female
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="gender" value="Other" id="radioDefault3" ${checked("Other")}>
                        <label class="form-check-label">
                            Other
                        </label>
                    </div>
                </div>`;
            }

            //password
            if (oggettourl.query.password === "" || !regexPassword.test(oggettourl.query.password)) {
                invia = true;
                messaggio += `
                <div class="mb-3" style="margin: 3% 5%;">
                    <input type="password" class="form-control" id="inputPassword" name="password" placeholder="password">
                    <div style="margin-top: 1%;" class="alert alert-warning" role="alert">inserire una password valida</div>
                </div>`;
            } else {
                messaggio += `
                <div class="mb-3" style="margin: 3% 5%;">
                    <input type="password" class="form-control" id="inputPassword" value="${oggettourl.query.password}" name="password" placeholder="password">
                </div>`;
            }
            
            //patente
            var patenti = oggettourl.query.patente;
            
            // normalizza in array
            if (!patenti) {
                patenti = [];
            } else if (!Array.isArray(patenti)) {
                patenti = [patenti];
            }

            const checked = (val) => (patenti.includes(val) ? "checked" : "");
            messaggio += `
                <div style="margin: 3% 5%; text-align: left !important;">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="patente" value="Macchina" id="checkDefault1" ${checked("Macchina")}>
                        <label class="form-check-label">Macchina</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="patente" value="Moto" id="checkChecked2" ${checked("Moto")}>
                        <label class="form-check-label">Moto</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="patente" value="Barca" id="checkChecked3" ${checked("Barca")}>
                        <label class="form-check-label">Barca</label>
                    </div>
                </div>`;

            //scuola
            if (oggettourl.query.scuola === "") {
                invia = true;
                messaggio += `
                <div style="margin: 3% 5%;">
                <select class="form-select" name="scuola" aria-label="Default select example">
                    <option selected value="">Scuola superiore frequentata</option>
                    <option value="1">Istituto tecnico</option>
                    <option value="3">Istituto porfessionale</option>
                    <option value="2">Liceo</option>
                </select>
                <div style="margin-top: 1%;" class="alert alert-warning" role="alert">selezionare una scuola</div>
                </div>`;
            } else {
                const scuola = oggettourl.query.scuola;
                const selected = (val) => (scuola === val ? "selected" : "");
                messaggio += `
                <div style="margin: 3% 5%;">
                <select class="form-select" name="scuola" aria-label="Default select example">
                    <option ${selected("")} value="">Scuola superiore frequentata</option>
                    <option ${selected("1")} value="1">Istituto tecnico</option>
                    <option ${selected("3")} value="3">Istituto porfessionale</option>
                    <option ${selected("2")} value="2">Liceo</option>
                </select>
                </div>`;
            }

            // Adding the submit button
            messaggio += `      
                        <div style="margin: 3% 5%;">
                            <div class="input-group">
                                <textarea class="form-control" aria-label="With textarea" value="${oggettourl.query.commenti}" name="commenti" placeholder="text area"></textarea>
                            </div>
                        </div>

                        <div class="mb-3" style="margin: 3% 5%;">
                            <input class="form-control" type="file" id="formFile">
                        </div>

                        <button style="margin-bottom: 1%;" type="submit" value="Invia" class="btn btn-success">Invia</button>
                    </div>
                </form>
            </body>

            <!-- boostrap -->
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </html>`;

            // If there is any invalid field, return the form with error messages
            if (invia === true) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(messaggio);
                response.end();
            } else {
                // Tutti i campi validi — mostriamo la pagina di riepilogo
                const dati = oggettourl.query;

                // Normalizzo i checkbox patente (array o singolo valore)
                let patenti = [];
                if (dati.patente) {
                    patenti = Array.isArray(dati.patente) ? dati.patente : [dati.patente];
                }

                // Scuole leggibili
                const scuole = {
                    "1": "Istituto tecnico",
                    "2": "Liceo",
                    "3": "Istituto professionale"
                };
                const scuolaLabel = scuole[dati.scuola] || "Nessuna selezionata";

                // HTML di riepilogo
                const recapPage = `
                <!DOCTYPE html>
                <html lang="it">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                    <title>Riepilogo Dati</title>
                </head>
                <body style="margin: 2% 20%;">
                    <div class="card shadow p-4">
                        <h2 class="text-center mb-4">Riepilogo Dati Inseriti</h2>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><strong>Nome:</strong> ${dati.name}</li>
                            <li class="list-group-item"><strong>Cognome:</strong> ${dati.surname}</li>
                            <li class="list-group-item"><strong>Email:</strong> ${dati.email}</li>
                            <li class="list-group-item"><strong>Data:</strong> ${dati.date}</li>
                            <li class="list-group-item"><strong>Genere:</strong> ${dati.gender}</li>
                            <li class="list-group-item"><strong>Patenti:</strong> ${patenti.join(", ") || "Nessuna"}</li>
                            <li class="list-group-item"><strong>Scuola:</strong> ${scuolaLabel}</li>
                            <li class="list-group-item"><strong>Commenti:</strong> ${dati.commenti || "Nessuno"}</li>
                        </ul>
                        <div class="mt-4 text-center">
                            <a href="/" class="btn btn-primary">Torna alla home</a>
                        </div>
                    </div>
                </body>
                </html>
                `;

                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(recapPage);
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