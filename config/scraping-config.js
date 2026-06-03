// Configuração centralizada de scraping
// Cada rota inicia 1 minuto depois da anterior, começando às 22:03

const CivilProcesso = require('../models/civil-codigo-processo');
const CivilNormas = require('../models/civil-normas-direito-brasileiro');
const ConstituicaoFederal = require('../models/constituicao');
const ConstituicaoEstadoSP = require('../models/constituicao-estado-sp');
const AdministrativoContratos = require('../models/administrativo-contratos');
const AdministrativoImprobidade = require('../models/administrativo-improbilidade');
const AdministrativoServicosPublicos = require('../models/administrativo-servicos-publico');
const AdministrativoProcesso = require('../models/administrativo-processo');
const AdministrativoServidoresPublicos = require('../models/administrativo-servidores-publico');
const AdministrativoParceriaPublica = require('../models/administrativo-parceria-publica');
const TributarioCodigo = require('../models/tributario-codigo');
const PenalCodigo = require('../models/penal-codigo');
const PenalCodigoProcesso = require('../models/penal-codigo-processo');
const PenalCrimesHediondos = require('../models/penal-crimes-hediondos');
const PenalMariaPenha = require('../models/penal-maria-penha');

const scrapingRoutes = [
    {
        name: 'civil-codigo-processo',
        url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm',
        model: CivilProcesso,
        startHour: 22,
        startMinute: 3
    },
    {
        name: 'civil-normas-direito-brasileiro',
        url: 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp95.htm',
        model: CivilNormas,
        startHour: 22,
        startMinute: 4
    },
    {
        name: 'constituicao-federal',
        url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',
        model: ConstituicaoFederal,
        startHour: 22,
        startMinute: 5
    },
    {
        name: 'constituicao-estado-sp',
        url: 'https://www.al.sp.gov.br/repositorio/legislacao/constituicao/1989/compilacao-constituicao-0-05.10.1989.html',
        model: ConstituicaoEstadoSP,
        startHour: 22,
        startMinute: 6
    },
    {
        name: 'administrativo-contratos',
        url: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm',
        model: AdministrativoContratos,
        startHour: 22,
        startMinute: 7
    },
    {
        name: 'administrativo-improbilidade',
        url: 'https://www.planalto.gov.br/ccivil_03/leis/l8429.htm',
        model: AdministrativoImprobidade,
        startHour: 22,
        startMinute: 8
    },
    {
        name: 'administrativo-servicos-publicos',
        url: 'https://www.planalto.gov.br/ccivil_03/leis/l8987compilada.htm',
        model: AdministrativoServicosPublicos,
        startHour: 22,
        startMinute: 9
    },
    {
        name: 'administrativo-processo',
        url: 'https://www.planalto.gov.br/ccivil_03/leis/l9784.htm',
        model: AdministrativoProcesso,
        startHour: 22,
        startMinute: 10
    },
    {
        name: 'administrativo-servidores-publico',
        url: 'https://www.planalto.gov.br/ccivil_03/leis/l8112cons.htm',
        model: AdministrativoServidoresPublicos,
        startHour: 22,
        startMinute: 11
    },
    {
        name: 'administrativo-parceria-publica',
        url: 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l11079.htm',
        model: AdministrativoParceriaPublica,
        startHour: 22,
        startMinute: 12
    },
    {
        name: 'tributario-codigo',
        url: 'https://www.planalto.gov.br/ccivil_03/leis/l5172compilada.htm',
        model: TributarioCodigo,
        startHour: 22,
        startMinute: 13
    },
    {
        name: 'penal-codigo',
        url: 'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm',
        model: PenalCodigo,
        startHour: 22,
        startMinute: 14
    },
    {
        name: 'penal-codigo-processo',
        url: 'https://www.planalto.gov.br/ccivil_03/leis/l13105compilado.htm',
        model: PenalCodigoProcesso,
        startHour: 22,
        startMinute: 15
    },
    {
        name: 'penal-crimes-hediondos',
        url: 'https://www.planalto.gov.br/ccivil_03/leis/l8072.htm',
        model: PenalCrimesHediondos,
        startHour: 22,
        startMinute: 16
    },
    {
        name: 'penal-maria-penha',
        url: 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11340.htm',
        model: PenalMariaPenha,
        startHour: 22,
        startMinute: 17
    }
];

module.exports = scrapingRoutes;
