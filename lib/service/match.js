const request = require('request-promise-native');
const apiConfig = require('../../config').apis.match;

const matchUrl = `http://${apiConfig.host}:${apiConfig.port}`;

module.exports = {
    getAll: () => {
        return request(matchUrl)
            .then(body => JSON.parse(body).results)
            .catch(error => {
                console.error(error);
                throw new Error('cannot communicate with match api');
            });
    },
    get: (team, isExact) => {
        return request(matchUrl + (isExact ? `?team=${team}` : `?team="${team}"`))
            .then(body => JSON.parse(body).results)
            .catch(error => {
                console.error(error);
                throw new Error('cannot communicate with match api');
            })
    }
};