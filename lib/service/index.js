const TeamDatabase = require('../db');

function TeamService () {
    this.db = new TeamDatabase();
}

TeamService.prototype.getAll = function () {
    return this.db.getAll();
};

TeamService.prototype.get = function (filter) {
    return this.db.get(filter, true);
}

TeamService.prototype.search = function (team) {
    return this.db.get({ number: team });
}

module.exports = TeamService;