const fs=require("fs");
const http=require("http");
const url = require("url");
const hostname='127.0.0.1';
const port=3000;
function requestHandler(request,response) {
	let oggettourl=url.parse(request.url,"true");
	console.log(oggettourl.href); 
	const path =oggettourl.pathname; //per ottenere il nome della pagina richiesta
	console.log(path); 
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
		let messaggio = "";
		let invia = false;
		messaggio = `
		<html>
		<head> 
		<title>Login Utente</title>
		</head>
		<body>
		<form action="recuperadati" method="GET">
		`;

		// Regular expression for name and surname validation
		const regex = /^[a-zA-Z\s]+$/;

		// Nome validation
		if (oggettourl.query.nome === "" || !regex.test(oggettourl.query.nome)) {
			invia = true;
			messaggio += `
			<label for="user" style="color:red;">Nome:</label><br>
			<input type="text" id="user" name="nome" value="" size="30" style="border: 1px solid red;">&nbsp<span style="color:red;">Inserisci un nome valido</span><br><br>`;
		} else {
			messaggio += `
			<label for="user">Nome:</label><br>
			<input type="text" id="user" name="nome" value="${oggettourl.query.nome}" size="30"><br><br>`;
		}

		// Cognome validation
		if (oggettourl.query.cognome === "" || !regex.test(oggettourl.query.cognome)) {
			invia = true;
			messaggio += `
			<label for="cognome" style="color:red;">Cognome:</label><br>
			<input type="text" id="cognome" name="cognome" value="" size="30" style="border: 1px solid red;">&nbsp<span style="color:red;">Inserisci un cognome valido</span><br><br>`;
		} else {
			messaggio += `
			<label for="cognome">Cognome:</label><br>
			<input type="text" id="cognome" name="cognome" value="${oggettourl.query.cognome}" size="30"><br><br>`;
		}
		// Adding the submit button
		messaggio += `
		<input type="submit" value="Invia"></form>
		</body>
		</html>`;
		// If there is any invalid field, return the form with error messages
		if (invia === true) {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(messaggio);
			response.end();
		} else {
			// No errors, form is valid
			response.writeHead(200, {'Content-Type': 'text/plain'});
			response.write('Form compilato in modo corretto');
			response.end();
		}
		break;
		}
}
const server=http.createServer(requestHandler);
server.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});


