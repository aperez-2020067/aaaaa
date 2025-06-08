import Review from './review.model.js';
import User from '../user/user.model.js';

// Crear una reseña
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

    return res.status(201).send({ success: true, message: 'Review submitted successfully', review });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error submitting review', error });
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

    // Solo el cliente que creó la reseña puede actualizarla
    if (review.client.toString() !== loggedUserId) {
      return res.status(403).send({ success: false, message: 'You can only update your own reviews' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

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

    // Solo el cliente que creó la reseña puede eliminarla
    if (review.client.toString() !== loggedUserId) {
      return res.status(403).send({ success: false, message: 'You can only delete your own reviews' });
    }

    await review.deleteOne();

    return res.send({ success: true, message: 'Review deleted successfully', review });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error deleting review', error });
  }
};
