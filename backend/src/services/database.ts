import axios from 'axios';

import {
  Deck,
  User,
} from '../types';

const API_KEY = process.env.JSONBIN_API_KEY;

const USERS_BIN_ID = process.env.JSONBIN_USERS_BIN_ID;
const USERS_BIN_URL = `https://api.jsonbin.io/v3/b/${USERS_BIN_ID}`;

const DECKS_BIN_ID = process.env.JSONBIN_DECKS_BIN_ID;
const DECKS_BIN_URL = `https://api.jsonbin.io/v3/b/${DECKS_BIN_ID}`;

export const database = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await axios.get(USERS_BIN_URL, {
        headers: {
          "X-Master-Key": API_KEY,
        },
      });

      return response.data.record || [];
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);

      throw new Error("Falha na conexão com JSONBin.");
    }
  },
  async setUsers(users: User[]): Promise<void> {
    try {
      await axios.put(USERS_BIN_URL, users, {
        headers: {
          "X-Master-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao salvar usuários:", error);

      throw new Error("Falha na conexão com JSONBin.");
    }
  },
  async getDecks(): Promise<Deck[]> {
    try {
      const response = await axios.get(DECKS_BIN_URL, {
        headers: {
          "X-Master-Key": API_KEY,
        },
      });

      return response.data.record || [];
    } catch (error) {
      console.error("Erro ao buscar decks:", error);

      throw new Error("Falha na conexão com JSONBin.");
    }
  },
  async setDecks(decks: Deck[]): Promise<void> {
    try {
      await axios.put(DECKS_BIN_URL, decks, {
        headers: {
          "X-Master-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Erro ao salvar decks:", error);

      throw new Error("Falha na conexão com JSONBin.");
    }
  },
};
