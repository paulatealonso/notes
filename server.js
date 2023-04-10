require('dotenv').config();

const express = require('express');
const app = express();

app.listen(4000, () => {
    console.log('Server listening in port 4000');
});

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');

    try {
        connection.query('SELECT * FROM notes', (error, results, fields) => {
            if (error) throw error;
            console.log(results);
        });
    } catch (error) {
        console.error(error);
    }
});








