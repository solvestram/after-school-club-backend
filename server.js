const express = require('express');
const server = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId

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
        if (e) return res.status(500).send();
        res.send(results)
    })
});
server.post('/collections/orders', (req, res) => {
    db.collection('orders').insert(req.body, (e, results) => {
        if (e) return res.status(500).send();
        res.send(results)
    })
});
server.put('/collections/lessons/:lesson_id', (req, res) => {
    db.collection('lessons').updateOne(
        {_id: new ObjectId(req.params.lesson_id)},
        {$set: { space: req.body.space }},
        {safe: true},
        (e, results) => {
            if (e) return res.status(500).send();
            res.send(results)
        }
    )
});

// Middleware for returning 404 status
server.use((req, res) => {
    return res.status(404).send();
});

// Start the server
const port = process.env.PORT || 3000
server.listen(port);
console.log(`Node server is running on port ${port}`);