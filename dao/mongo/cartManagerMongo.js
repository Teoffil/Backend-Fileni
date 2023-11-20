const Cart = require('../models/cartModel');

class CartManagerMongo{

    async getCarts(){
        return await Cart.find();
    }

    async addCart(cart){
        const newCart = new Cart(cart);
        await newCart.save();
    }

  // ...demás métodos
}

module.exports = CartManagerMongo;