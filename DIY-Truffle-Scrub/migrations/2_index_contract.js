var WETH_address = '0xd0a1e359811322d97991e03f863a0c30c2cf029c';
var ZRX_address = '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570';
var addresses = [WETH_address, ZRX_address];
var quantities = [50, 50];
var rebalanceInBlocks = 10;
var proxyAddress = '0x087eed4bc1ee3de49befbd66c662b434b15d49d4';
var exchangeAddress = '0x90fe2af704b34e0224bf2299c838e04d4dcf1364';
var diyindex = '0x2BE71CE2a9bF92AA830f8926651c90A977f68a1A'; // account 2 that DIYIndex Controls

var index_contract = artifacts.require("IndexContract");  
module.exports = function(deployer) {
    deployer.deploy(index_contract, addresses, quantities, rebalanceInBlocks, proxyAddress, exchangeAddress, WETH_address, diyindex);
};
