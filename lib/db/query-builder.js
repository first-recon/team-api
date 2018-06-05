const DEFAULT_SORT = { key: 'id', order: 'asc' };

module.exports = function (config) {
    return {
        selectAll: (sort=DEFAULT_SORT) => `select * from ${config.schema}.${config.table} order by "${sort.key}" ${sort.order}`,
        select: (opts, isExact=false, sort=DEFAULT_SORT) => {
            const keys = Object.keys(opts);
            const values = keys.map(k => opts[k]);
            const quotedVals = values.map(v => {
                if (typeof v === 'string') {
                    return isExact ? ` = '${v}'` : ` LIKE '%${v}%'`;
                }
                return ` = ${v}`;
            });
            const whereClause = keys.reduce((c, key, i) => {
                return values[i] ? c.concat(`${key}${quotedVals[i]}`) : c;
            }, []).join(' AND ');
            return `select * from ${config.schema}.${config.table}${whereClause.length ? ' where ' + whereClause : ''} order by "${sort.key}" ${sort.order}`;
        },
        insert: (opts) => {
            const keys = Object.keys(opts);
            const values = keys.map(k => opts[k]);
            const columns = keys.join(',');
            const quotedVals = values.map(v => typeof v === 'string' ? `'${v}'` : v).join(',');
            return `insert into ${config.schema}.${config.table} (${columns}) values (${quotedVals})`;
        }
    };
}