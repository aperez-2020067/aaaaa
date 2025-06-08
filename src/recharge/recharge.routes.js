import { Router } from 'express';
import {
  addRecharge,
  getRechargeInfo,
  discountCommission
} from './recharge.controller.js';
import { validateJwt, isWorker } from '../../middlewares/validate.jwt.js';

const api = Router();

// Solo trabajadores pueden hacer recargas, ver saldo y pagar comisiones
api.post('/add', [validateJwt, isWorker], addRecharge);
api.get('/info', [validateJwt, isWorker], getRechargeInfo);
api.post('/commission', [validateJwt, isWorker], discountCommission);

export default api;
