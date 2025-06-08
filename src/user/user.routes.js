import { Router } from 'express';
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    changeUserRole
} from './user.controller.js';

const api = Router();

api.post('/createuser', createUser);
api.get('/alluser', getUsers);
api.get('/getuser/:id', getUserById);
api.put('/updateuser/:id', updateUser);
api.delete('/deleteuser/:id', deleteUser);
api.patch('/usermode/:id', changeUserRole);

export default api;
