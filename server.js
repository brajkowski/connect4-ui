var express = require('express');
var app = express();

var distDir = __dirname + '/dist/';
app.use(express.static(distDir));

const router = express.Router();
router.get('*', (req, res) => {
  res.sendFile(distDir);
});
app.use('*', router);

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log('App now running on port', port);
});
