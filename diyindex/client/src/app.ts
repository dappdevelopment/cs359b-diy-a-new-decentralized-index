// import * as bootstrap from 'bootstrap';
import $ = require("jquery");
import Web3 = require('web3');
// import * as Web3 from 'web3';
import {Web3Provider} from '0x.js';

import * as Logger from "./logger";
import * as Constants from "./constants";
import * as RadarRelay from "./radar_relay";
import * as CreateOrder from "./create_order";

const AnotherFile = require('./another_file.js');
console.log('AnotherFile.names = ' + AnotherFile.names);

/******************************************************************************/
/* Injected Web3 */
/******************************************************************************/

/* Declare the potential existence of an injected web3 */
declare global {
    interface Window {
        web3: Web3 | undefined;
    }
}

/******************************************************************************/
/* Provider Engine Wrapper */
/******************************************************************************/

import * as Web3ProviderEngine from "web3-provider-engine";
import * as FilterSubprovider from "web3-provider-engine/subproviders/filters";
import * as FetchSubprovider from "web3-provider-engine/subproviders/fetch";

interface ZeroClientProviderOptions {
    getAccounts?: (error: any, accounts?: Array<string>) => void
    rpcUrl?: string;
}

function ZeroClientProvider(opts?: ZeroClientProviderOptions) {
  opts = opts || {rpcUrl: undefined};

  const engine = new Web3ProviderEngine();

  const filterSubprovider = new FilterSubprovider();
  engine.addProvider(filterSubprovider);

  const fetchSubprovider = new FetchSubprovider({rpcUrl: opts.rpcUrl});
  engine.addProvider(fetchSubprovider);

  engine.start();

  return engine;
}

/******************************************************************************/
/* Top-level */
/******************************************************************************/

/*** Parameters ***/

let params: URLSearchParams = new URLSearchParams(window.location.search);

/* Look up debug mode, currency, web3 provider */
let paramDebug: boolean = params.has("debug");
let paramCurrency: string = params.get("cur") || Constants.FIAT_CURRENCY_DEFAULT;
let paramProvider: string = params.get("provider") || (typeof window.web3 !== 'undefined') ? 'current' : 'infura';

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

let fiatCurrencyInfo: Constants.CurrencyInfo;

fiatCurrencyInfo = Constants.FIAT_CURRENCY_MAP[paramCurrency] || Constants.FIAT_CURRENCY_MAP[Constants.FIAT_CURRENCY_DEFAULT];

/*** Web3 ***/
let web3: Web3;
if (paramProvider == 'current')
    web3 = new Web3(window.web3!.currentProvider);
else if (paramProvider  == 'localhost')
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
else
    web3 = new Web3(ZeroClientProvider({getAccounts: (cb) => { cb(null, []); }, rpcUrl: Constants.INFURA_API_URL}));
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
let radar_relay = new RadarRelay.RadarRelay();
radar_relay.get_radar_relay_orders().catch(console.error);

let create_order = new CreateOrder.CreateOrder();
create_order.create_and_fill_order();



var next = 1;
$("#b1").click(function(e){
    e.preventDefault();
    var addSel = '#selectToken' + next;
    var addto = "#field" + next;
    var addRemove = "#field" + (next);
    next = next + 1;
    var selButton = '<select id="selectToken' + next + '"></select>';
    var selectButton = $(selButton);
    var newIn = '<input autocomplete="off" class="input form-control" placeholder="Enter a numerical percentage" id="field' + next + '" name="field' + next + '" type="text">';
    var newInput = $(newIn);
    var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me" >-</button></div><div id="field">';
    var removeButton = $(removeBtn);

    $(addto).after(newInput);
    $(addto).after(selectButton);
    $(addRemove).after(removeButton);
    let addToDataSource: any = $(addto).attr('data-source');
    $("#field" + next).attr('data-source',addToDataSource);
    $("#count").val(next);  
    
        $('.remove-me').click(function(e){
            e.preventDefault();
            var fieldNum = this.id.charAt(this.id.length-1);
            var fieldID = "#field" + fieldNum;
            var selectID =  '#selectToken' + fieldNum;
            $(this).remove();
            $(fieldID).remove();
            $(selectID).remove();
        });

    getTokens(selectButton[0]);
});

let select:any = document.getElementById("selectToken1"); 

function getTokens(select:any){

    let options:any = [];
    let request = new XMLHttpRequest();
    let url = 'https://api.coinmarketcap.com/v2/ticker/?limit=20';

    request.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        let response = JSON.parse(this.responseText);
        for (var id in response.data){
            options.push(response.data[id].name);
        }
        for (let i = 0; i < options.length; i++){
            var opt = options[i]
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
      }
    }

    request.open("GET", url, true);
    request.send();

}

getTokens(select);

var form = document.getElementsByClassName("input-append").item(0);
form.addEventListener('submit', function(e){
    e.preventDefault();
    let percentSum = 0;
    let answer:any = {}
    answer["tokens"] = []
    for (let i = 1; i <= next; i++) {
        var addSel = 'selectToken' + i;
        var addto = "field" + i;

        let tokenElem: any = document.getElementById(addSel);
        let token = tokenElem.value;
      
        let percentageElem: any = document.getElementById(addto);
        let percentage = percentageElem.value;
        percentSum += Number(percentage)
        answer["tokens"].push({"token": token, "percentage" : percentage})
    }

    let rebalanceElem: any = document.getElementById("rebalance");

    answer["rebalance"] = rebalanceElem.value

    let totalElem: any = document.getElementById("total");
    if ( percentSum > 100){
        totalElem.value = "Err"
    } else {
        totalElem.value = percentSum;
    }

    console.log(answer)
});