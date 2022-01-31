const express = require('express');
const server = express();

// Logging
server.use((req, res, next) => {
    console.log(req.method + " " + req.url)
    next();
});

// Start the server listening on port 8080
server.listen(8080);
console.log('Node server is running on port 8080');