"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Web3 = require("web3");
var Logger = require("./logger");
var Constants = require("./constants");
var RadarRelay = require("./radar_relay");
var CreateOrder = require("./create_order");
///******************************************************************************/
///* Express server routes */ 
///******************************************************************************/
//// Create a new express application instance
//const app: express.Application = express();
//
//// The port the express app will listen on
//// const port: number = process.env.PORT || 3000;
//const port: number = 3000;
//
//// Mount the WelcomeController at the /welcome route
//app.use('/welcome', WelcomeController);
//
//// Serve the application at the given port
//app.listen(port, () => {
//    // Success callback
//    console.log(`Listening at http://localhost:${port}/`);
//});
/******************************************************************************/
/* Setup of a dummy js file usage */
/******************************************************************************/
var AnotherFile = require('./another_file.js');
console.log('AnotherFile.names = ' + AnotherFile.names);
/******************************************************************************/
/* Provider Engine Wrapper */
/******************************************************************************/
var Web3ProviderEngine = require("web3-provider-engine");
var FilterSubprovider = require("web3-provider-engine/subproviders/filters");
var FetchSubprovider = require("web3-provider-engine/subproviders/fetch");
function ZeroClientProvider(opts) {
    opts = opts || { rpcUrl: undefined };
    var engine = new Web3ProviderEngine();
    var filterSubprovider = new FilterSubprovider();
    engine.addProvider(filterSubprovider);
    var fetchSubprovider = new FetchSubprovider({ rpcUrl: opts.rpcUrl });
    engine.addProvider(fetchSubprovider);
    engine.start();
    return engine;
}
/******************************************************************************/
/* Top-level */
/******************************************************************************/
/*** Parameters ***/
var params = new URLSearchParams(window.location.search);
/* Look up debug mode, currency, web3 provider */
var paramDebug = params.has("debug");
var paramCurrency = params.get("cur") || Constants.FIAT_CURRENCY_DEFAULT;
var paramProvider = params.get("provider") || (typeof window.web3 !== 'undefined') ? 'current' : 'infura';
/*** Logging ***/
if (paramDebug)
    Logger.enable();
else
    Logger.disable();
/* Log parameters */
Logger.log('[App] Parameter debug: ' + paramDebug);
Logger.log('[App] Parameter cur: ' + paramDebug);
Logger.log('[App] Parameter provider:' + paramProvider);
/*** Currency ***/
var fiatCurrencyInfo;
fiatCurrencyInfo = Constants.FIAT_CURRENCY_MAP[paramCurrency] || Constants.FIAT_CURRENCY_MAP[Constants.FIAT_CURRENCY_DEFAULT];
/*** Web3 ***/
var web3;
if (paramProvider == 'current')
    web3 = new Web3(window.web3.currentProvider);
else if (paramProvider == 'localhost')
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
else
    web3 = new Web3(ZeroClientProvider({ getAccounts: function (cb) { cb(null, []); }, rpcUrl: Constants.INFURA_API_URL }));
/*** Testing web3 contract address ***/
console.log('Using web3 version: ' + web3.version);
// var contract:any;
// var userAccount:any;
// var contractDataPromise = $.getJSON('DIY.json');
// var networkIdPromise = web3.eth.net.getId(); // resolves on the current network id
// var accountsPromise = web3.eth.getAccounts(); // resolves on an array of accounts
// Promise.all([contractDataPromise, networkIdPromise, accountsPromise])
//   .then(function initApp(results) {
//     var contractData = results[0];
//     var networkId = results[1];
//     var accounts:any = results[2];
//     userAccount = accounts[0];
//     // (todo) Make sure the contract is deployed on the network to which our provider is connected
//     if (!(networkId in contractData.networks)) {
//         throw new Error("Contract not found in selected Ethereum network on MetaMask.");
//     }
//     var contractAddress = contractData.networks[networkId].address;
//     contract = new web3.eth.Contract(contractData.abi, contractAddress);
//   })
//   .then(refreshBalance)
//   .catch(console.error);
// function refreshBalance() { // Returns web3's PromiEvent
//     // Calling the contract (try with/without declaring view)
//     contract.methods.balanceOf(userAccount).call().then(function (balance:any) {
//     $('#display').text(balance + " DIY");
//     $("#loader").hide();
//     });
// }
/*** MVC ***/
var radar_relay = new RadarRelay.RadarRelay();
radar_relay.get_radar_relay_orders().catch(console.error);
window._var = 10;
radar_relay.get_best_bid().then(function (bid) {
    window.best_bid = bid;
});
radar_relay.get_best_ask().then(function (ask) {
    window.best_ask = ask;
});
radar_relay.get_order_book().then(function (orderbook) {
    window.order_book = orderbook;
});
var create_order = new CreateOrder.CreateOrder();
create_order.create_and_fill_order();
//# sourceMappingURL=app.js.map