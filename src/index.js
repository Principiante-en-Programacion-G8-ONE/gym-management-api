const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const systemUserRoutes = require('./routes/systemUserRoutes');
const membershipRoutes = require('./routes/membershipRoutes'); // <-- NUEVO
const memberRoutes = require('./routes/memberRoutes'); // <-- NUEVO

// Inicializar la aplicación de Express
const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite al servidor entender JSON en los request bodies

// Rutas de la API
app.use('/api/system-users', systemUserRoutes);
app.use('/api/memberships', membershipRoutes); // <-- NUEVO
app.use('/api/members', memberRoutes); // <-- NUEVO

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('GYM Management API is running...');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});