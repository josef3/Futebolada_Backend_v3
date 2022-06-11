import express from 'express';
import cors from 'cors';
//-------------------- Middlewares --------------------------
import errorMiddleware from './middleware/error.middleware';
//-------------------- Routes --------------------------
import yearsRoute from './routes/yearsRoute';
//----------------------------------------------------------

const app = express();

app.use(express.json());
app.use(cors());
app.disable('x-powered-by');

app.get('/', (req, res) => res.json('Welcome to Futebolada Backend!'));

app.use('/api/v3/years', yearsRoute);

app.use(errorMiddleware);

export default app;
