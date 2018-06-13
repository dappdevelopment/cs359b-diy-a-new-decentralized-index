// var constants = window.Constants;
// var bignumber = require('bignumber.js');
function app() {
	var constants = window.Constants;

	if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
	web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider
	// if (!( web3 === undefined || web3.eth.net.currentProvider.isMetaMask === true)){
	// 	alert("Please connect to Kovan using Parity");
	// 	// disable buttons
	// }
	console.log("Using web3 version: " + Web3.version);
	console.log("Is metamask the provider = " + window.web3.currentProvider.isMetaMask);
	console.log("Constructor name = " + window.web3.currentProvider.constructor.name);
	console.log("Type of web3 = " + typeof web3);
	window.MAX_UINT = web3.utils.toBN("115792089237316195423570985008687907853269984665640564039457584007913129639935");

	var contractFactory;
	var contract;
	var contractAddress;
	var newContractAddress;

	var userAccount;
	var WETH_Token;
	var ZRX_Token;

	var diyindexAccount;
	var contractABI;
	var displayFlag = false;

	// var contractDataPromise = $.getJSON('Marketdata.json');
	// var contractDataPromise = $.getJSON('build/contracts/IndexContract.json');
	var contractFactoryDataPromise = $.getJSON('build/contracts/IndexContractFactory.json');
	console.log("Web3.eth.net = " + web3.eth.net);
	if (typeof web3.eth.net === 'undefined') {
			throw new Error("Parity signer is not available.");
	};

	// Any scope
	var networkIdPromise = web3.eth.net.getId(); // resolves on the current network id
	var accountsPromise = web3.eth.getAccounts(); // resolves on an array of accounts
  
	Promise.all([contractFactoryDataPromise, networkIdPromise, accountsPromise])
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

		if (networkId !== 42) {
			throw new Error("Please connect to Kovan.");
		}
		// shoot warning that we're live on kovan
	
		console.log('Before contractData');
		// if deployed on server 
		// var contractAddress = constants.deploy_to_server_address
		var contractAddress = contractData.networks[networkId].address;
		console.log('ContractFactoryAddress = ' + contractAddress);
		contractFactory = new web3.eth.Contract(contractData.abi, contractAddress);
		WETH_Token = new web3.eth.Contract(constants.weth_abi, constants.weth_address);
		ZRX_Token = new web3.eth.Contract(constants.zrx_abi, constants.zrx_address);
		window.EXCHANGE = new web3.eth.Contract(constants.exchange_abi, constants.exchange_address);
		window.contractFactory = contractFactory;
	})
	.catch(console.error);

	function getBestAskAndBids(){
		var request = new XMLHttpRequest();
		request.addEventListener('load', function(){
			if (request.status === 200) {
				let bestBidAndAsk = request.responseText;
				bestBidAndAsk = JSON.parse(bestBidAndAsk)
				// console.log(bestBidAndAsk)
				window.best_ask_price = bestBidAndAsk[0]
				window.best_bid_price = bestBidAndAsk[1]
				window.best_ask = bestBidAndAsk[2]
				window.best_bid = bestBidAndAsk[3]
				var bbid_val = Number(window.best_bid_price).toFixed(4)
				var bask_val = Number(window.best_ask_price).toFixed(4)
				$('#bestBid').text(bbid_val + " WETH/ZRX");	
				$('#bestAsk').text(bask_val + " WETH/ZRX");
			}
		})
		request.open('GET', '/getHttpClient', true)
		request.send();
	}

	function allowWrappedEtherForSmartContract() {
		console.log("Contract Address and User account: " +  contractAddress +  "  " + userAccount)
		console.log('Inside Allow Wrapped Ether Transfer to Smart Contract');
		WETH_Token.methods.approve(contractAddress, window.MAX_UINT).send({from: userAccount}).then(function (result) {
			if (result) {
				console.log('Result = ' + result);
				console.log('Provided ' + contractAddress + ' appropriate permissions for account = ' + userAccount);
			};
		})
    .then(refreshTokenDetails)
    .catch(console.error);
	};

	function get_latest_contract_address(){
		console.log('Inside get latest contract address');
		contractFactory.methods.get_index_contracts().call().then(function (lst){
			window.all_deployed_contracts = lst;
			window.last_deployed_contract = lst[-1];
		});
	}

	function transferWETHToContract(amount) {
		console.log("weth Contract address and user acct:" + contractAddress + " " + userAccount)
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
		console.log("all allowances Contract address and user acct:" + contractAddress + " " + userAccount)
		console.log('Inside method setAllowance');
		contract.methods.set_allowances(tokenAddress).send({from: userAccount})
		.then(function x() {
			console.log('After setting allowance');
		})
    	.then(refreshTokenDetails)	
		.catch(console.error);
	};

  function refreshTokenDetails() {
	// if (displayFlag === true){
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
		getBestAskAndBids();
	// }
  }

  function display_weth_balance(){
			WETH_Token.methods.balanceOf(contractAddress).call().then(function (weth_balance) {
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
		// var balance_weth = quantities[0] / 1000000000000000000;
		// var balance_zrx = quantities[1] / 1000000000000000000;	

		var balance_weth = web3.utils.fromWei(quantities[0], 'ether');
		var balance_zrx = web3.utils.fromWei(quantities[1], 'ether');
		// console.log(balance_weth2, balance_zrx2)
		$('#balance_weth').text(balance_weth);
		$('#balance_zrx').text(balance_zrx);
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

  function getLastRebalanced() {
    contract.methods.get_last_rebalanced().call().then(function (last_rebalanced) {
			$('#last_rebalanced').text(last_rebalanced);
		})
		.catch(console.error);
  };

  function getRebalanceInBlocks() {
    contract.methods.rebalance_in_blocks().call().then(function (rebalance_in_blocks) {
			if (rebalance_in_blocks){
				$('#rebalance_in_blocks').text(rebalance_in_blocks);
			} else { 
				$('#rebalance_in_blocks').text("N/A");
			}
			

		})
		.catch(console.error);
  };

	function getContractApprovalWETH() {
		WETH_Token.methods.allowance(userAccount, contractAddress).call().then(function (allowance) {
			$('#contract_approval_WETH').text("WETH:contract on owner = " + allowance);
			console.log("WETH:contract on owner = " + allowance)
		})
		.catch(console.error);
	}

	function deploy_contract(addresses, quantities, rebalanceInBlocks) {
		var proxyAddress = '0x087eed4bc1ee3de49befbd66c662b434b15d49d4';
		var exchangeAddress = '0x90fe2af704b34e0224bf2299c838e04d4dcf1364';
		var WETH_address = '0xd0a1e359811322d97991e03f863a0c30c2cf029c';
		var diyindex = '0x2BE71CE2a9bF92AA830f8926651c90A977f68a1A'; // account 2 that DIYIndex Controls
		console.log('In deploy index method');
		contractFactory.methods.new_index_contract(addresses, quantities, rebalanceInBlocks, proxyAddress, exchangeAddress, WETH_address, diyindex).send({from: userAccount, gas: 5940000}).then(function (deployedContractAddress) {
			console.log('Deployed new contract at = ' + deployedContractAddress);
			window.deployedContract = deployedContractAddress;
			window.transactionHash = deployedContractAddress.transactionHash;
			})
			.then(function(x) {
				contractFactory.methods.get_index_contract_count().call().then(function (x) {
					if (window.currentNumContracts >= x) {
						throw Error ('Contract address not found, please confirm deployment');
					}
					window.currentNumContracts = x;
				})
			})
			.then(function(x) {
				contractFactory.methods.get_index_contracts().call().then(function (x) {
					newContractAddress = x[window.currentNumContracts - 1];
					update_contract(newContractAddress)	
				})
			})
			.then(function(x) {
				// $('#loading').delay(18000).hide(400);
				alert("Loading, please wait a few seconds to pull up contract data then click Contract-Tab");
				setTimeout(function(){}, 9000)
				document.querySelector('#address-field').value = contractAddress;
				setTimeout(refreshTokenDetails, 9000)
			})
			.catch(console.error);
	  };

	function update_contract(contract_address) {
		console.log('Deployed new contract at address = ' + contract_address);
		var indexContractDataPromise = $.getJSON('build/contracts/IndexContract.json');
		
		Promise.all([indexContractDataPromise]).then(function initApp(results) {
			var contractData = results[0];
			contractAddress = contract_address;
			console.log('Index contract address = ' + contractAddress);
			contract = new web3.eth.Contract(contractData.abi, contractAddress);
			// contract.options.address = contractAddress;
			console.log('Setup contract');
			window.contractAbi = contractABI;
			// window.index_contract = contract;
			// window.index_contract_address = contract_address;
			document.querySelector('#address-field').value = contractAddress;
		});
	};

	function getOwnerApprovalContractWETH() {
    	WETH_Token.methods.allowance(contractAddress, userAccount).call().then(function (allowance) {
			$('#owner_approval_contract_WETH').text("WETH:owner on contract = " + allowance);
			console.log("WETH:owner on contract = " + allowance)
		})
		.catch(console.error);
  };

	function getOwnerApprovalContractZRX() {
		ZRX_Token.methods.allowance(contractAddress, userAccount).call().then(function (allowance) {
			$('#owner_approval_contract_ZRX').text("ZRX:owner on contract = " + allowance);
			console.log("ZRX:owner on contract = " + allowance)
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

	function makeExchangeTrade(order, takerQuantity) {
		console.log('Best bid = ' + order);
		const maker = order['maker'];
		const taker = order['taker'];
		const makerToken = order['makerTokenAddress'];
		const takerToken = order['takerTokenAddress'];
		const feeRecipient = order['feeRecipient'];
		const makerTokenAmount = order['makerTokenAmount'];
		const takerTokenAmount = order['takerTokenAmount'];
		const makerFee = order['makerFee'];
		const takerFee = order['takerFee'];
		const expirationTimestampInSec = order['expirationUnixTimestampSec'];
		const salt = order['salt'];
		const v = order['ecSignature']['v'];
		const r = order['ecSignature']['r'];
		const s = order['ecSignature']['s'];
		const fillTakerTokenAmount = Math.min(takerQuantity, takerTokenAmount);
	
		const addresses = [maker, taker, makerToken, takerToken, feeRecipient];
		const values = [makerTokenAmount, takerTokenAmount, makerFee, takerFee, expirationTimestampInSec, salt, fillTakerTokenAmount];
		window.EXCHANGE.methods.getOrderHash([maker, taker, makerToken, takerToken, feeRecipient], [makerTokenAmount, takerTokenAmount, makerFee, takerFee, expirationTimestampInSec, salt]).call().then(function (orderHash) {
			console.log('OrderHash = ' + orderHash);
			window.EXCHANGE.methods.isValidSignature(maker, orderHash, v, r, s).call().then(function (success) {
		if (success) {
					console.log('Contract is valid?' + success);
					contract.methods.make_exchange_trade(addresses, values, v, r, s).send({from: userAccount}).then(function () {
						console.log('Called makeExchangeTrade');
						console.log('Ideally follow the event log in Exchange contract to know of trade');
						console.log('Exchange trade complete... wohoo');
					});
				} else {
					throw 'Server contract seems to be invalid';
				}
			})
			.then(refreshTokenDetails);
			})
			.catch(console.error);
		};

	function calculateWts(weth_price, zrx_price){
		let balance_weth = $('#balance_weth').text()
		let balance_zrx = $('#balance_zrx').text()
		// let quantity_weth = $('#quantity_weth').text()
		// let quantity_zrx = $('#quantity_zrx').text()

		// quantity_weth = Number(quantity_weth.replace(/\W/g, ''));
		// quantity_zrx = Number(quantity_zrx.replace(/\W/g, ''));
	
		balance_weth = Number(balance_weth);
		balance_zrx =  Number(balance_zrx);
		
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

	$("#submit").click(function() {
		console.log('Trading contract tokens');
		// makeExchangeTrade();

		let balance_weth = $('#balance_weth').text()
		let balance_zrx = $('#balance_zrx').text()

		let curr_weth_wt = $('#weighted_weth').text()
		let curr_zrx_wt = $('#weighted_zrx').text()

		let quantity_weth = $('#quantity_weth').text()
		let quantity_zrx = $('#quantity_zrx').text()

		curr_weth_wt = Number(curr_weth_wt.slice(0, -1)).toFixed(2)
		curr_zrx_wt = Number(curr_zrx_wt.slice(0, -1)).toFixed(2)

		console.log(curr_weth_wt, curr_zrx_wt)

		if(curr_weth_wt === 0.00 && curr_zrx_wt === 0.00){
			alert("Please calculate current weights first.");
			return;
		}

		quantity_weth = Number(quantity_weth.replace(/\W/g, ''));
		quantity_zrx = Number(quantity_zrx.replace(/\W/g, ''));
	
		balance_weth = Number(balance_weth);
		balance_zrx =  Number(balance_zrx);

		weth_price = 1;
		zrx_price = window.best_ask_price;

		total = (balance_weth * weth_price ) + (balance_zrx * zrx_price)
		console.log(balance_weth , weth_price , balance_zrx , zrx_price)
		console.log(total)
		console.log(curr_weth_wt, quantity_weth);
		let diff = curr_weth_wt - quantity_weth;
		console.log(diff)
		if (diff > 0 ){
			// buy zrx

			let amt_to_spend = (diff/100) * total;

			// let zrx_to_buy = amt_to_spend / zrx_price;
			// web3.utils.toWei(zrx_to_buy, 'ether')
			// console.log()
			// web3.utils.toWei(String(zrx_to_buy), 'ether')
			// console.log(String(web3.utils.toWei(String(amt_to_spend), 'ether')));
			
			makeExchangeTrade(window.best_ask, web3.utils.toBN(String(web3.utils.toWei(String(amt_to_spend), 'ether'))));
			// makeExchangeTrade(window.best_ask, web3.utils.toBN(web3.utils.toWei(String(amt_to_spend), 'ether')));
		} else {
			// buy eth
			diff = Math.abs(diff)
			let amt_to_spend = (diff/100) * total;
			// console.log(web3.utils.toBN(String(web3.utils.toWei(String(amt_to_spend), 'ether'))))	;
			makeExchangeTrade(window.best_bid, web3.utils.toBN(String(web3.utils.toWei(String(amt_to_spend), 'ether'))));
		}

		
		$('#last_rebalanced').text(window.currentBlockHeight - 2)
		
		console.log('After exchange trade');
	});

	$("#allow_ZRX").on('change', function() {
		console.log('Setting for ZRX token');
		console.log("zrx address for allowances: ",constants.zrx_address)
		setAllowanceForAllAddresses(constants.zrx_address);
		console.log('After setting for ZRX token');
	});

	$("#allow_WETH").on('change', function() {
		console.log('Setting for WETH token');
		console.log("zrx address for allowances: ", constants.weth_address)
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
		transferWETHToContract('0.1'); //change this
		console.log('After Transferring WETH to contract');
	});

	$("#withdraw").click(function () {
		withdrawAllTokens();
	});

	$("#submit-btn").click(function(e){
		e.preventDefault();
		var percentSum = 0;
		var answer = {}
		answer["tokens"] = []

		var ethPercentage = document.querySelector('#ethField').value
		var zrxPercentage = document.querySelector('#zrxField').value
		percentSum += Number(ethPercentage)
		percentSum += Number(zrxPercentage)
		
		answer["tokens"].push({"token": "eth", "percentage" : ethPercentage})
		answer["tokens"].push({"token": "zrx", "percentage" : zrxPercentage})
		
		answer["rebalance"] = document.getElementById("rebalance").value

		if ( percentSum > 100){
			document.getElementById("total").value = "Err"
			percentSum = 0;
			alert("Please have your allocations sum to 100%.");
		} else {
			document.getElementById("total").value = percentSum;
		}

		
		contractFactory.methods.get_index_contract_count().call().then(
			function (x) {window.currentNumContracts = x;}
		);

		// deploy index code here
		var WETH_address = '0xd0a1e359811322d97991e03f863a0c30c2cf029c';
		var ZRX_address = '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570';
		var addresses = [WETH_address, ZRX_address];
		
		var quantities = [Number(ethPercentage), Number(zrxPercentage)];
		var rebalanceInBlocks = Number(answer["rebalance"]);

		console.log("Percentages being deployed: ", quantities);
		console.log("Rebalance every being deployed: ", rebalanceInBlocks);

		deploy_contract(addresses, quantities, rebalanceInBlocks);
	});

	$("#calc_weights").click(function(){
		zrx_price = window.best_ask_price;
		calculateWts(1, zrx_price);
	});

	$("#search-button").click(function(){
		alert("If nothing shows up, please click search a second time.")
		let address = $("#address-field").val();
		contractFactory.methods.get_index_contracts().call().then(function(list){
			// update_contract(address);
			if (!list.includes(address)){
				alert("Contract Address Not Found.");
			} else {
				update_contract(address);
			}
			
		}).then( function(){
				if(contract){
					refreshTokenDetails();
				}
			}
		);
	});
}

$(document).ready(app);
