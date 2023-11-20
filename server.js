
const express = require('express');
const app = express(); // Asegúrese de inicializar la aplicación Express
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Conectamos a MongoDB (Asegúrese de tener la cadena de conexión correcta)

mongoose.connect('mongodb+srv://ecommerce:wzVCmATHiSnMv0WM@coderHouse.mongodb.net/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error(err));

// Require de los managers
const ProductManagerMongo = require('./dao/mongo/productManagerMongo');
const CartManagerMongo = require('./dao/mongo/cartManagerMongo');
const MessageModel = require('./dao/models/messageModel'); // Modelo para los mensajes

// Instanciamos los managers
const productManager = new ProductManagerMongo();
const cartManager = new CartManagerMongo();

// Middleware
app.use(bodyParser.json());
app.use(express.static('path-to-your-static-files')); // Servir archivos estáticos

// Configura Handlebars
app.engine('handlebars', exphbs({ defaultLayout: null }));
app.set('view engine', 'handlebars');

// Listening for 'add-product' event from the client
io.on('connection', (socket) => {
    console.log('cliente conectado');

    socket.on('add-product', async (product) => {
        try {
            await productManager.addProduct(product);
            io.emit('update-products', await productManager.listProducts());
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    socket.on('delete-product', async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            io.emit('update-products', await productManager.listProducts());
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    });
});

// Ruta principal para mostrar los productos en la vista home.handlebars
app.get('/', async (req, res) => {
    try {
        const productos = await productManager.listProducts();
        res.render('home', { productos });
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta para productos en tiempo real
app.get('/realtimeproducts', async (req, res) => {
    try {
        const productos = await productManager.listProducts();
        res.render('realTimeProducts', { productos });
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
    }
});

// Rutas de productos
app.get('/products', async (req, res) => {
    try {
        res.json(await productManager.listProducts());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/products', async (req, res) => {
    try {
        await productManager.addProduct(req.body);
        io.emit('update-products', await productManager.listProducts());
        res.status(201).json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        await productManager.updateProduct(req.params.id, req.body);
        res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.id);
        io.emit('update-products', await productManager.listProducts());
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


// Rutas del servidor
// ... rutas para productos y otras funcionalidades ...

// Ruta para servir la vista del chat
app.get('/chat', (req, res) => {
    MessageModel.find().then(messages => {
        res.render('chat', { messages });
    }).catch(err => {
        res.status(500).send('Error al obtener los mensajes');
    });
});

// Definir el puerto y iniciar el servidor
const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
