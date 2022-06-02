import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import { errorHandler, errorNotFoundHandler } from './middlewares/errorHandler';

// Routes
import { index } from './routes/index';
import { rollcall } from './routes/rollcall';
// Create Express server
export const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);

app.use(cors);
app.use(express.json());
app.use(logger('dev'));

app.use('/', index);
app.use('/rollcall', rollcall);

app.use(errorNotFoundHandler);
app.use(errorHandler);
