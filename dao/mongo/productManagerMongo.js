const Product = require('../models/productModel');

class ProductManagerMongo {
    async getProducts(){
        return await Product.find(); 
    }
    
    async addProduct(product){
        const newProduct = new Product(product);
        await newProduct.save();
    }

  // ...demás métodos 
}

module.exports = ProductManagerMongo;