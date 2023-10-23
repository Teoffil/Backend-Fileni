const fs = require('fs');

class CartManager {
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

    createCart() {
        const carts = this._readFile();
        const lastCart = carts[carts.length - 1];
        const nextId = lastCart ? lastCart.id + 1 : 1;
        
        const cart = {
            id: nextId,
            products: []
        };
        carts.push(cart);
        this._writeFile(carts);
        return cart;
    }

    addProductToCart(cartId, productId) {
        const carts = this._readFile();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) throw new Error('Cart not found!');

        const productInCart = cart.products.find(p => p.product === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        this._writeFile(carts);
        return cart;
    }

    getCartById(cartId) {
        const carts = this._readFile();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) throw new Error('Cart not found!');
        return cart;
    }
}

module.exports = CartManager;
