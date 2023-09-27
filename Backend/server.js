require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { socketHandler } = require('./utils/socket');
const app = express();
const { Server } = require('socket.io');
require('./config/db.config');
const initRoutes = require('./routes');
const server = require('http').createServer(app);

app.use(
    cors({
        origin: process.env.SERVER_URI,
        methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());

initRoutes(app);
app.use(
    session({
        secret: process.env.SECERT_SESSION,
        resave: false,
        saveUninitialized: true,
    }),
);
app.use(passport.initialize());
app.use(passport.session());

const io = new Server(server, {
    cors: {
        origin: process.env.SERVER_URI,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
socketHandler(io);

const PORT = process.env.PORT || 3045;
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
