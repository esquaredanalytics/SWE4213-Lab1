const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // 1. Import Pool from pg
const app = express();

//added config to connect to db. 
const pool = new Pool({
    connectionString: "postgres://aditya:bhosale@localhost:5432/unb_marketplace"
});

app.set('db', pool);

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
const authRoutes = require('./endpoints/auth');
app.use('/', authRoutes);

const productRoutes = require('./endpoints/products');
app.use('/', productRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));