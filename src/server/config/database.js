const env = require('../../../env');

module.exports = {
    name: env.database.name,
    username: env.database.username,
    password: env.database.password,
    host: env.database.host
};
