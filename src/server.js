// src/server.js
const http = require('http');
const { handler } = require('./handler');

const PORT = 9000;

const server = http.createServer(handler);

server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
