import { join } from 'path';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.static(join(__dirname, '../../client/build')));
app.use(routes);

export default app;
