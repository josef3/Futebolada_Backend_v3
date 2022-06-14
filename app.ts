import express from 'express';
import cors from 'cors';
//-------------------- Middlewares --------------------------
import errorMiddleware from './middleware/error.middleware';
//-------------------- Routes --------------------------
import weeksRoute from './routes/weeksRoute';
import yearsRoute from './routes/yearsRoute';
import yearPollsRoute from './routes/yearPollsRoute';
//----------------------------------------------------------

const app = express();

app.use(express.json());
app.use(cors());
app.disable('x-powered-by');

app.get('/', (req, res) => res.json('Welcome to Futebolada Backend!'));

app.use('/api/v3/weeks', weeksRoute);
app.use('/api/v3/years', yearsRoute);
app.use('/api/v3/year-polls', yearPollsRoute);

app.use(errorMiddleware);

export default app;
