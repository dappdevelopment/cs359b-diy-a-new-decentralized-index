
// Import the page's CSS. Webpack will know what to do with it, 
// as it's been configured by truffle-webpack
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
// Make sure you've ran truffle compile first
import contract_build_artifacts from '../../build/contracts/OraclizeTest.json'

// OraclizeContract is our usable abstraction, which we'll use through the code below.
var OraclizeContract = contract(contract_build_artifacts);

var accounts;
var account;

window.App = {
  currentBalance: 0,
  coins : {"eth":0, "eos":0, "trx":0, "ven":0, "icx":0, "bnb":0, "omg":0, "zil":0, "ae":0, "zrx":0, "btm":0},

  // 'Constructor'
  start: function() {
    var self = this;

    // Bootstrap the Contract abstraction for use with the current web3 instance
    OraclizeContract.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    });
  },

  // Show an error
  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  // Opens a socket and listens for Events defined in our contract.
  addEventListeners: function(instance){
    var self = this;

    var LogCreated = instance.LogUpdate({},{fromBlock: 0, toBlock: 'latest'});
    var LogPriceUpdateEth = instance.LogPriceUpdateEth({},{fromBlock: 0, toBlock: 'latest'});
    var LogPriceUpdateEos = instance.LogPriceUpdateEos({},{fromBlock: 0, toBlock: 'latest'});
    var LogPriceUpdateTrx = instance.LogPriceUpdateTrx({},{fromBlock: 0, toBlock: 'latest'});
    var LogPriceUpdateVen = instance.LogPriceUpdateVen({},{fromBlock: 0, toBlock: 'latest'});
    var LogPriceUpdateIcx = instance.LogPriceUpdateIcx({},{fromBlock: 0, toBlock: 'latest'});
    var LogPriceUpdateBnb = instance.LogPriceUpdateBnb({},{fromBlock: 0, toBlock: 'latest'});
    var LogPriceUpdateOmg = instance.LogPriceUpdateOmg({},{fromBlock: 0, toBlock: 'latest'});
    var LogPriceUpdateZil = instance.LogPriceUpdateZil({},{fromBlock: 0, toBlock: 'latest'});
    var LogPriceUpdateAe = instance.LogPriceUpdateAe({},{fromBlock: 0, toBlock: 'latest'});
    var LogPriceUpdateZrx = instance.LogPriceUpdateZrx({},{fromBlock: 0, toBlock: 'latest'});
    var LogPriceUpdateBtm = instance.LogPriceUpdateBtm({},{fromBlock: 0, toBlock: 'latest'});
    var LogInfo = instance.LogInfo({},{fromBlock: 0, toBlock: 'latest'});

    //For Eth
    LogPriceUpdateEth.watch(function(err, result){
      if(!err){
        App.coins["eth"] = result.args.price;
        App.showBalance(App.coins, App.currentBalance);
      }else{
        console.log(err)
      }
    })

    //For Eos
    LogPriceUpdateEos.watch(function(err, result){
      if(!err){
        App.coins["eos"] = result.args.price;
        App.showBalance(App.coins, App.currentBalance);
      }else{
        console.log(err)
      }
    })

    //For Tron
    LogPriceUpdateTrx.watch(function(err, result){
      if(!err){
        App.coins["trx"] = result.args.price;
        App.showBalance(App.coins, App.currentBalance);
      }else{
        console.log(err)
      }
    })

    //For Vechain
    LogPriceUpdateVen.watch(function(err, result){
      if(!err){
        App.coins["ven"] = result.args.price;
        App.showBalance(App.coins, App.currentBalance);
      }else{
        console.log(err)
      }
    })

    //For Icon
    LogPriceUpdateIcx.watch(function(err, result){
      if(!err){
        App.coins["icx"] = result.args.price;
        App.showBalance(App.coins, App.currentBalance);
      }else{
        console.log(err)
      }
    })

    //For Binance coin
    LogPriceUpdateBnb.watch(function(err, result){
      if(!err){
        App.coins["bnb"] = result.args.price;
        App.showBalance(App.coins, App.currentBalance);
      }else{
        console.log(err)
      }
    })

    //For Omisego
    LogPriceUpdateOmg.watch(function(err, result){
      if(!err){
        App.coins["omg"] = result.args.price;
        App.showBalance(App.coins, App.currentBalance);
      }else{
        console.log(err)
      }
    })

    //For Zilliqa
    LogPriceUpdateZil.watch(function(err, result){
      if(!err){
        App.coins["zil"] = result.args.price;
        App.showBalance(App.coins, App.currentBalance);
      }else{
        console.log(err)
      }
    })

    //For Aeternity
    LogPriceUpdateAe.watch(function(err, result){
      if(!err){
        App.coins["ae"] = result.args.price;
        App.showBalance(App.coins, App.currentBalance);
      }else{
        console.log(err)
      }
    })

    //For 0x
    LogPriceUpdateZrx.watch(function(err, result){
      if(!err){
        App.coins["zrx"] = result.args.price;
        App.showBalance(App.coins, App.currentBalance);
      }else{
        console.log(err)
      }
    })

    //For Bytom
    LogPriceUpdateBtm.watch(function(err, result){
      if(!err){
        App.coins["btm"] = result.args.price;
        App.showBalance(App.coins, App.currentBalance);
      }else{
        console.log(err)
      }
    })


    // Emitted when the Contract's constructor is run
    LogCreated.watch(function(err, result){
      if(!err){
        console.log('Contract created!');
        console.log('Owner: ' , result.args._owner);
        console.log('Balance: ' , web3.fromWei(result.args._balance, 'ether').toString(), 'ETH');
        console.log('-----------------------------------');
      }else{
        console.log(err)
      }
    })

    // Emitted when a text message needs to be logged to the front-end from the Contract
    LogInfo.watch(function(err, result){
      if(!err){
        console.info(result.args)
      }else{
        console.error(err)
      }
    })
  },

  refreshBalance: function() {
    var self = this;

    var meta;

    OraclizeContract.deployed().then(function(instance) {
      meta = instance;
      App.addEventListeners(instance);

      return meta.getBalance.call(account, {from: account});

    }).then(function(value) {

      App.currentBalance = web3.fromWei(value.valueOf(), 'ether');
      App.showBalance(App.coins, App.currentBalance);

    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see console log.");
    });
  },

  showBalance: function(coins, balance){
    // Balance updated, start CSS animation
    var row = document.getElementById('row');
    row.style.animation = 'heartbeat 0.75s';
    
    // Removes CSS animation after 1100 ms
    setTimeout(function(row){
      var row = document.getElementById('row');
      row.style.animation = null;
    }, 1100)
    console.log(coins)
    var balance_element = document.getElementById("balance");
    // Rounding can be more precise, this is just an example
    balance_element.innerHTML = parseFloat(balance).toFixed(6);

    var eth_element = document.getElementById("eth-price");
    eth_element.innerHTML = Number(App.coins["eth"]).toFixed(2);

    var btc_element = document.getElementById("eos-price");
    btc_element.innerHTML = Number(App.coins['eos']).toFixed(2);

    var tron_element = document.getElementById("trx-price");
    tron_element.innerHTML = Number(App.coins["trx"]).toFixed(2);

    var ven_element = document.getElementById("ven-price");
    ven_element.innerHTML = Number(App.coins['ven']).toFixed(2);

    var icx_element = document.getElementById("icx-price");
    icx_element.innerHTML = Number(App.coins['icx']).toFixed(2);

    var bnb_element = document.getElementById("bnb-price");
    bnb_element.innerHTML = Number(App.coins['bnb']).toFixed(2);

    var omg_element = document.getElementById("omg-price");
    omg_element.innerHTML = Number(App.coins['omg']).toFixed(2);

    var zil_element = document.getElementById("zil-price");
    zil_element.innerHTML = Number(App.coins['zil']).toFixed(2);

    var ae_element = document.getElementById("ae-price");
    ae_element.innerHTML = Number(App.coins['ae']).toFixed(2);

    var zrx_element = document.getElementById("zrx-price");
    zrx_element.innerHTML = Number(App.coins['zrx']).toFixed(2);

    var btm_element = document.getElementById("btm-price");
    btm_element.innerHTML = Number(App.coins['btm']).toFixed(2);


  }
};

// Front-end entry point
window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  // All systems go, start App!
  App.start();
});