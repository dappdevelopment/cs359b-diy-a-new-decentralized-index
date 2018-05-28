var express = require('express');
var mongoose = require('mongoose');
var model = require('../docs/js/model');
var STATUS_USER_ERROR = 422
var STATUS_OK = 200

var app = express();
app.use(express.static("public"));
//Set up default mongoose connection
// Insert real mongo address here
var mongoDB = 'mongodb://localhost:27017/diyindex';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Dummy get express route
app.get('/', async function(request:any, response:any) {
    console.log("/GET tokens")
  
    let tokens = await model.getTokens();
  
    response.set('Content-type', 'application/json');
    response.status(STATUS_OK);
    response.send(JSON.stringify(tokens));
});

app.listen(3000);
console.log('Listening at 127.0.0.1:' + 3000);

async function clearDB() {
    await model.resetDB();
}