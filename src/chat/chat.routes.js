import { Router } from 'express';
import {
  createOrGetChat,
  sendMessage,
  getUserChats,
  getChatById
} from './chat.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js';

const api = Router();

api.post('/createchat', [validateJwt], createOrGetChat);
api.post('/message', [validateJwt], sendMessage);
api.get('/allchat', [validateJwt], getUserChats);
api.get('/get/:chatId', [validateJwt], getChatById);

export default api;
