const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Compilado de Leis API',
      version: '1.0.0',
      description: 'API para acesso centralizado a documentos legais brasileiros com scraping automático',
      contact: {
        name: 'Compilado de Leis',
        url: 'https://compiladodeleis.com.br'
      }
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER_URL || 'http://localhost:3001',
        description: process.env.SWAGGER_SERVER_URL ? 'Produção' : 'Desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Conteudo: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Conteúdo extraído do documento'
            },
            referencia: {
              type: 'string',
              description: 'URL de referência do documento'
            },
            ultimoScraping: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora do último scraping'
            }
          }
        },
        Status: {
          type: 'object',
          properties: {
            exists: {
              type: 'boolean',
              description: 'Se os dados existem no banco'
            },
            ultimoScraping: {
              type: 'string',
              format: 'date-time',
              description: 'Data do último scraping'
            },
            referencia: {
              type: 'string',
              description: 'URL de referência'
            },
            conteudoLength: {
              type: 'integer',
              description: 'Tamanho do conteúdo em caracteres'
            }
          }
        },
        ScrapingResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            url: {
              type: 'string'
            }
          }
        },
        Erro: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: ['./router/*.js']
};

const specs = swaggerJsdoc(options);
module.exports = specs;
