// TECH-DEBT: refactor as recursive function and support multiple levels of nesting
module.exports = function format (row) {
    const keys = Object.keys(row);

    return keys.reduce((acc, key) => {
        const output = acc;

        // if this is not nested we pull the key into our new object
        if (key.includes('_')) {
           const levels = key.split('_');
           if (!output[levels[0]]) {
               output[levels[0]] = {};
           }
           output[levels[0]][levels[1]] = row[key];
        } else {
            output[key] = row[key];
        }

        return output;
    }, {});
}