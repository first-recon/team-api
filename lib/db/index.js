const config = require('../../config');
const { Client } = require('pg');

const query = require('./query-builder')(config.postgres);
const format = require('./model');

function DbAdapter () {
    this.client = new Client(config.postgres);
    this.connected = false;
    this.client.connect()
        .then(() => {
            this.connected = true;
        })
        .catch(() => {
            this.connected = false;
        });
};

DbAdapter.prototype.getAll = function () {
    if (!this.connected) {
        return Promise.reject({ name: 'DbConnectionError', message: 'unable to establish connection to the database, please try again later' });
    }
    return new Promise((resolve, reject) => {
        this.client.query(query.selectAll(), (error, response) => {
            if (!error) {
                resolve(response.rows.map(format));
            } else {
                reject(error);
            }
        });
    });
};

DbAdapter.prototype.get = function (params, isExact) {
    if (!this.connected) {
        return Promise.reject({ name: 'DbConnectionError', message: 'unable to establish connection to the database, please try again later' });
    }

    return new Promise((resolve, reject) => {
        console.log(query.select(params, isExact));
        this.client.query(query.select(params, isExact), (error, response) => {
            if (!error) {
                resolve(response.rows.map(format));
            } else {
                reject(error);
            }
        });
    });
}

DbAdapter.prototype.insert = function (newMatch) {
    if (!this.connected) {
        return Promise.reject({ name: 'DbConnectionError', message: 'unable to establish connection to the database, please try again later' });
    }

    return new Promise((resolve, reject) => {
        const insertQuery = query.insert(newMatch);
        this.client.query(insertQuery, (error, response) => {
            if (!error) {
                resolve(response.rows);
            } else {
                console.error('FAILED:', insertQuery);
                reject(error);
            }
        });
    });
};

module.exports = DbAdapter;