const express = require('express');
const app = express();
const cors = require('cors'); // Importe o módulo cors
//const Scraping = require('./scraping');
const bodyParser = require('body-parser');

//const rotas = require('./router/router');
//const rotaSacraping = require('./router/civil');
const rotaTeste = require('./router/teste');


//const router = require('./router/civilscraping');//SCRAPING DIRETO, FUNCIONANDO

app.use(cors()); // Use o middleware cors aqui

app.use(bodyParser.json())
app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); // Corrigido para remover a barra no final
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


//app.use('/teste', rotas);
//app.use('/assss', rotaSacraping);
app.use('/civilScraping', rotaTeste);
//app.use('/axxx', router);//SCRAPING DIRETO, FUNCIONANDO

app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});