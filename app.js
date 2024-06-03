const express = require('express');
const cors = require('cors'); // Importe o módulo cors
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');

const civil = require('./router/civil');
const civilProcesso = require('./router/civil-codigo-processo');
const civilNormas = require('./router/civil-normas-direito-brasileiro');
const constituicao = require('./router/constituicao');
const constituicaoEstadoSp = require('./router/constituicao-estado_sp');
const administrativoContratos = require('./router/administrativo-contratos');
const administrativoImprobidade = require('./router/administrativo-improbilidade');
const administrativoServicosPublicos = require('./router/administrativo-servicos-publicos');
const administrativoProcesso = require('./router/administrativo-processo');
const administrativoServidoresPublicos = require('./router/administrativo-servidores-publico');
const administrativoParceriaPublica = require('./router/administrativo-parceria-publica');
const tributarioCodigo = require('./router/tributario-codigo');
const penalCodigo = require('./router/penal-codigo');
const penalCodigoProcesso = require('./router/penal-codigo-processo');
const penalCrimesHediondos = require('./router/penal-crimes-hediondos');
const penalMariaPenha = require('./router/penal-maria-penha');
const penalDrogas = require('./router/penal-drogas');
const penalOrganizacaoCriminosa = require('./router/penal-organizacao-criminosa');
const penalOcultacaoBens = require('./router/penal-ocultacao-bens');



const app = express();

// Carregar os certificados SSL
const privateKey = fs.readFileSync('/etc/letsencrypt/live/compiladodeleis.com.br/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/compiladodeleis.com.br/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/compiladodeleis.com.br/chain.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate, ca: ca };
const httpsServer = https.createServer(credentials, app);

app.use(cors()); // Use o middleware cors aqui

app.use(bodyParser.json())
app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://compiladodeleis.com.br'); //http://91.108.126.217 //http://localhost:4200 Corrigido para remover a barra no final
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/civil', civil);
app.use('/civil-codigo-processo', civilProcesso);
app.use('/civil-direito-brasileiro', civilNormas);
app.use('/constituicao', constituicao);
app.use('/constituicaoEstadoSP', constituicaoEstadoSp);
app.use('/administrativoContratos', administrativoContratos);
app.use('/administrativoImprobidade', administrativoImprobidade);
app.use('/administrativoServicosPublicos', administrativoServicosPublicos);
app.use('/administrativoProcesso', administrativoProcesso);
app.use('/administrativoServidoresPublico', administrativoServidoresPublicos);
app.use('/administrativoParceriaPublico', administrativoParceriaPublica);
app.use('/tributarioCodigo', tributarioCodigo);
app.use('/penalCodigo', penalCodigo);
app.use('/penalCodigoProcesso', penalCodigoProcesso);
app.use('/penalCrimesHediondos', penalCrimesHediondos);
app.use('/penalMariaPenha', penalMariaPenha);
app.use('/penalDrogas', penalDrogas);
app.use('/penalOrganizacaoCriminosa', penalOrganizacaoCriminosa);
app.use('/penalOcultacaoBens', penalOcultacaoBens);


httpsServer.listen(3001, () => {
    console.info('Servidor HTTPS iniciado na porta 3001: https://compiladodeleis.com.br:3001');
});

// app.listen(3001, () => {
//     console.log("Servidor iniciado na porta 8080: http://localhost:3001");
// });