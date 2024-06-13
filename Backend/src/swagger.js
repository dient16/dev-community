require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.1.0' });

const doc = {
   info: {
      version: '1.0.0',
      title: 'Dev Community API',
      description: 'This API provides functionalities for a developer community platform.',
   },
   host: process.env.SERVER_URI || 'http://localhost:6006',
   basePath: '/',
   schemes: ['http', 'https'],
   consumes: ['application/json'],
   produces: ['application/json'],
   securityDefinitions: {
      apiKeyAuth: {
         type: 'apiKey',
         in: 'header',
         name: 'X-API-Key',
         description: 'API Key needed to access the endpoints',
      },
      bearerAuth: {
         type: 'http',
         scheme: 'bearer',
         bearerFormat: 'JWT',
         description:
            'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
   },
};

const outputFile = './swagger-output.json';
const routes = ['./src/routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc).then(() => {
   require('./index.js'); // your project's root file
});
