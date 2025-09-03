const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const systemUserRoutes = require('./routes/systemUserRoutes');

// Inicializar la aplicación de Express
const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite al servidor entender JSON en los request bodies

// Rutas de la API
app.use('/api/system-users', systemUserRoutes);
// Aquí se agregarían más rutas para miembros, membresías, etc.
// app.use('/api/members', memberRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('GYM Management API is running...');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});