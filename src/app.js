const express = require('express');
const ProductManager = require('./ProductManager');
const CartManager = require('./cartManager');
const cartManager = new CartManager('./carts.json');

const app = express();
app.use(express.json());
const PORT = 8080;

const productManager = new ProductManager('./products.json'); 

app.get('/products', async (req, res) => {
    try {
        let products = await productManager.getProducts();

        if (req.query.limit) {
            products = products.slice(0, Number(req.query.limit));
        }
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(Number(req.params.pid));
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Ruta para agregar un nuevo producto
app.post('/api/products/', async (req, res) => {
    try {
        const product = await productManager.addProduct(req.body);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});

// Ruta para actualizar un producto
app.put('/api/products/:pid', async (req, res) => {
    try {
        await productManager.updateProduct(Number(req.params.pid), req.body);
        res.json({ success: 'Producto actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

// Ruta para eliminar un producto
app.delete('/api/products/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(Number(req.params.pid));
        res.json({ success: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

// Rutas para carrito
app.post('/api/carts/', async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear carrito' });
    }
});

app.get('/api/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(Number(req.params.cid));
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener carrito' });
    }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await cartManager.addProductToCart(Number(req.params.cid), Number(req.params.pid));
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});


module.exports = app; 

