const express = require('express');
const cors = require('cors'); // Importe o módulo cors
const bodyParser = require('body-parser');
const civil = require('./router/civil');
const civilProcesso = require('./router/civil-codigo-processo');
const civilNormas = require('./router/civil-normas-direito-brasileiro');
const constituicao = require('./router/constituicao');
const constituicaoEstadoSp = require('./router/constituicao-estado_sp');

const app = express();

app.use(cors()); // Use o middleware cors aqui

app.use(bodyParser.json())
app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');//54.94.127.45 //http://91.108.126.217 Corrigido para remover a barra no final
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/civil', civil);
app.use('/civil-codigo-processo', civilProcesso);
app.use('/civil-direito-brasileiro', civilNormas);
app.use('/constituicao', constituicao);
app.use('/constituicaoEstadoSP', constituicaoEstadoSp);
//app.use('/axxx', router);//SCRAPING DIRETO, FUNCIONANDO

app.listen(3001, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:3001");
});