require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.listen(3307, () => {
    console.log('Server listening in port 3307');
});

const mysql = require('mysql');

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    timeout: 120000
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos: ', err);
        return;
    }

    console.log('Conexión exitosa a la base de datos');

    // connection.query('SELECT * FROM notes', (error, results, fields) => {
    //     if (error) {
    //         console.error('Error al obtener notas: ', error);
    //         return;
    //     }

    //     console.log('Notas obtenidas correctamente: ', results);
    // });
});

app.get('/notes', (req, res) => {
    connection.query('SELECT * FROM notes', (error, results, fields) => {
        if (error) {
            console.error('Error al obtener notas: ', error);
            return res.status(500).json({ message: 'Error al obtener notas' });
        }
        res.status(200).json({ notes: results });
    });
});

app.post('/notes', (req, res) => {
    const { title, relevance, create_date, completion_date } = req.body;
    connection.query(
        'SELECT MAX(id) as max_id FROM notes',
        (error, results, fields) => {
            if (error) {
                console.error('Error al obtener el último id: ', error);
                return res.status(500).json({ message: 'Error al crear nota' });
            }
            const next_id = results[0].max_id + 1;
            connection.query(
                'INSERT INTO notes (id, title, relevance, exist, create_date, completion_date) VALUES (?, ?, ?, ?, ?, ?)',
                [next_id, title, relevance, 1, create_date, completion_date],
                (error, results, fields) => {
                    if (error) {
                        console.error('Error al crear nota: ', error);
                        return res.status(500).json({ message: 'Error al crear nota' });
                    }
                    res.status(200).json({ message: 'Nota creada exitosamente' });
                }
            );
        }
    );
});

app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    connection.query(
        'UPDATE notes SET exist = 0 WHERE id = ?',
        [id],
        (error, results, fields) => {
            if (error) {
                console.error('Error al eliminar nota: ', error);
                return res.status(500).json({ message: 'Error al eliminar nota' });
            }
            res.status(200).json({ message: 'Nota eliminada exitosamente' });
        }
    );
});

app.get('/notes/relevance/:relevance', (req, res) => {
    const { relevance } = req.params;
    connection.query(
        'SELECT * FROM notes WHERE relevance = ?',
        [relevance],
        (error, results, fields) => {
            if (error) {
                console.error('Error al obtener notas por relevancia: ', error);
                return res.status(500).json({ message: 'Error al obtener notas' });
            }
            res.status(200).json({ notes: results });
        }
    );
});

app.get('/notes/creation_date/:date', (req, res) => {
    const { date } = req.params;
    connection.query(
        'SELECT * FROM notes WHERE creation_date = ?',
        [date],
        (error, results, fields) => {
            if (error) {
                console.error('Error al obtener notas por fecha de creación: ', error);
                return res.status(500).json({ message: 'Error al obtener notas' });
            }
            res.status(200).json({ notes: results });
        }
    );
});

app.get('/notes/completion_date/:date', (req, res) => {
    const { date } = req.params;
    connection.query(
        'SELECT * FROM notes WHERE completion_date = ?',
        [date],
        (error, results, fields) => {
            if (error) {
                console.error('Error al obtener notas por fecha de expedición: ', error);
                return res.status(500).json({ message: 'Error al obtener notas' });
            }
            res.status(200).json({ notes: results });
        }
    );
});








