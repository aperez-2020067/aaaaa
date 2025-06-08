import { Router } from 'express';
import {
  addCategory,
  allCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from './category.controller.js';
import { validateJwt, isAdmin } from '../../middlewares/validate.jwt.js';

const api = Router();

// Crear categoría
api.post('/addcategory',[validateJwt, isAdmin], addCategory);

// Obtener todas las categorías
api.get('/allcategories',[validateJwt], allCategories);

// Obtener una categoría por ID
api.get('/getcategory/:id',[validateJwt], getCategoryById);

// Actualizar categoría
api.put('/updatecategory/:id',[validateJwt, isAdmin], updateCategory);

// Eliminar categoría
api.delete('/deletecategory/:id',[validateJwt, isAdmin], deleteCategory);

export default api;
