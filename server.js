const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const TeamService = require('./lib/service');
const MatchService = require('./lib/service/match');

const teamService = new TeamService();

const server = express(bodyParser.json());

server.get('/search', (req, res) => {
    teamService.search(req.query.q)
        .then((teams) => {
            if (req.query.includeMatches) {
                Promise.all(teams.map(team => MatchService.get(team.number)))
                    .then(([matches]) => {
                        const groupedMatches = matches.reduce((grouped, m) => {
                            const teamNum = `${m.team}`;
                            if (!grouped[teamNum]) {
                                grouped[teamNum] = [m];
                            } else {
                                grouped[teamNum].concat(m);
                            }
                            
                            return grouped;
                        }, {});

                        res.send({
                            success: true,
                            results: teams.map(team => {
                                return Object.assign({}, team, { matches: groupedMatches[`${team.number}`] || [] });
                            })
                        });
                    });
            } else {
                res.send({ success: true, results: teams });
            }
        });
});

server.get('/', (req, res) => {
    teamService.getAll()
        .then((results) => {
            res.send({ success: true, results });
        })
        .catch((error) => {
            res.status(500).send({
                success: false,
                message: 'an unknown error occurred',
                error
            });
        });
});

server.get('/:number', (req, res) => {
    teamService.get(req.params)
        .then(([team]) => {
            if (!team) {
                res.status(404).send({ success: false, message: 'could not find team' });
            } else if (req.query.includeMatches) {
                return MatchService.get(req.params.number, true)
                    .then(matches => {
                        res.send({
                            success: true,
                            result: Object.assign({}, team, { matches: matches })
                        });
                    });
            } else {
                res.send({ success: true, result: team });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({success: false, error});
        });
});

server.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});