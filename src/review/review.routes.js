import { Router } from 'express';
import {
  createReview,
  getReviewsByWorker,
  deleteReview,
  updateReview
} from './review.controller.js';
import { validateJwt, isClient } from '../../middlewares/validate.jwt.js';

const api = Router();

api.post('/createreview',[validateJwt, isClient], createReview);
api.get('/reviews/worker/:workerId',[validateJwt, isClient], getReviewsByWorker);
api.delete('/deletereview/:id',[validateJwt, isClient], deleteReview);
api.put('/updatereview/:id',[validateJwt, isClient], updateReview); // ⬅ Aquí se agrega la nueva ruta

export default api;
