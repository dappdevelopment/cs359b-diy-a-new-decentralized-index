var express = require('express');
var bodyParser = require('body-parser');
var ObjectId = require('mongoose').Types.ObjectId;
var mongoose = require('mongoose');
require('dotenv').config()

// var fileUpload = require('express-fileupload');


var HttpClient = require('@0xproject/connect').HttpClient;
var constants = require('./constants').Constants;
var csv = require('./csv');
// var $ = require('./app/js/jquery.min.js');

// var mongoose = require('mongoose')
var STATUS_USER_ERROR = 422
var STATUS_OK = 200
var NUM_QUERIES = 3

var sha256 = require('js-sha256').sha256;

var uristring = process.env.MONGODB_URI || "mongodb://localhost:27017/diyindex";

// connect to database
mongoose.connect(uristring, function (err, res) {
  if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
      console.log ('Successfully connected to: ' + uristring);
  }
});

var app = express();

var model = require('./app/js/model');
var schemaInfo = require('./app/js/schema')

// parse json bodies in post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// serve all files out of public folder
app.use(express.static(__dirname + '/app'));

var path = require("path");

app.get('/', function(request, response) { 
  console.log("/GET index")
  response.sendFile('/index.html');
})

// console.log('window: '  + window)

// window.HttpClient =  HttpClient;
// console.log(window.HttpClient)

app.get('/getHttpClient', function(request, response){
    
    const radarRelay = 'https://api.kovan.radarrelay.com/0x/v0/';
    const httpClient = new HttpClient(radarRelay);
    
    // // console.log(constants)
    // console.log('constants weth addr:', constants.weth_address);
    // console.log('constants zrx addr:', constants.zrx_address);
    
    const weth = constants.weth_address;
    const zrx = constants.zrx_address;
    

    httpClient.getOrderbookAsync({baseTokenAddress: weth.toLowerCase(), quoteTokenAddress: zrx.toLowerCase()}).then(function (books) {
        console.log('Books = ' + books);
        var best_bid_order = books.asks[books.asks.length -1];
        var best_ask_order = books.bids[books.bids.length -1];   
        best_ask = best_ask_order.takerTokenAmount / best_ask_order.makerTokenAmount;
        best_bid = best_bid_order.makerTokenAmount / best_bid_order.takerTokenAmount;
        

        response.status(200).send(JSON.stringify([best_ask, best_bid, best_ask_order, best_bid_order]));
      })
    .catch(console.error);
})
// var template = require('./app/js/templates.js');
// app.get('/template', template.get);
// var upload = require('./app/js/upload.js');
// app.post('/', upload.post);

app.get('/prices', async function(request, response) {
  console.log("/GET prices")
  
  // let prices = await model.getPriceData();

	// response.set('Content-type', 'application/json');
	// response.status(STATUS_OK);
  // response.send(JSON.stringify(prices));
  schemaInfo.Prices.find({ $or: [ { symbol: "WETH" }, { symbol: "ZRX" } ] } ,function(err, priceData){
    if(err){
        console.log("Error fetching prices",  err);
        response.status(500).send(JSON.stringify(err));
        return;
    }
    var prices = JSON.parse(JSON.stringify(priceData));
    response.status(200).send(JSON.stringify(prices));
}).sort({"symbol":1,"timestamp":1});
});


// app.get('/tokens', async function(request, response) {
//   console.log("/GET tokens")
//   try {
//     let token = await model.findToken("XSC");
//     console.log("token: " + token)
//     response.set('Content-type', 'application/json');
//     response.status(STATUS_OK);
//     response.send(JSON.stringify(token));
//   } catch (err) {
//     console.log(err);
//   }
// });

app.get('/tokens', function (request, response) {
  // let token = await model.findToken("ETH");
  // response.set('Content-type', 'application/json');
  // response.status(STATUS_OK);
  // response.send(JSON.stringify(token));
  schemaInfo.Tokens.find(function(err, tokenData){
      if(err){
          console.log("Error fetching tokens",  err);
          response.status(500).send(JSON.stringify(err));
          return;
      }
      var tokens = JSON.parse(JSON.stringify(tokenData));
      response.status(200).send(JSON.stringify(tokens));
  });
});

port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening at 127.0.0.1:' + port);

async function clearDB() {
  await model.resetDB();
}

async function initDB() {
  // readTextFile("./dbData/tokens.csv");
  // console.log(tokens[1][1])
  // let testToken = await model.createToken("Dogecoin","0x0F513fFb4926ff82D7F60A05069347AcA295C413", "DGE", "18");

  var csvHeaders = {
      Tokens: {
          headers: ["address", "name", "symbol", "decimal"]
      },
      Prices: {
          headers: ["timestamp", "symbol", "base", "price"]
      }
  }

  //adjust this path to the correct location
  csv.importFile(__dirname + '/dbData/tokens.csv', csvHeaders.Tokens.headers, 'Tokens');
  csv.importFile(__dirname + '/dbData/prices.csv', csvHeaders.Prices.headers, 'Prices');

}


async function test() {
  await clearDB();
  await initDB();
}

// test();

// 
