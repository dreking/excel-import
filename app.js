const app = require('express')();

require('./start/log')();
require('./start/db').sync();
require('./start/routes')(app);

module.exports = app;
