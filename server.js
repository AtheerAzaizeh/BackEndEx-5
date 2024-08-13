import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

app.use(express.json());
app.use(cors()); 
// Read all cars
app.get('/cars', async (req, res) => {
    try {
        const [cars] = await pool.query('SELECT * FROM tbl_20_car');
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
