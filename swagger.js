/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'NinazBaby',
      version: '1.0.0',
      description: 'API documentation generated with Swagger',
    },
    servers: [
      { url: 'http://localhost:8000' }, // Specify the base path for resolving URLs
    ],
  },
  apis: [path.resolve(__dirname, './routes/*.js')], // Use absolute path to your API route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
