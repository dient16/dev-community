const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
module.exports = router;
