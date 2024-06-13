const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const app = express();
const { Server } = require('socket.io');
const dbConnect = require('./config/db.config');
const initRoutes = require('./routes');
const server = require('http').createServer(app);
const { socketHandler } = require('./socket/socket');
const { errHandler } = require('./middlewares/errorHandler');
app.use(
   cors({
      origin: process.env.CLIENT_URI,
      methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
   }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
dbConnect();
app.use(morgan('dev'));
initRoutes(app);

app.get('/run', (req, res) => {
   res.send('SERVER IS RUNNING');
});
const io = new Server(server, {
   cors: {
      origin: process.env.CLIENT_URI,
      methods: ['GET', 'POST'],
      credentials: true,
   },
});
socketHandler(io);

app.use(errHandler);
const PORT = process.env.SERVER_PORT || 3045;
server.listen(PORT, () => {
   console.log(`Server is running on ${PORT}`);
});
