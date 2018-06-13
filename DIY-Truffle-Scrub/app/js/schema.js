var mongoose = require('mongoose');

var PriceSchema = new mongoose.Schema({
    timestamp: {type: String},
    symbol: {type: String},
    base: {type: String},
    price: {type: String}
});

var TokenSchema = new mongoose.Schema({
    name: {type: String},
    address: {type: String, unique: true},
    symbol: {type: String},
    decimal: {type: String}
});

var SmartContractSchema = new mongoose.Schema({
    txHash: {type: String},
    contract_address: {type: String, unique: true},
    owner: {type: String},
    allocation_WETH: {type: Number},
    allocation_ZRX: {type: Number},
    creation_time: {type: Date}, 
    lastRebalanceTime: {type: Date},
    ETHDeposited: {type: Number},
    WETH_balance: {type: Number},
    ZRX_balance: {type: Number}
});


// the schema is useless so far
// we need to create a model using it
PriceSchema.index({symbol:1, timestamp:1}, { unique: true });

var Prices = mongoose.model('Prices', PriceSchema);
var Tokens = mongoose.model('Tokens', TokenSchema);
var SmartContracts = mongoose.model('SmartContracts', SmartContractSchema);

// make this available to our photos in our Node applications
module.exports.Prices = Prices;
module.exports.Tokens = Tokens;
module.exports.SmartContracts = SmartContracts;
