import bcrypt from 'bcrypt';
import {
  Request,
  Response,
} from 'express';
import { z } from 'zod';

import { signToken } from '../services/authService';
import { database } from '../services/database';
import { withRequired } from '../utils/validations';

const loginSchema = z.object({
  email: z.string(withRequired("Email")).email("Email inválido"),
  password: z.string(withRequired("Senha")).min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    let errorMsg = "";

    result.error.issues.forEach(({ message }) => {
      errorMsg += message + ". ";
    });

    res.status(400).json({ erro: errorMsg.trim() });
    return;
  }

  try {
    const usuarios = await database.getUsers();

    const usuario = usuarios.find((u) => u.email === email);

    const passwordMatches = !!usuario && (await bcrypt.compare(password, usuario.password));

    if (!usuario || !passwordMatches) {
      res.status(401).json({ erro: "Credenciais inválidas." });
      return;
    }

    const token = signToken(usuario.id);

    res.json({ mensagem: "Login bem-sucedido", usuario: { ...usuario, password: undefined }, token });
  } catch (error) {
    res.status(500).json({ erro: `Erro ao processar o login: ${error}` });
  }
};
