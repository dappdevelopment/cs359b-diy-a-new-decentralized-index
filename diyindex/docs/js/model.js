var mongoose = require('mongoose');
var schema = require('./schema');

var uristring = process.env.MONGODB_URI || "mongodb://localhost:27017/diyindex";

var sha256 = require('js-sha256').sha256;

mongoose.connect(uristring, function (err, res) {
    if (err) {
      	console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
      	console.log ('Successfully connected to: ' + uristring);
    }
});

