import { Router } from 'express';
import {
  createJobRequest,
  getClientJobRequests,
  getWorkerJobRequests,
  updateJobRequestStatus,
  deleteJobRequest
} from './jobRequest.controller.js';

import { validateJwt, isClient, isWorker } from '../../middlewares/validate.jwt.js';

const router = Router();

// Cliente crea una solicitud de trabajo
router.post('/jobrequests', [validateJwt, isClient], createJobRequest);

// Cliente obtiene sus solicitudes enviadas
router.get('/jobrequests/client', [validateJwt, isClient], getClientJobRequests);

//Trabajador obtiene solicitudes recibidas
router.get('/jobrequests/worker', [validateJwt, isWorker], getWorkerJobRequests);

//Trabajador cambia el estado de una solicitud (CONFIRMED, CANCELLED, COMPLETED)
router.put('/jobrequests/:id/status', [validateJwt, isWorker], updateJobRequestStatus);

//Cliente puede eliminar su solicitud
router.delete('/deletejobrequests/:id', [validateJwt, isClient], deleteJobRequest);

export default router;
