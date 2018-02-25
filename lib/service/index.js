const TeamDatabase = require('../db');

function TeamService () {
    this.db = new TeamDatabase();
}

TeamService.prototype.getAll = function () {
    return this.db.getAll();
};

module.exports = TeamService;