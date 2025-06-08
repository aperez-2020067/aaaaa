import User from './user.model.js';
import { encrypt, checkPassword } from '../../utils/encrypt.js';

// Crear un nuevo usuario
export const createUser = async (req, res) => {
    try {
        const { name, surname, username, email, password, phone, role } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists', success: false });
        }

        // Validación del rol
        if (!['CLIENT', 'WORKER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role', success: false });
        }

        const hashedPassword = await encrypt(password);

        const newUser = new User({
            name,
            surname,
            username,
            email,
            password: hashedPassword,
            phone,
            role,
            userStatus: true
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully', success: true, user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Listar todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;

        const users = await User.find()
            .skip(Number(skip))
            .limit(Number(limit));

        const total = await User.countDocuments();

        res.status(200).json({
            success: true,
            message: 'Users found',
            users,
            total,
            limit: Number(limit),
            skip: Number(skip)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Obtener un solo usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, surname, username, email, phone, newPassword, currentPassword } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name || user.name;
        user.surname = surname || user.surname;
        user.username = username || user.username;
        user.email = email || user.email;
        user.phone = phone || user.phone;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required to change password' });
            }

            const isMatch = await checkPassword(user.password, currentPassword);
            if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

            user.password = await encrypt(newPassword);
        }

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

// Cambiar el rol del usuario (solo entre CLIENT y WORKER)
export const changeUserRole = async (req, res) => {
    const { id } = req.params;
    const { newRole } = req.body;

    if (!['CLIENT', 'WORKER'].includes(newRole)) {
        return res.status(400).json({ message: 'Invalid role. Must be CLIENT or WORKER.' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'ADMIN') {
            return res.status(403).json({ message: 'Admins cannot change roles' });
        }

        if (user.role === newRole) {
            return res.status(400).json({ message: `User already has the role ${newRole}` });
        }

        user.role = newRole;
        await user.save();

        return res.status(200).json({
            message: `User role changed to ${newRole}`,
            user
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error changing user role', error });
    }
};
