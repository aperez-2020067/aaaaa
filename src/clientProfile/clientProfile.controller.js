import ClientProfile from './clientProfile.model.js';
import User from '../user/user.model.js';

// Crear un perfil de cliente
export const createClientProfile = async (req, res) => {
  try {
    const { location } = req.body;
    const userId = req.user.uid;

    const user = await User.findById(userId);
    if (!user || user.role !== 'CLIENT') {
      return res.status(403).send({ success: false, message: 'Only CLIENT users can create a profile' });
    }

    const existing = await ClientProfile.findOne({ user: userId });
    if (existing) {
      return res.status(400).send({ success: false, message: 'Client already has a profile' });
    }

    const profile = new ClientProfile({
      user: userId,
      location,
    });

    await profile.save();

    return res.status(201).send({ success: true, message: 'Client profile created', profile });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error creating client profile', error });
  }
};

// Obtener todos los perfiles de clientes
export const getAllClientProfiles = async (req, res) => {
  try {
    const profiles = await ClientProfile.find()
      .populate('user', 'username name')
      .sort({ createdAt: -1 });

    return res.send({ success: true, message: 'Client profiles retrieved', profiles });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error retrieving client profiles', error });
  }
};

// Obtener perfil por ID de usuario
export const getClientProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await ClientProfile.findOne({ user: userId })
      .populate('user', 'username name');

    if (!profile) {
      return res.status(404).send({ success: false, message: 'Client profile not found' });
    }

    return res.send({ success: true, message: 'Client profile found', profile });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error fetching client profile', error });
  }
};

// Actualizar perfil del cliente
export const updateClientProfile = async (req, res) => {
  try {
    const { location } = req.body;
    const userId = req.user.uid;

    const profile = await ClientProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).send({ success: false, message: 'Client profile not found' });
    }

    if (location) profile.location = location;

    await profile.save();

    return res.send({ success: true, message: 'Client profile updated', profile });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error updating client profile', error });
  }
};

// Eliminar perfil de cliente
export const deleteClientProfile = async (req, res) => {
  try {
    const userId = req.user.uid;

    const profile = await ClientProfile.findOneAndDelete({ user: userId });

    if (!profile) {
      return res.status(404).send({ success: false, message: 'Client profile not found' });
    }

    return res.send({ success: true, message: 'Client profile deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error deleting client profile', error });
  }
};
