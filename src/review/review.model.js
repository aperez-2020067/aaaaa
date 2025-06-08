import mongoose from 'mongoose';
import WorkerProfile from '../workerProfile/workerProfile.model.js';

const reviewSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxLength: 300
  }
}, { timestamps: true });

/**
 * POST: Cuando se guarda una nueva review
 */
reviewSchema.post('save', async function () {
  const Review = mongoose.model('Review');

  // Obtener todas las reviews del worker
  const reviews = await Review.find({ worker: this.worker });
  const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  // Actualizar el promedio y agregar la review al perfil si no está
  await WorkerProfile.findOneAndUpdate(
    { user: this.worker },
    {
      ratingAverage: avg,
      $addToSet: { reviews: this._id } // ← esto agrega la review si no existe
    }
  );
});

/**
 * POST: Cuando se elimina una review
 */
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;

  const Review = mongoose.model('Review');

  // Recalcular promedio
  const reviews = await Review.find({ worker: doc.worker });
  const avg = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  // Eliminar review del perfil
  await WorkerProfile.findOneAndUpdate(
    { user: doc.worker },
    {
      ratingAverage: avg,
      $pull: { reviews: doc._id }
    }
  );
});

export default mongoose.model('Review', reviewSchema);
