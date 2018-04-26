'use strict';

/*
module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
};*/


module.exports = function(server) {
  var loopback = require('loopback');

//Now setting up the static files..
server.use('/static', loopback.static(__dirname + '/../../views/static'));

// set the view engine to ejs
server.set('view engine', 'ejs');

//Now set the index page for the  '/' route
server.get('/', function(req, res) {
  res.render('index', data);
});

server.get('/upload', function(req, res) {
console.log("server upload");
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            var path = './uploads' // Make sure this path exists
            //cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
            cb(null, path)
        }})

    var upload = multer({
        storage: storage
    })
});
}
