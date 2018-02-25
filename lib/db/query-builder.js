module.exports = function (config) {
    return {
        selectAll: (opts) => `select * from ${config.schema}.${config.table}`,
    };
}