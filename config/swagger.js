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
        url: 'https://compiladodeleis.com.br:3001',
        description: 'Produção'
      },
      {
        url: 'http://localhost:3001',
        description: 'Desenvolvimento'
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
        },
        Perfil: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nome: {
              type: 'string',
              enum: ['estudante', 'advogado', 'admin']
            }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nome: {
              type: 'string'
            },
            sobre: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            perfil: {
              type: 'string',
              enum: ['estudante', 'advogado', 'admin']
            }
          }
        },
        UsuarioCadastro: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: {
              type: 'string'
            },
            sobre: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            senha: {
              type: 'string',
              format: 'password'
            },
            perfil: {
              type: 'string',
              enum: ['estudante', 'advogado'],
              description: 'Opcional. Default: estudante. Não é possível se autocadastrar como admin.'
            }
          }
        },
        UsuarioLogin: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: {
              type: 'string',
              format: 'email'
            },
            senha: {
              type: 'string',
              format: 'password'
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
