// productManager.js
const Product = require('../dao/models/productModel');

class ProductManager {
    async listProducts() {
        try {
        return await Product.find({});
        } catch (error) {
        // Manejar error.
        console.error('Error al listar los productos:', error);
        throw error;
        }
    }

    async addProduct(productData) {
        try {
        const product = new Product(productData);
        await product.save();
        console.log('Producto agregado:', product);
        } catch (error) {
        // Manejar error.
        console.error('Error al agregar el producto:', error);
        throw error;
        }
    }

    async updateProduct(id, productData) {
        try {
        const product = await Product.findByIdAndUpdate(id, productData, { new: true });
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        console.log('Producto actualizado:', product);
        } catch (error) {
        // Manejar error.
        console.error('Error al actualizar el producto:', error);
        throw error;
        }
    }

    async deleteProduct(id) {
        try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        console.log('Producto eliminado:', product);
        } catch (error) {
        // Manejar error.
        console.error('Error al eliminar el producto:', error);
        throw error;
        }
    }
}

module.exports = ProductManager;
