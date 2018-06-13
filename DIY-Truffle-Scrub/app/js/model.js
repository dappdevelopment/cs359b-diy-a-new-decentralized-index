var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var schema = require('./schema.js');
var uristring = process.env.MONGODB_URI || "mongodb://localhost:27017/diyindex";
// console.log("schema value: " + schema.value);
var sha256 = require('js-sha256').sha256;



mongoose.connect(uristring, function (err, res) {
    if (err) {
      	console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
      	console.log ('Successfully connected to: ' + uristring);
    }
});

var createToken = async function(name, address, symbol, decimal) {
	let newToken = new schema.Tokens ({
		name: name,
		address: address,
		symbol: symbol,
		decimal: decimal
	});
	try {
		let savedToken= await schema.Tokens.findOneAndUpdate({address: address}, {$setOnInsert: newToken}, {upsert: true, returnNewDocument: true});
		console.log("saved token successfully");
		console.log(savedToken); 
		return address;
	} catch (err) {
		console.log("err in createToken");
		console.log(err);
	}
}
// var getTokenData = async function(){
//     try{
//         let tokens = await schema.Tokens.find({});
//         console.log("mode call: " + tokens);
//         let tokensList = []
//         for (let i in tokens){
//             newToken = JSON.parse(JSON.stringify(tokens[i]));
//             tokensList.concat([newToken])
//         }
//         return {tokensList: tokensList}
//     } catch (error){
//         console.log("error in getTokenData");
// 		console.log(err);
//     }
// }

var getPriceData = async function() {
	try {
        // let prices = await schema.Prices.find({});
        schema.Prices.find({"symbol": "MKRD"}, function(error, data){
            if (error){
              console.log("price getting error");
            } else { 
              console.log("data: " + JSON.parse(JSON.stringify(data)));
              let prices =  JSON.parse(JSON.stringify(data))
              return {pricesList: prices};
            //   let prices =  JSON.parse(JSON.stringify(data))
            }
          })
        let pricesList = []
		// for (let i in prices) {
		// 	newPrice = JSON.parse(JSON.stringify(prices[i]));
		// 	pricesList.concat([newPrice])
        // }
        return {pricesList: pricesList};
        
	} catch (err) {
		console.log("error in getPriceData");
		console.log(err);
	}
}

var findToken = async function(symbol) {
	try {
		let foundToken = await schema.Tokens.find({symbol: symbol});
		console.log('foundToken: ' + foundToken);
		return foundToken;
	} catch (err) {
		console.log("error in findToken");
		console.log(err);
	}
}
var resetDB = async function() {
	try {
		await schema.Tokens.remove({});
		await schema.Prices.remove({});
		await schema.SmartContracts.remove({});
		console.log("successful deletion");
	} catch (err) {
		console.log("error during removal");
		console.log(err);
	}
}

// getPriceData()
module.exports.createToken = createToken;
module.exports.getPriceData = getPriceData;
module.exports.resetDB = resetDB;
module.exports.findToken = findToken;
// module.exports.getTokenData = getTokenData;