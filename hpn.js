var express = require('express');
var hpn = express();

hpn.get('/', function (req, res) {
    res.send("Hi")
});

var port = 80;
hpn.listen(port, function() {
    console.log('Listening on port ' + port);
});
