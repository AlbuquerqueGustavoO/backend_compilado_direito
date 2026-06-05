const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const schedulingService = require('./services/scheduling-service');
const scrapingService = require('./services/scraping-service');
const scrapingRoutes = require('./config/scraping-config');

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
const scrapingErrors = require('./router/scraping-errors');
const Contato = require('./router/contato');



const app = express();

// Carregar os certificados SSL com tratamento de erro
let httpsServer;
try {
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/compiladodeleis.com.br/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/compiladodeleis.com.br/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/compiladodeleis.com.br/chain.pem', 'utf8');

    const credentials = { key: privateKey, cert: certificate, ca: ca };
    httpsServer = https.createServer(credentials, app);
    console.log('✓ Certificados SSL carregados com sucesso');
} catch (error) {
    console.warn('⚠ Certificados SSL não encontrados. Usando HTTP para desenvolvimento.');
    console.warn(`Erro: ${error.message}`);
    httpsServer = null;
}

app.use(cors());

app.use(bodyParser.json())
app.use(express.json());

// http://localhost:3001/api-docs/#/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


app.use((req, res, next) => {
    const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:4200' || 'https://compiladodeleis.com.br').split(',').map(s => s.trim());
    const origin = req.headers.origin;

    if (allowedOrigins.includes('*')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.length > 0) {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    }

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
app.use('/scraping-errors', scrapingErrors);
app.use('/contato', Contato);

setTimeout(() => {
    console.log('Inicializando agendador de scraping para todas as rotas...');
    console.log(`Total de rotas a agendar: ${scrapingRoutes.length}`);
    
    scrapingRoutes.forEach((route, index) => {
        // Ensure at least 5 minutes between scheduled scrapes
        const baseHour = typeof route.startHour === 'number' ? route.startHour : 22;
        const baseMinute = typeof route.startMinute === 'number' ? route.startMinute : 0;
        const totalMinutes = baseHour * 60 + baseMinute + (index * 5);
        const scheduledHour = Math.floor(totalMinutes / 60) % 24;
        const scheduledMinute = totalMinutes % 60;

        schedulingService.scheduleDaily(
            route.name,
            route.url,
            route.model,
            scheduledHour,
            scheduledMinute
        );
        console.log(`✓ Agendado: ${route.name} às ${scheduledHour}:${String(scheduledMinute).padStart(2, '0')}`);
    });
    
    console.log('Todas as rotas foram agendadas com sucesso!');
}, 2000);

if (httpsServer) {
    httpsServer.listen(3001, () => {
        console.info('✓ Servidor HTTPS iniciado na porta 3001: https://compiladodeleis.com.br:3001');
    });
} else {
    app.listen(3001, () => {
        console.log("✓ Servidor HTTP iniciado na porta 3001: http://localhost:3001");
        console.log("Para produção com HTTPS, configure os certificados SSL em /etc/letsencrypt/live/compiladodeleis.com.br/");
    });
}