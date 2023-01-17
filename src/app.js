import createError from 'http-errors'
import express from 'express';
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import errorHandler from './middlewares/errorHandler.js'
import { viewsRouter } from './routes/index.js';



const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(viewsRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


//ErrorHandler must be declared at bottom
app.use(errorHandler);

export default app;