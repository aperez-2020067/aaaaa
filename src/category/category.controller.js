import Category from './category.model.js';

// Crear una nueva categoría
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).send({ success: false, message: 'Category name already exists' });
    }

    const newCategory = new Category({ name, description });
    await newCategory.save();

    return res.status(201).send({
      success: true,
      message: 'Category created successfully',
      category: newCategory
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error creating category', error });
  }
};

// Obtener todas las categorías
export const allCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.send({ success: true, message: 'Categories retrieved', categories });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error retrieving categories', error });
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).send({ success: false, message: 'Category not found' });
    }

    return res.send({ success: true, message: 'Category found', category });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error fetching category', error });
  }
};

// Actualizar categoría
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).send({ success: false, message: 'Category not found' });
    }

    return res.send({ success: true, message: 'Category updated successfully', category: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error updating category', error });
  }
};

// Eliminar categoría
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({ success: false, message: 'Category not found' });
    }

    await Category.findByIdAndDelete(id);

    return res.send({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error deleting category', error });
  }
};
