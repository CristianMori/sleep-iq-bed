'use strict';

require('dotenv').config();
const express = require('express')
const connector = require('./connector')

const PORT = process.env.PORT || 3000

const server = express();
server.use(express.json());

server.post('/', (req, res) => {
  if (connector.accessTokenIsValid(req, res)) {
    connector.handleHttpCallback(req, res)
  }
});

server.listen(PORT);
console.log(`Server listening on http://127.0.0.1:${PORT}`);