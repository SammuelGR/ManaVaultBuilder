import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import authMiddleware from './middlewares/auth';
import deckRoutes from './routes/deckRoutes';
import sessionRoutes from './routes/sessionRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/usuarios", userRoutes);
app.use("/session", sessionRoutes);
app.use("/decks", authMiddleware, deckRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
