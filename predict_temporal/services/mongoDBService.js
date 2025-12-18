// mongodbService.js
require('dotenv').config()
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        console.log('Conexión a MongoDB establecida correctamente.');

    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        throw error;
    }
};

module.exports = { connectDB };