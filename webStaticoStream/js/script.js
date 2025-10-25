document.getElementById("btn").onclick = function() {
 let h1 = document.getElementById("cambiaTesto");
    if(h1.innerText == "testo1") h1.innerText = "testo2";
    else h1.innerText = "testo1";
};