"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as bootstrap from 'bootstrap';
var $ = require("jquery");
var Web3 = require("web3");
var Logger = require("./logger");
var Constants = require("./constants");
var RadarRelay = require("./radar_relay");
var CreateOrder = require("./create_order");
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
/*** MVC ***/
var radar_relay = new RadarRelay.RadarRelay();
radar_relay.get_radar_relay_orders().catch(console.error);
var create_order = new CreateOrder.CreateOrder();
create_order.create_and_fill_order();

var next = 1;
$("#b1").click(function (e) {
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
    var addToDataSource = $(addto).attr('data-source');
    $("#field" + next).attr('data-source', addToDataSource);
    $("#count").val(next);
    $('.remove-me').click(function (e) {
        e.preventDefault();
        var fieldNum = this.id.charAt(this.id.length - 1);
        var fieldID = "#field" + fieldNum;
        var selectID = '#selectToken' + fieldNum;
        $(this).remove();
        $(fieldID).remove();
        $(selectID).remove();
    });
    getTokens(selectButton[0]);
});
var select = document.getElementById("selectToken1");
function getTokens(select) {
    var options = [];
    var request = new XMLHttpRequest();
    var url = 'https://api.coinmarketcap.com/v2/ticker/?limit=20';
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.responseText);
            for (var id in response.data) {
                options.push(response.data[id].name);
            }
            for (var i = 0; i < options.length; i++) {
                var opt = options[i];
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                select.appendChild(el);
            }
        }
    };
    request.open("GET", url, true);
    request.send();
}
getTokens(select);
var form = document.getElementsByClassName("input-append").item(0);
form.addEventListener('submit', function (e) {
    e.preventDefault();
    var percentSum = 0;
    var answer = {};
    answer["tokens"] = [];
    for (var i = 1; i <= next; i++) {
        var addSel = 'selectToken' + i;
        var addto = "field" + i;
        var tokenElem = document.getElementById(addSel);
        var token = tokenElem.value;
        var percentageElem = document.getElementById(addto);
        var percentage = percentageElem.value;
        percentSum += Number(percentage);
        answer["tokens"].push({ "token": token, "percentage": percentage });
    }
    var rebalanceElem = document.getElementById("rebalance");
    answer["rebalance"] = rebalanceElem.value;
    var totalElem = document.getElementById("total");
    if (percentSum > 100) {
        totalElem.value = "Err";
    }
    else {
        totalElem.value = percentSum;
    }
    console.log(answer);
});
//# sourceMappingURL=app.js.map