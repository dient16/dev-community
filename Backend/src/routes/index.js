const authRouter = require('./auth');
const userRouter = require('./user');
const postRouter = require('./post');
const commentRouter = require('./comment');
const tagRouter = require('./tag');

const { notFound, errHandler } = require('../middlewares/errorHandler');

const initRoutes = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
    app.use('/api/post', postRouter);
    app.use('/api/comment', commentRouter);
    app.use('/api/tag', tagRouter);

    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRoutes;
