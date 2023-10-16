const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();
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

module.exports = app; 

