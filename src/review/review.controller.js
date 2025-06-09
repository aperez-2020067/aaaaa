import Review from './review.model.js';
import User from '../user/user.model.js';
import WorkerProfile from '../workerProfile/workerProfile.model.js';
import ClientProfile from '../clientProfile/clientProfile.model.js';

// Función para actualizar el promedio de calificación de un trabajador o cliente
const updateAverageRating = async (userId, isWorker) => {
  try {
    // Obtener las reseñas para el trabajador o cliente
    const reviews = await Review.find(isWorker ? { worker: userId } : { client: userId });

    // Si no hay reseñas, el promedio de calificación es 0
    if (reviews.length === 0) {
      if (isWorker) {
        await WorkerProfile.findOneAndUpdate({ user: userId }, { ratingAverage: 0 });
      } else {
        await ClientProfile.findOneAndUpdate({ user: userId }, { ratingAverage: 0 });
      }
      return;
    }

    // Calcular el promedio de las calificaciones
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Actualizar el promedio en el perfil del trabajador o cliente
    if (isWorker) {
      await WorkerProfile.findOneAndUpdate({ user: userId }, { ratingAverage: averageRating });
    } else {
      await ClientProfile.findOneAndUpdate({ user: userId }, { ratingAverage: averageRating });
    }
  } catch (error) {
    console.error('Error updating average rating:', error);
  }
};

// Crear una reseña de un cliente para un trabajador
export const createReview = async (req, res) => {
  try {
    const { worker, rating, comment } = req.body;
    const client = req.user.uid; 

    // Validar campos
    if (!worker || !rating) {
      return res.status(400).send({ success: false, message: 'Worker and rating are required' });
    }

    const clientUser = await User.findById(client);
    const workerUser = await User.findById(worker);

    if (!clientUser || !workerUser) {
      return res.status(404).send({ success: false, message: 'Client or worker not found' });
    }

    if (clientUser.role !== 'CLIENT') {
      return res.status(403).send({ success: false, message: 'Only CLIENT users can submit reviews' });
    }

    if (workerUser.role !== 'WORKER') {
      return res.status(403).send({ success: false, message: 'Only WORKER users can receive reviews' });
    }

    // Evitar duplicados: un cliente solo puede hacer 1 review por trabajador
    const existingReview = await Review.findOne({ client, worker });
    if (existingReview) {
      return res.status(400).send({ success: false, message: 'You already reviewed this worker' });
    }

    const review = new Review({ client, worker, rating, comment });
    await review.save();

    // Actualizar el promedio de calificación del trabajador
    await updateAverageRating(worker, true); // true indica que es un trabajador

    return res.status(201).send({ success: true, message: 'Review submitted successfully', review });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error submitting review', error });
  }
};

// Crear una reseña de un trabajador para un cliente
export const createReviewForClient = async (req, res) => {
  try {
    const { client, rating, comment } = req.body;
    const worker = req.user.uid; 

    // Validar campos
    if (!client || !rating) {
      return res.status(400).send({ success: false, message: 'Client and rating are required' });
    }

    const workerUser = await User.findById(worker);
    const clientUser = await User.findById(client);

    if (!workerUser || !clientUser) {
      return res.status(404).send({ success: false, message: 'Worker or client not found' });
    }

    if (workerUser.role !== 'WORKER') {
      return res.status(403).send({ success: false, message: 'Only WORKER users can submit reviews' });
    }

    if (clientUser.role !== 'CLIENT') {
      return res.status(403).send({ success: false, message: 'Only CLIENT users can receive reviews' });
    }

    // Evitar duplicados: un trabajador solo puede hacer 1 review por cliente
    const existingReview = await Review.findOne({ worker, client });
    if (existingReview) {
      return res.status(400).send({ success: false, message: 'You already reviewed this client' });
    }

    const review = new Review({ worker, client, rating, comment });
    await review.save();

    // Actualizar el promedio de calificación del cliente
    await updateAverageRating(client, false); // false indica que es un cliente

    return res.status(201).send({ success: true, message: 'Review submitted successfully', review });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error submitting review', error });
  }
};

// Actualizar una reseña existente
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const loggedUserId = req.user.uid;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).send({ success: false, message: 'Review not found' });
    }

    // Solo el cliente o trabajador que creó la reseña puede actualizarla
    if (review.client.toString() !== loggedUserId && review.worker.toString() !== loggedUserId) {
      return res.status(403).send({ success: false, message: 'You can only update your own reviews' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    // Actualizar el promedio de calificación
    await updateAverageRating(review.worker, true);  // Es trabajador, por eso 'true'
    await updateAverageRating(review.client, false); // Es cliente, por eso 'false'

    return res.send({ success: true, message: 'Review updated successfully', review });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error updating review', error });
  }
};

// Eliminar reseña
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedUserId = req.user.uid;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).send({ success: false, message: 'Review not found' });
    }

    // Solo el cliente o trabajador que creó la reseña puede eliminarla
    if (review.client.toString() !== loggedUserId && review.worker.toString() !== loggedUserId) {
      return res.status(403).send({ success: false, message: 'You can only delete your own reviews' });
    }

    const workerId = review.worker;
    const clientId = review.client;

    await review.deleteOne();

    // Actualizar el promedio de calificación después de eliminar la reseña
    await updateAverageRating(workerId, true);  // Es trabajador, por eso 'true'
    await updateAverageRating(clientId, false); // Es cliente, por eso 'false'

    return res.send({ success: true, message: 'Review deleted successfully', review });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error deleting review', error });
  }
};

// Obtener todas las reseñas de un trabajador
export const getReviewsByWorker = async (req, res) => {
  try {
    const { workerId } = req.params;

    const reviews = await Review.find({ worker: workerId })
      .populate('client', 'username name')
      .sort({ createdAt: -1 });

    return res.send({ success: true, message: 'Reviews retrieved', reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error retrieving reviews', error });
  }
};

// Obtener todas las reseñas de un cliente
export const getReviewsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    const reviews = await Review.find({ client: clientId })
      .populate('worker', 'username name')
      .sort({ createdAt: -1 });

    return res.send({ success: true, message: 'Reviews retrieved', reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error retrieving reviews', error });
  }
};