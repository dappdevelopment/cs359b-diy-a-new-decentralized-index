const fs = require('fs');
const solc = require('solc');
const path = require('path');
const Web3 = require('web3');

let ganache = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
let web3 = new Web3(ganache); 

const contractFile = path.resolve('./contracts/CardinalToken.sol');
let source = fs.readFileSync(contractFile, 'utf-8');
var input = {'CardinalToken': source};
const name = 'CardinalToken:CardinalToken';
let compiledContract = solc.compile({sources: input}, 1);
let abi = compiledContract.contracts[name].interface;
let bytecode = compiledContract.contracts[name].bytecode;
let gasEstimate = web3.eth.estimateGas({data: bytecode});
let MyContract = web3.eth.contract(JSON.parse(abi));
let gas = 4712388;
let gasPrice = '100000000000';
let account = '0x2BE71CE2a9bF92AA830f8926651c90A977f68a1A';
//var myContractInstance = MyContract.new({from: account, data: bytecode, gasPrice: gasPrice, gas: gas});
//console.log('Hash = ' + myContractInstance.transactionHash);
//console.log('Address = ' + myContractInstance.address);

var myContractReturned = MyContract.new({
   from: account,
   data: bytecode,
   gas: gasEstimate}, function(err, myContract){
    if(!err) {
       // NOTE: The callback will fire twice!
       // Once the contract has the transactionHash property set and once its deployed on an address.

       // e.g. check tx hash on the first call (transaction send)
       if(!myContract.address) {
           console.log('Transaction hash = ' + myContract.transactionHash) // The hash of the transaction, which deploys the contract
       
       // check address on the second call (contract deployed)
       } else {
           console.log('Address = ' + myContract.address) // the contract address
       }

       // Note that the returned "myContractReturned" === "myContract",
       // so the returned "myContractReturned" object will also get the address set.
    } else {
			console.log(err);
		}
});
