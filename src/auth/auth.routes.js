//Rutas de autenticación
import { Router } from 'express'
import { login, register, test} from './auth.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js';


const api = Router();

//Rutas públicas
api.post('/login', login);

api.post('/register', register);

//Rutas privadas
api.get('/test', validateJwt, test);

export default api