
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { dbConfig } from './config.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Create Routes
let pool;

async function initDB() {
    try {
        // First connect without database to create it if needed (conceptually, but Aiven usually gives a db).
        // For simplicity, we assume the DB 'kasbon' might need creation or we just connect.
        // Aiven requires SSL usually.

        pool = mysql.createPool(dbConfig);

        // Test connection
        await pool.query('SELECT 1');
        console.log('Connected to MySQL Database');

        // Create Tables
        await createTables();
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

async function createTables() {
    const employeesTable = `
        CREATE TABLE IF NOT EXISTS employees (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            position VARCHAR(255) NOT NULL,
            salary DOUBLE NOT NULL,
            joinDate VARCHAR(255) NOT NULL,
            phone VARCHAR(255) NOT NULL
        );
    `;

    const loansTable = `
        CREATE TABLE IF NOT EXISTS loans (
            id VARCHAR(255) PRIMARY KEY,
            employeeId VARCHAR(255) NOT NULL,
            amount DOUBLE NOT NULL,
            remainingAmount DOUBLE NOT NULL,
            reason TEXT,
            status VARCHAR(50) NOT NULL,
            termMonths INT NOT NULL,
            requestDate VARCHAR(255) NOT NULL,
            startDate VARCHAR(255) NOT NULL,
            aiAnalysis TEXT,
            FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
        );
    `;

    const transactionsTable = `
        CREATE TABLE IF NOT EXISTS transactions (
            id VARCHAR(255) PRIMARY KEY,
            loanId VARCHAR(255) NOT NULL,
            amount DOUBLE NOT NULL,
            date VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            FOREIGN KEY (loanId) REFERENCES loans(id) ON DELETE CASCADE
        );
    `;

    await pool.query(employeesTable);
    await pool.query(loansTable);
    await pool.query(transactionsTable);
    console.log('Tables initialized');
}

// Routes

// --- Employees ---
app.get('/api/employees', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employees');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/employees', async (req, res) => {
    try {
        const { id, name, position, salary, joinDate, phone } = req.body;
        await pool.query(
            'INSERT INTO employees (id, name, position, salary, joinDate, phone) VALUES (?, ?, ?, ?, ?, ?)',
            [id, name, position, salary, joinDate, phone]
        );
        res.status(201).json({ message: 'Employee added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Loans ---
app.get('/api/loans', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM loans');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/loans', async (req, res) => {
    try {
        const { id, employeeId, amount, remainingAmount, reason, status, termMonths, requestDate, startDate, aiAnalysis } = req.body;
        await pool.query(
            'INSERT INTO loans (id, employeeId, amount, remainingAmount, reason, status, termMonths, requestDate, startDate, aiAnalysis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, employeeId, amount, remainingAmount, reason, status, termMonths, requestDate, startDate, aiAnalysis]
        );
        res.status(201).json({ message: 'Loan added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/loans/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Construct query dynamically strictly for allowed fields
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(updates)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        values.push(id);

        if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });

        await pool.query(`UPDATE loans SET ${fields.join(', ')} WHERE id = ?`, values);
        res.json({ message: 'Loan updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Transactions ---
app.get('/api/transactions', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM transactions');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/transactions', async (req, res) => {
    try {
        const { id, loanId, amount, date, type } = req.body;
        await pool.query(
            'INSERT INTO transactions (id, loanId, amount, date, type) VALUES (?, ?, ?, ?, ?)',
            [id, loanId, amount, date, type]
        );
        res.status(201).json({ message: 'Transaction added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


initDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
