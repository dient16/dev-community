const authRouter = require('./auth');
const userRouter = require('./user');
const postRouter = require('./post');
const { notFound, errHandler } = require('../middlewares/errorHandler');

const initRoutes = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
    app.use('/api/post', postRouter);
    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRoutes;
