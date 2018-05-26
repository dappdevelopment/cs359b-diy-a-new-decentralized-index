function app() {
	if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
	web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider
	console.log("Using web3 version: " + Web3.version);

	var contract;
	var userAccount;

	var contractDataPromise = $.getJSON('Marketdata.json');
	var networkIdPromise = web3.eth.net.getId(); // resolves on the current network id
	var accountsPromise = web3.eth.getAccounts(); // resolves on an array of accounts
  
	Promise.all([contractDataPromise, networkIdPromise, accountsPromise])
		.then(function initApp(results) {
			var contractData = results[0];
			var networkId = results[1];
			var accounts = results[2];
			userAccount = accounts[0];

		// (todo) Make sure the contract is deployed on the network to which our provider is connected
		if (!(networkId in contractData.networks)) {
			throw new Error("Contract not found in selected Ethereum network on MetaMask.");
		}
	
		var contractAddress = contractData.networks[networkId].address;
		contract = new web3.eth.Contract(contractData.abi, contractAddress);
	})
	.then(getCurrentMarketPrice)
	.catch(console.error);

  function getCurrentMarketPrice() {
    contract.methods.getLatestDs().call().then(function (last_ds) {
        console.log('Inside display function and ds = ' + web3.utils.toUtf8(last_ds));
        console.log('Inside display function and ds = ' + last_ds);
        $('#display').text(web3.utils.toUtf8(last_ds));
        }).catch(console.error);
  }

//	function getCurrentMarketPrice() { 
//		// Returns web3's PromiEvent
//		// Calling the contract (try with/without declaring view)
//		contract.methods.getAllMarketData().call().then(function (priceUSD) {
//		$('#display').text(priceUSD);
//		$("#loader").hide();
//		});
//	}

	$("#submit").click(function() {
    var ds = $("#ds").val();
		var tokens = $("#token").val().split(',');
		var prices = $("#price").val().split(',');
    console.log('Setting ds');
    contract.methods.setLastDs(ds);
    console.log('Already set ds');
		// add_data_to_chain(ds, tokens, prices);
	})
//  .then(getCurrentMarketPrice)
//  .catch(console.error);

	function add_data_to_chain(ds, tokens, prices) {
    console.log('ds = ' + ds);
		console.log('Tokens = ' + tokens);
		console.log('Prices = ' + prices);
    contract.methods.add_market_data(ds, tokens, prices);
	}

	
//	function transfer(to, amount) {
//		console.log(to, amount)
//		if (!to || !amount) return console.log("Fill in both fields");
//
//		$("#loader").show();
//
//		contract.methods.transfer(to, amount).send({from: userAccount})
//		.then(refreshBalance)
//		.catch(function (e) {
//			$("#loader").hide();
//		});
//	}
//
//	function mint(amount) {
//		console.log(amount)
//		if (!amount) return console.log("Fill in amount field");
//
//		$("#loader").show();
//
//		contract.methods.mint(amount).send({from: userAccount})
//		.then(refreshBalance)
//		.catch(function (e) {
//			$("#loader").hide();
//		});
//	}
//	
//	$("#button").click(function() {
//		var toAddress = $("#address").val();
//		var amount = $("#amount").val();
//		transfer(toAddress, amount);
//	});
//
//	$("#mint").click(function() {
//		var amount = $("#amount").val();
//		mint(amount);
//	});
}

$(document).ready(app);
