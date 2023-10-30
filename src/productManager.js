const fs = require('fs');

class ProductManager {
    constructor(filename) {
        this.filename = filename;

        // Si el archivo no existe, inicializamos con un array vacío
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, '[]');
        }
    }

    // Leer todos los productos
    listProducts() {
        return JSON.parse(fs.readFileSync(this.filename, 'utf-8'));
    }

    // Agregar un producto
    addProduct(product) {
        console.log("Adding product:", product);
        const products = this.listProducts();
        product.id = Date.now(); // Utilizamos el timestamp como ID único
        products.push(product);
        fs.writeFileSync(this.filename, JSON.stringify(products, null, 2));
    }

    // Actualizar un producto
    updateProduct(id, updatedProduct) {
        const products = this.listProducts();
        const productIndex = products.findIndex(product => product.id === Number(id));

        if (productIndex === -1) {
            throw new Error('El producto no fue encontrado');
        }

        products[productIndex] = { ...products[productIndex], ...updatedProduct, id: Number(id) };
        fs.writeFileSync(this.filename, JSON.stringify(products, null, 2));
    }

    // Eliminar un producto
    deleteProduct(id) {
        const products = this.listProducts();
        const updatedProducts = products.filter(product => product.id !== Number(id));

        if (products.length === updatedProducts.length) {
            throw new Error('El producto no fue encontrado');
        }

        fs.writeFileSync(this.filename, JSON.stringify(updatedProducts, null, 2));
    }
}

module.exports = ProductManager;
