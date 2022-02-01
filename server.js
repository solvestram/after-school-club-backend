const express = require('express');
const server = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

// Seeting up MongoDB connection
const mongo_uri = process.env.MONGO_URI;

let db;
MongoClient.connect(mongo_uri, (err, client) => {
    db = client.db('after-school-club')
})

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
    db.collection('lessons').find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
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