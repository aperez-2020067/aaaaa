import JobRequest from './jobRequest.model.js';
import User from '../user/user.model.js';

// Crear una solicitud de trabajo (cliente → trabajador)
export const createJobRequest = async (req, res) => {
  try {
    const { worker, description, agreedPrice } = req.body;
    const client = req.user.uid; 

    // Validar usuario y roles
    const clientUser = await User.findById(client);
    const workerUser = await User.findById(worker);

    if (!clientUser || clientUser.role !== 'CLIENT') {
      return res.status(403).send({ success: false, message: 'Only CLIENT users can send job requests' });
    }

    if (!workerUser || workerUser.role !== 'WORKER') {
      return res.status(403).send({ success: false, message: 'Target user is not a WORKER' });
    }

    const newRequest = new JobRequest({
      client,
      worker,
      description,
      agreedPrice
    });

    await newRequest.save();

    return res.status(201).send({ success: true, message: 'Job request sent', request: newRequest });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error creating job request', error });
  }
};

// Obtener solicitudes enviadas por el cliente
export const getClientJobRequests = async (req, res) => {
  try {
    const client = req.user.uid;
    const requests = await JobRequest.find({ client })
      .populate('worker', 'username name')
      .sort({ createdAt: -1 });

    return res.send({ success: true, requests });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error fetching job requests', error });
  }
};

// Obtener solicitudes recibidas por el trabajador
export const getWorkerJobRequests = async (req, res) => {
  try {
    const worker = req.user.uid;
    const requests = await JobRequest.find({ worker })
      .populate('client', 'username name')
      .sort({ createdAt: -1 });

    return res.send({ success: true, requests });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error fetching job requests', error });
  }
};

// Cambiar el estado de una solicitud (por el trabajador)
export const updateJobRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const worker = req.user.uid;

    const validStatuses = ['CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ success: false, message: 'Invalid status value' });
    }

    const request = await JobRequest.findById(id);

    if (!request) {
      return res.status(404).send({ success: false, message: 'Job request not found' });
    }

    if (request.worker.toString() !== worker) {
      return res.status(403).send({ success: false, message: 'You can only update your own received requests' });
    }

    request.status = status;
    await request.save();

    return res.send({ success: true, message: 'Job request updated', request });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error updating request', error });
  }
};

// Eliminar una solicitud (solo cliente)
export const deleteJobRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const client = req.user.uid;

    const request = await JobRequest.findById(id);
    if (!request) {
      return res.status(404).send({ success: false, message: 'Job request not found' });
    }

    if (request.client.toString() !== client) {
      return res.status(403).send({ success: false, message: 'You can only delete your own job requests' });
    }

    await request.deleteOne();

    return res.send({ success: true, message: 'Job request deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error deleting job request', error });
  }
};
