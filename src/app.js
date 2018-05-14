import express from 'express';
import cors from 'cors';

import rotas from './rotas';

const app = express();

app.use(cors());

app.use(rotas);

export default app;
