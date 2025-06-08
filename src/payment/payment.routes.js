import { Router } from 'express';
import {
  createPayment,
  getUserPayments
} from './payment.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js';

const api = Router();

// Cualquier usuario autenticado puede ver sus pagos (ajusta según tus reglas)
api.post('/create', validateJwt, createPayment);
api.get('/my-payments', validateJwt, getUserPayments);

export default api;
