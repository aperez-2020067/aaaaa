import WorkerProfile from './workerProfile.model.js';
import User from '../user/user.model.js';
import Category from '../category/category.model.js';

// Crear un perfil de trabajador
export const createWorkerProfile = async (req, res) => {
  try {
    const { category, description, location, experienceYears } = req.body;
    const userId = req.user.uid;

    
    const user = await User.findById(userId);
    if (!user || user.role !== 'WORKER') {
      return res.status(403).send({ success: false, message: 'Only WORKER users can create a profile' });
    }

    const existing = await WorkerProfile.findOne({ user: userId });
    if (existing) {
      return res.status(400).send({ success: false, message: 'Worker already has a profile' });
    }

   
    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(404).send({ success: false, message: 'Category not found' });
    }

    const newProfile = new WorkerProfile({
      user: userId,
      category,
      description,
      location,
      experienceYears
    });

    await newProfile.save();

    return res.status(201).send({ success: true, message: 'Worker profile created', profile: newProfile });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error creating worker profile', error });
  }
};

// Obtener todos los perfiles de trabajadores
export const getAllWorkerProfiles = async (req, res) => {
  try {
    const profiles = await WorkerProfile.find()
      .populate('user', 'username name')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    return res.send({ success: true, message: 'Worker profiles retrieved', profiles });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error retrieving profiles', error });
  }
};

// Obtener perfil por ID de usuario
export const getWorkerProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await WorkerProfile.findOne({ user: userId })
      .populate('user', 'username name')
      .populate('category', 'name');

    if (!profile) {
      return res.status(404).send({ success: false, message: 'Worker profile not found' });
    }

    return res.send({ success: true, message: 'Worker profile found', profile });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error fetching worker profile', error });
  }
};


// Actualizar perfil del trabajador
export const updateWorkerProfile = async (req, res) => {
  try {
    const { category, description, location, experienceYears} = req.body;
    const userId = req.user.uid;

    const profile = await WorkerProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).send({ success: false, message: 'Worker profile not found' });
    }

    if (category) {
      const cat = await Category.findById(category);
      if (!cat) {
        return res.status(404).send({ success: false, message: 'Category not found' });
      }
      profile.category = category;
    }

    if (description) profile.description = description;
    if (location) profile.location = location;
    if (experienceYears !== undefined) profile.experienceYears = experienceYears;

    await profile.save();

    return res.send({ success: true, message: 'Worker profile updated', profile });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error updating profile', error });
  }
};

// Eliminar perfil de trabajador 
export const deleteWorkerProfile = async (req, res) => {
  try {
    const userId = req.user.uid;

    const profile = await WorkerProfile.findOneAndDelete({ user: userId });

    if (!profile) {
      return res.status(404).send({ success: false, message: 'Worker profile not found' });
    }

    return res.send({ success: true, message: 'Worker profile deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error deleting profile', error });
  }
};
