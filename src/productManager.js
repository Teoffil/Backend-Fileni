const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    _readFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    _writeFile(data) {
        fs.writeFileSync(this.path, JSON.stringify(data, null, 2));
    }

    addProduct(product) {
        const products = this._readFile();
        const lastProduct = products[products.length - 1];
        const nextId = lastProduct ? lastProduct.id + 1 : 1;
    
        product.id = nextId;
        product.status = product.status !== undefined ? product.status : true; 
        products.push(product);
        this._writeFile(products);
        return product;
    }

    getProducts() {
        return this._readFile();
    }

    getProductById(id) {
        const products = this._readFile();
        const product = products.find(p => p.id === id);
        
        if (!product) throw new Error('Product not found!');
        return product;
    }

    updateProduct(id, updatedProduct) {
        const products = this._readFile();
        const index = products.findIndex(p => p.id === id);
        
        if (index === -1) throw new Error('Product not found!');
        updatedProduct.id = id;  // Preserve the ID
        
        products[index] = updatedProduct;
        this._writeFile(products);
    }

    deleteProduct(id) {
        const products = this._readFile();
        const newProducts = products.filter(p => p.id !== id);
        
        if (newProducts.length === products.length) throw new Error('Product not found!');
        this._writeFile(newProducts);
    }
}



module.exports = ProductManager;
