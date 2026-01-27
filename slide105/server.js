const express = require("express");
const path = require("path");

let app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));

let nome = "";
let cognome = "";

app.get("/", (req, res) => {
  if (nome === "" && cognome === "") {
    res.render("form", { title: "Inserisci dati" });
  } else {
    // Connessione successiva, saluto
    res.render("saluto", {
      title: "Saluto",
      nome: nome,
      cognome: cognome
    });
  }
});

app.post("/salva", (req, res) => {
  nome = req.body.nome;
  cognome = req.body.cognome;
  res.redirect("/");
});

// Avvio server
app.listen(app.get("port"), () => {
  console.log("Server avviato sulla porta 3000");
});