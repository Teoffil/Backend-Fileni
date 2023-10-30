const express = require('express');
const bodyParser = require('body-parser');
const CartManager = require('./src/cartManager.js');
const ProductManager = require('./src/productManager.js');

const app = express();
const port = 3000;

const cartManager = new CartManager('carts.json');
const productManager = new ProductManager('products.json');

// Middleware
app.use(bodyParser.json());

// Configura Handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({ defaultLayout: null }));
app.set('view engine', 'handlebars');

// Configura Socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Listening for 'add-product' event from the client
io.on('connection', (socket) => {
    console.log('cliente conectado');

    socket.on('add-product', (product) => {
        // Adding the product to the product list
        const newProduct = {
            id: Date.now().toString(),
            title: product.title,
            price: product.price
        };
        
    console.log('Adding product:', newProduct);
    const productsBeforeAdd = productManager.listProducts();
    console.log('Products before adding:', productsBeforeAdd);
    productManager.addProduct(newProduct);
    const productsAfterAdd = productManager.listProducts();
    console.log('Products after adding:', productsAfterAdd);
    

        // Emitting 'update-products' event to all connected clients
        io.emit('update-products', productManager.listProducts());
    });

    socket.on('delete-product', (productId) => {
        // Removing the product from the product list
        productManager.deleteProduct(productId);

        // Emitting 'update-products' event to all connected clients
        io.emit('update-products', productManager.listProducts());
    });
});

// Ruta principal para mostrar los productos en la vista home.handlebars
app.get('/', (req, res) => {
    const productos = productManager.listProducts();
    res.render('home', { productos });
});

// Ruta para productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
    const productos = productManager.listProducts();
    res.render('realTimeProducts', { productos });
});

// Rutas de productos
app.get('/products', (req, res) => {
    res.json(productManager.listProducts());
});

app.post('/products', (req, res) => {
    productManager.addProduct(req.body);
    
    io.emit('update-products', productManager.listProducts());
    res.status(201).json({ message: 'Producto agregado correctamente' });
});

app.put('/products/:id', (req, res) => {
    try {
        productManager.updateProduct(req.params.id, req.body);
        res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.delete('/products/:id', (req, res) => {
    try {
        productManager.deleteProduct(req.params.id);
        
        io.emit('update-products', productManager.listProducts());
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Rutas del carrito
app.get('/carts', (req, res) => {
    res.json(cartManager.listCarts());
});

app.post('/carts', (req, res) => {
    cartManager.addCart(req.body);
    res.status(201).json({ message: 'Carrito agregado correctamente' });
});

app.put('/carts/:id', (req, res) => {
    try {
        cartManager.updateCart(req.params.id, req.body);
        res.json({ message: 'Carrito actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.delete('/carts/:id', (req, res) => {
    try {
        cartManager.deleteCart(req.params.id);
        res.json({ message: 'Carrito eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Iniciar el servidor con http.listen en lugar de app.listen debido a la integración con Socket.io
http.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
