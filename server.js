const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const TeamService = require('./lib/service');

const teamService = new TeamService();
const server = express(bodyParser.json());

server.get('/', (req, res) => {
    teamService.getAll()
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            res.status(500).send({
                success: false,
                message: 'an unknown error occurred',
                error
            });
        });
});

server.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});