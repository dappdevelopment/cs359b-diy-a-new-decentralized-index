var mongoose = require('mongoose');
// Dummy data so far
var UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    questions: [{type: mongoose.Schema.ObjectId}],
    answers: [{type: mongoose.Schema.ObjectId}],
    address: {type: String, unique: true}
});

var TokenSchema = new mongoose.Schema({
    username: {type: String, required: true},
    questions: [{type: mongoose.Schema.ObjectId}],
    answers: [{type: mongoose.Schema.ObjectId}],
    address: {type: String, unique: true}
});

var PriceSchema = new mongoose.Schema({
    username: {type: String, required: true},
    questions: [{type: mongoose.Schema.ObjectId}],
    answers: [{type: mongoose.Schema.ObjectId}],
    address: {type: String, unique: true}
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', UserSchema);
var Token = mongoose.model('Token', TokenSchema);
var Price = mongoose.model('Price', PriceSchema);

// make this available to our tokens to our Node applications
module.exports.User = User;
module.exports.Token = Token;
module.exports.Price = Price;