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

// Read a single car by ID from the request body
app.post('/cars/get', async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    try {
        const [car] = await pool.query('SELECT * FROM tbl_20_car WHERE id = ?', [id]);
        if (car.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.json(car[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new car
app.post('/cars', async (req, res) => {
    const { name, type, color, feedback } = req.body;
    if (!name || !type || !color) {
        return res.status(400).json({ error: 'Name, type, and color are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO tbl_20_car (name, type, color, feedback) VALUES (?, ?, ?, ?)',
            [name, type, color, feedback]
        );
        res.status(201).json({ id: result.insertId, name, type, color, feedback });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a car by ID from the request body
app.put('/cars', async (req, res) => {
    const { id, name, type, color, feedback } = req.body;
    if (!id || !name || !type || !color) {
        return res.status(400).json({ error: 'ID, name, type, and color are required' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE tbl_20_car SET name = ?, type = ?, color = ?, feedback = ? WHERE id = ?',
            [name, type, color, feedback, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }

        res.json({ message: 'Car updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
