import { Router } from 'express';
import {
  createWorkerProfile,
  getAllWorkerProfiles,
  getWorkerProfileByUserId,
  updateWorkerProfile,
  deleteWorkerProfile
} from './workerProfile.controller.js';

import { validateJwt, isWorker } from '../../middlewares/validate.jwt.js';

const api = Router();

// Crear perfil
api.post('/create', [validateJwt, isWorker], createWorkerProfile);

// Obtener todos los perfiles
api.get('/all', validateJwt, getAllWorkerProfiles);

// Obtener perfil por ID de usuario
api.get('/user/:userId', validateJwt, getWorkerProfileByUserId);

// Actualizar perfil
api.put('/update', [validateJwt, isWorker], updateWorkerProfile);

// Eliminar perfil (opcional)
api.delete('/delete', [validateJwt, isWorker], deleteWorkerProfile);

export default api;
