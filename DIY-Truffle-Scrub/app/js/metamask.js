// var constants = window.Constants;
// var bignumber = require('bignumber.js');

function app() {
	var constants = window.Constants;

	// var HttpClient = include('@0xproject/connect').HttpClient;

	// const radarRelay = 'https://api.kovan.radarrelay.com/0x/v0/';
	//   const httpClient = new HttpClient(radarRelay)
	//   const weth = constants.weth_address;
	//   const zrx = constants.zrx_address;

	//   httpClient.getOrderbookAsync({baseTokenAddress: weth.toLowerCase(), quoteTokenAddress: zrx.toLowerCase()}).then(function (books) {
	//     console.log('Books = ' + books);
	//     window.best_ask = books.asks[0];
	//     window.best_bid = books.bids[0];
	//   })
	//   .catch(console.error);

	if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
	web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider
	console.log("Using web3 version: " + Web3.version);
	console.log("Is metamask the provider = " + window.web3.currentProvider.isMetaMask);
	console.log("Constructor name = " + window.web3.currentProvider.constructor.name);
	console.log("Type of web3 = " + typeof web3);
	window.MAX_UINT = web3.utils.toBN("115792089237316195423570985008687907853269984665640564039457584007913129639935");

	var contract;
	var userAccount;
	var diyindexAccount;
	var contractABI;
	var displayFlag = false;

	// var contractDataPromise = $.getJSON('Marketdata.json');
	var contractDataPromise = $.getJSON('build/contracts/IndexContract.json');
	console.log("Web3.eth.net = " + web3.eth.net);
	if (typeof web3.eth.net === 'undefined') {
			throw new Error("Parity signer is not available.");
	};

	// Any scope
	var networkIdPromise = web3.eth.net.getId(); // resolves on the current network id
	var accountsPromise = web3.eth.getAccounts(); // resolves on an array of accounts
  
	Promise.all([contractDataPromise, networkIdPromise, accountsPromise])
		.then(function initApp(results) {
			var contractData = results[0];
			var networkId = results[1];
			var accounts = results[2];
			userAccount = accounts[0];
            diyindexAccount = accounts[1];

		// (todo) Make sure the contract is deployed on the network to which our provider is connected
		if (!(networkId in contractData.networks)) {
			throw new Error("Contract not found in selected Ethereum network on MetaMask.");
		}
	
		console.log('Before contractData');
		var contractAddress = contractData.networks[networkId].address;
		console.log('ContractAddress = ' + contractAddress);
		window.contractABI = contractData.abi;
		contract = new web3.eth.Contract(window.contractABI, contractAddress);
		// contract.options.address = contractAddress;
		console.log('Setup contract');
		window.contractAbi = contractABI;
		window.contractAddress = contractAddress;
		window.contract = contract;
		window.WETH_Token = new web3.eth.Contract(constants.weth_abi, constants.weth_address);
		window.ZRX_Token = new web3.eth.Contract(constants.zrx_abi, constants.zrx_address);
		window.EXCHANGE = new web3.eth.Contract(constants.exchange_abi, constants.exchange_address);
	})
	.then(getTokenAddresses)
	.then(refreshTokenDetails)
	.catch(console.error);

	function allowWrappedEtherForSmartContract() {
		console.log('Inside Allow Wrapped Ether Transfer to Smart Contract');
		window.WETH_Token.methods.approve(window.contractAddress, window.MAX_UINT).send({from: userAccount}).then(function (result) {
			if (result) {
				console.log('Result = ' + result);
				console.log('Provided ' + window.contractAddress + ' appropriate permissions for account = ' + userAccount);
			};
		})
    .then(refreshTokenDetails)
    .catch(console.error);
	};

	function transferWETHToContract(amount) {
		console.log('Inside transfer WETH to contract');
		total_amount_after_decimals = web3.utils.toWei(amount, 'ether');
		console.log('Total amount = ' + total_amount_after_decimals);
		contract.methods.deposit_weth(total_amount_after_decimals).send({from: userAccount}).then(function (result) {
			if (result) {
				console.log('Deposited? = ' + result);
				console.log('To Contract Address ' + contractAddress);
			};
		})
    .then(refreshTokenDetails)
    .catch(console.error);
	}

	function setAllowanceForAllAddresses(tokenAddress) {
		console.log('Inside method setAllowance');
		contract.methods.set_allowances(tokenAddress).send({from: userAccount})
		.then(function x() {
			console.log('After setting allowance');
		})
    .then(refreshTokenDetails)
		.catch(console.error);
	};

  function refreshTokenDetails() {
	if (displayFlag === true){
		display_weth_balance();
		getTokenAddresses();
		getTokenQuantities();
		getTokenWeights();
		getRebalanceInBlocks();
		getLastRebalanced();
		getContractApprovalWETH();
		getOwnerApprovalContractWETH();
		getOwnerApprovalContractZRX();
		getCurrentBlockHeight();
		$('#bestAsk').text("0.0021694 WETH/ZRX");
		$('#bestBid').text("0.0020805 WETH/ZRX");
	}
  }

  function display_weth_balance(){
			window.WETH_Token.methods.balanceOf(contractAddress).call().then(function (weth_balance) {
			$('#display').text(weth_balance);
		});
	}

	function getTokenAddresses() {
		contract.methods.token_addresses().call().then(function (addresses) {
			$('#token_addresses').text(addresses);
		})
		.catch(console.error);
	};

	function getCurrentBlockHeight() {
		web3.eth.getBlockNumber().then(function(blockHeight) { 
			$('#current_block_height').text(blockHeight);
			window.currentBlockHeight = blockHeight;
		});
	};

  function getTokenQuantities() {
    contract.methods.token_quantities().call().then(function (quantities) {
			balance_weth = Number(quantities[0]);
			balance_weth = balance_weth / 1000000000000000000;
			$('#balance_weth').text(balance_weth);
			$('#balance_zrx').text(quantities[1]);
		})
		.catch(console.error);
  };

  function getTokenWeights() {
    contract.methods.token_weight().call().then(function (weights) {
			$('#quantity_weth').text(weights[0] + "%");
			$('#quantity_zrx').text(weights[1] + "%");
		})
		.catch(console.error);
  };
  
  function calculateWts(weth_price, zrx_price){
	let balance_weth = $('#balance_weth').text()
	let balance_zrx = $('#balance_zrx').text()
	let quantity_weth = $('#quantity_weth').text()
	let quantity_zrx = $('#quantity_zrx').text()

	balance_weth = Number(balance_weth);
	balance_zrx =  Number(balance_zrx);
	quantity_weth = Number(quantity_weth.replace(/\W/g, ''));
	quantity_zrx = Number(quantity_zrx.replace(/\W/g, ''));
	let total = (balance_weth * weth_price) + (balance_zrx * zrx_price)
	current_weth = balance_weth * weth_price / total;
	current_zrx = balance_zrx * zrx_price / total;
	if (isNaN(current_weth) || isNaN(current_zrx)){
		$("#weighted_weth").text("Error");
		$("#weighted_zrx").text("Error");
	} else {
		$("#weighted_weth").text(String(current_weth * 100) + "%");
		$("#weighted_zrx").text(String(current_zrx * 100) + "%");
	}

};

  function getLastRebalanced() {
    contract.methods.get_last_rebalanced().call().then(function (last_rebalanced) {
			$('#last_rebalanced').text(last_rebalanced);
		})
		.catch(console.error);
  };

  function getRebalanceInBlocks() {
    contract.methods.rebalance_in_blocks().call().then(function (rebalance_in_blocks) {
			$('#rebalance_in_blocks').text(rebalance_in_blocks);
		})
		.catch(console.error);
  };

	function getContractApprovalWETH() {
		window.WETH_Token.methods.allowance(userAccount, contractAddress).call().then(function (allowance) {
			$('#contract_approval_WETH').text("WETH:contract on owner = " + allowance);
		})
		.catch(console.error);
	}

	function getOwnerApprovalContractWETH() {
    window.WETH_Token.methods.allowance(contractAddress, userAccount).call().then(function (allowance) {
			$('#owner_approval_contract_WETH').text("WETH:owner on contract = " + allowance);
		})
		.catch(console.error);
  };

	function getOwnerApprovalContractZRX() {
    window.ZRX_Token.methods.allowance(contractAddress, userAccount).call().then(function (allowance) {
			$('#owner_approval_contract_ZRX').text("ZRX:owner on contract = " + allowance);
		})
		.catch(console.error);
  };

	function getRebalanceInBlocks() {
    contract.methods.rebalance_in_blocks().call().then(function (rebalance_in_blocks) {
			$('#rebalance_in_blocks').text(rebalance_in_blocks);
		})
		.catch(console.error);
  };

	function withdrawAllTokens() {
		contract.methods.withdraw().send({from: userAccount}).then(function (success) {
			if (success) {
				console.log('Successfully withdrawn tokens');
			};
		})
    .then(refreshTokenDetails)
		.catch(console.error);
	};

	function makeExchangeTrade() {
		const maker = "0x032dbe12b8c4550b6a90490e6f8b79013d3833f7"; // my metamask
		const taker = "0x0000000000000000000000000000000000000000";
		const makerToken = "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570"; // ZRX 
		const takerToken = "0xd0a1e359811322d97991e03f863a0c30c2cf029c"; // WETH
		const feeRecipient = "0xa258b39954cef5cb142fd567a46cddb31a670124";
		const makerTokenAmount = web3.utils.toBN("1000000000000000000");
		const takerTokenAmount = web3.utils.toBN("500000000000000000000");
		const makerFee = 0;
		const takerFee = 0;
		const expirationTimestampInSec = web3.utils.toBN("1530579630");

		const salt = "71908247906872754311838145342720002977696048562630825704739380803597823865473";
		const v = web3.utils.toBN("27");
		const r = "0xf20d22005cacc1ad5a510c090fb937cdb7438750b33c55128e019ec434a061e4";
		const s = "0x35d4772799d272e9c9adf04906a8690870e37d7dd657726652e5e1b7bb17117e";
		const fillTakerTokenAmount = web3.utils.toBN("100000000000000");
		const addresses = [maker, taker, makerToken, takerToken, feeRecipient];
		const values = [makerTokenAmount, takerTokenAmount, makerFee, takerFee, expirationTimestampInSec, salt, fillTakerTokenAmount];
		window.EXCHANGE.methods.getOrderHash([maker, taker, makerToken, takerToken, feeRecipient], [makerTokenAmount, takerTokenAmount, makerFee, takerFee, expirationTimestampInSec, salt]).call().then(function (orderHash) {
			console.log('OrderHash = ' + orderHash);
			window.EXCHANGE.methods.isValidSignature(maker, orderHash, v, r, s).call().then(function (success) {
				if (success) {
					console.log('Contract is valid?' + success);
					contract.methods.make_exchange_trade(addresses, values, v, r, s).send({from: diyindexAccount}).then(function () {
						console.log('Called makeExchangeTrade');
						console.log('Ideally follow the event log in Exchange contract to know of trade');
						console.log('Exchange trade complete... wohoo');
					});
				} else {
					throw 'Server contract seems to be invalid';
				}
			});
		})
		.then(refreshTokenDetails)
		.catch(console.error);
	};

	$("#submit").click(function() {
		console.log('Trading contract tokens');
		// makeExchangeTrade();
		setAllowanceForAllAddresses(constants.zrx_address);
		let ethBal = $('#balance_weth').text();
		let zrxBal = $('#balance_zrx').text();
		let ethPrice = 609.15
		let zrxPrice = 1.28
		$('#balance_weth').text(ethBal / 2);
		$('#balance_zrx').text( ((ethBal /2) * ethPrice) / zrxPrice);

		$('#weighted_weth').text('50%')
		$('#weighted_zrx').text('50%')
		
		console.log('After exchange trade');
	});

	$("#allow_ZRX").on('change', function() {
		console.log('Setting for ZRX token');
		setAllowanceForAllAddresses(constants.zrx_address);
		console.log('After setting for ZRX token');
	});

	$("#allow_WETH").on('change', function() {
		console.log('Setting for WETH token');
		setAllowanceForAllAddresses(constants.weth_address);
		console.log('After setting for WETH token');
	});

	$("#approve_transfer").on('change', function() {
		console.log('Before approve ETH');
		allowWrappedEtherForSmartContract();
		console.log('After approve ETH');
	});

	$("#transfer_weth_to_contract").click(function() {
		console.log('Before Transferring WETH to contract');
		transferWETHToContract('0.1');
		console.log('After Transferring WETH to contract');
	});

	$("#withdraw").click(function () {
		withdrawAllTokens();
	});

	$("#calc_weights").click(function(){
		calculateWts(609.15, 1.28);
	});

	$("#search-button").click(function(){
		let address = $("#address-field").val();
		console.log(address === contractAddress)
		if (address === contractAddress){
			displayFlag = true;
		}
		refreshTokenDetails();
	});
	
}

$(document).ready(app);
