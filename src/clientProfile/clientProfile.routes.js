import { Router } from 'express';
import {
  createClientProfile,
  getAllClientProfiles,
  updateClientProfile,
  deleteClientProfile
} from './clientProfile.controller.js';

import { validateJwt, isClient } from '../../middlewares/validate.jwt.js';

const api = Router();

// Crear perfil
api.post('/create', [validateJwt, isClient], createClientProfile);

// Obtener todos los perfiles
api.get('/all', validateJwt, getAllClientProfiles);

// Obtener perfil por ID de usuario
api.get('/user/:userId', validateJwt, getAllClientProfiles);

// Actualizar perfil
api.put('/update', [validateJwt, isClient], updateClientProfile);

// Eliminar perfil (opcional)
api.delete('/delete', [validateJwt, isClient], deleteClientProfile);

export default api;
