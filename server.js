const express = require('express');
const server = express();

// Logging
server.use((req, res, next) => {
    console.log(req.method + " " + req.url)
    next();
});