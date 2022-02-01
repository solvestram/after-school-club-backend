const express = require('express');
const server = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

// Enabling CORS (All requests)
server.use(cors())

// Body parser for requests
server.use(express.json());

// Logging
server.use((req, res, next) => {
    console.log(req.method + " " + req.url);
    next();
});

// Handlers
server.get('/', (req, res) => {
    res.send('Welcome to After School Club API');
})
server.get('/collections/lessons', (req, res) => {
    res.send('Received GET request to show information of all lessons');
});
server.post('/collections/orders', (req, res) => {
    res.send('Received order information as a POST request. POST request body: ' + req.body );
});
server.put('/collections/lessons/:lesson_id', (req, res) => {
    res.send(`Received PUT request to change space count of lesson ${req.params.lesson_id} to ${req.body}`);
});

// Start the server
const port = process.env.PORT || 3000
server.listen(port);
console.log(`Node server is running on port ${port}`);