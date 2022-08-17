require('dotenv').config();

import express from 'express';
import cors from 'cors';

import { handleJSONParse, errorResponder } from './src/middlewares/errorMiddleware';
import router from './src/routes';

const app = express();

// Express config
app.use(
  cors({
    origin: process.env.WEB_HOST,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);
app.use(express.json());
app.use(handleJSONParse); // handle json error
app.use('/', router);
app.use(errorResponder);

const PORT = process.env.PORT || 3777;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});
