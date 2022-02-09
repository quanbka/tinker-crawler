const environment = 'development2'
const config = require('./knexfile.js')[environment];
module.exports = require('knex')(config);
