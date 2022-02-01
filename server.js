const express = require('express');
const server = express();
const cors = require('cors');

// Enabling CORS (All requests)
server.use(cors())

// Logging
server.use((req, res, next) => {
    console.log(req.method + " " + req.url);
    next();
});

// Handlers
server.get('/collections/lessons', (req, res) => {
    res.send('Received GET request to show information of all lessons');
});
server.post('/collections/orders', (req, res) => {
    res.send('Received order information as a POST request. POST request body: ' + req.body );
});
server.put('/collections/lessons/:lesson_id', (req, res) => {
    res.send(`Received PUT request to change space count of lesson ${req.params.lesson_id} to ${req.body}`);
});

// Start the server listening on port 8080
server.listen(8080);
console.log('Node server is running on port 8080');