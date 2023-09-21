const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // Add this line to parse JSON data in the request body

// Add this middleware to enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with the URL of your frontend server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "CARTECH_DATABASE"
});

connection.connect(function (err) {
    if (err) {
        console.log("Error occurred while connecting");
    } else {
        console.log("Connection created with MySQL successfully");
    }
});

// Sending the FIRST_NAME to the frontend
app.get('/api/customers', (req, res) => {
    const sqlQuery = 'SELECT FIRST_NAME FROM CUSTOMER';
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            res.status(500).json({ error: 'Error fetching data from database.' });
        } else {
            res.json({ first_name: results[0].FIRST_NAME });
            // res.json({ first_name: results });

            console.log('Query results:', results);
            console.log('Query results:', results[0].FIRST_NAME);
        }
    });
});

// Route to get all columns
app.get('/api/customers/all', (req, res) => {
    const sqlQuery = 'SELECT * FROM CUSTOMER'; // Use * to select all columns
    connection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            res.status(500).json({ error: 'Error fetching data from database.' });
        } else {
            res.json(results); // Send all rows from the CUSTOMER table as JSON
            console.log('Query results:', results);
        }
    });
});

// Add new data to the "customer" table
app.post('/api/add-customer', (req, res) => {
    const { customer_id, first_name } = req.body;

    const sqlQuery = 'INSERT INTO CUSTOMER (CUSTOMER_ID, FIRST_NAME) VALUES (?, ?)';
    connection.query(sqlQuery, [customer_id, first_name], (error, results, fields) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            res.status(500).json({ error: 'Error adding data to database.' });
        } else {
            res.json({ message: 'Data added successfully.' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
