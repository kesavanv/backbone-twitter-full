var Mongolian = require('mongolian');

var server = new Mongolian();

var db = server.db('backbone_tutorial');
// db.serverConfig.connection.autoReconnect = true;

module.exports.collections = {
	tweets: db.collection('tweets')
};