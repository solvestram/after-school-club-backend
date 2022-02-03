const express = require('express');
const server = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const fs = require('fs');

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

// Serving static files
server.use(express.static('public'));

// Handlers
server.get('/', (req, res) => {
    res.send('Welcome to After School Club API');
})
server.get('/collections/lessons', getAllLessons);
server.post('/collections/orders', postOrder);
server.put('/collections/lessons/:lesson_id', updateLessonSpace);
server.post('/collections', resetDatabase);

// Middleware for returning 404 status
server.use((req, res) => {
    return res.status(404).send("404 Not found");
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port);
console.log(`Node server is running on port ${port}`);

// Handler methods
function getAllLessons(req, res) {
    db.collection('lessons').find({}).toArray((e, results) => {
        if (e) return res.status(500).send();
        return res.send(results);
    });
}
function postOrder(req, res) {
    db.collection('orders').insert(req.body, (e, results) => {
        if (e) return res.status(500).send();
        return res.send(results);
    });
}
function updateLessonSpace(req, res) {
    db.collection('lessons').updateOne(
        { _id: new ObjectId(req.params.lesson_id) },
        { $set: { space: req.body.space } },
        { safe: true },
        (e, results) => {
            if (e) return res.status(500).send();
            return res.send(results)
        }
    );
}
function resetDatabase(req, res) {
    // Reset database to default
    if (req.body.reset == 'true') {
        // delete existing elements in the database
        db.collection('lessons').deleteMany({});
        db.collection('orders').deleteMany({});

        // read backup files
        lessons_data = JSON.parse(fs.readFileSync('database_backup/lessons.json'));
        orders_data = JSON.parse(fs.readFileSync('database_backup/orders.json'));

        // instert backup file data to the database
        db.collection('lessons').insertMany(lessons_data);
        db.collection('orders').insertMany(orders_data);

        return res.send("Success");
    }
}