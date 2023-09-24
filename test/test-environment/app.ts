import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import connectBusboy from 'connect-busboy';
import { errorHandler } from '../../src/middlewares/index.ts';
import userRouter from '../../src/routes/user-router.ts';
import contentRouter from '../../src/routes/content-router.ts';
import buzzwordRouter from '../../src/routes/buzzword-router.ts';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(connectBusboy());

app.use('/users', userRouter);
app.use('/contents', contentRouter);
app.use('/buzzwords', buzzwordRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(errorHandler);

export default app;
