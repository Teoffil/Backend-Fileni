const fs = require('fs');

class CartManager {
    constructor(filename) {
        this.filename = filename;

        // Si el archivo no existe, inicializamos con un array vacío
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, '[]');
        }
    }

    // Leer todos los carritos
    listCarts() {
        return JSON.parse(fs.readFileSync(this.filename, 'utf-8'));
    }

    // Agregar un carrito
    addCart(cart) {
        const carts = this.listCarts();
        cart.id = Date.now(); // Utilizamos el timestamp como ID único
        carts.push(cart);
        fs.writeFileSync(this.filename, JSON.stringify(carts, null, 2));
    }

    // Actualizar un carrito
    updateCart(id, updatedCart) {
        const carts = this.listCarts();
        const cartIndex = carts.findIndex(cart => cart.id === Number(id));

        if (cartIndex === -1) {
            throw new Error('El carrito no fue encontrado');
        }

        carts[cartIndex] = { ...carts[cartIndex], ...updatedCart, id: Number(id) };
        fs.writeFileSync(this.filename, JSON.stringify(carts, null, 2));
    }

    // Eliminar un carrito
    deleteCart(id) {
        const carts = this.listCarts();
        const updatedCarts = carts.filter(cart => cart.id !== Number(id));

        if (carts.length === updatedCarts.length) {
            throw new Error('El carrito no fue encontrado');
        }

        fs.writeFileSync(this.filename, JSON.stringify(updatedCarts, null, 2));
    }
}

module.exports = CartManager;
