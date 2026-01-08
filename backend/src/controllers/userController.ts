import bcrypt from 'bcrypt';
import {
  Request,
  Response,
} from 'express';
import { z } from 'zod';

import { signToken } from '../services/authService';
import { database } from '../services/database';
import { User } from '../types';
import { withRequired } from '../utils/validations';

export const listarUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = (await database.getUsers()).map((usuario: User) => ({ ...usuario, password: undefined }));

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: `Erro ao ler os usuários: ${error}` });
  }
};

const registerSchema = z.object({
  email: z.string(withRequired("Email")).email("Email inválido"),
  username: z.string(withRequired("Username")).min(3, "O username deve ter pelo menos 3 caracteres"),
  password: z.string(withRequired("Senha")).min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const cadastrarUsuario = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  const result = registerSchema.safeParse({ email, username, password });

  if (!result.success) {
    let errorMsg = "";

    result.error.issues.forEach((issue) => {
      errorMsg += issue.message + ". ";
    });

    res.status(400).json({ erro: errorMsg.trim() });
    return;
  }

  try {
    const usuarios = await database.getUsers();

    const emailJaExiste = usuarios.find((u) => u.email === email);
    if (emailJaExiste) {
      res.status(400).json({ erro: "Email já cadastrado." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const novoUsuario = {
      id: `user_${Date.now()}`,
      email,
      username,
      password: passwordHash,
      createdAt: new Date().toISOString(),
    };

    usuarios.push(novoUsuario);
    await database.setUsers(usuarios);

    const token = signToken(novoUsuario.id);

    res.status(201).json({ usuario: { ...novoUsuario, password: undefined }, token });
  } catch (error) {
    res.status(500).json({ erro: `Erro ao cadastrar o usuário: ${error}` });
  }
};
