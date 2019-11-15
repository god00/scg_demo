var server = require('./initialize.server');
var apiRouter = require('./routes/api.route');
var indexRouter = require('./routes/index.route')

server.use('/api', apiRouter);
server.use(indexRouter);

module.exports = server;