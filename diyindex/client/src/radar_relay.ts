import {
    ZeroEx,
    ZeroExConfig,
} from '0x.js';
import {
    FeesRequest,
    FeesResponse,
    HttpClient,
    Order,
    OrderbookRequest,
    OrderbookResponse,
    SignedOrder,
} from '@0xproject/connect';
import { BigNumber } from '@0xproject/utils';
import * as Web3 from 'web3';

export class RadarRelay {
  constructor() {}

  public async init() {}

  public async get_radar_relay_orders() {
    // Provider pointing to local TestRPC on default port 8545
    // const provider = new Web3.providers.HttpProvider('http://localhost:8545');
		const INFURA_API_URL: string = "https://mainnet.infura.io/rdkuEWbeKAjSR9jZ6P1h";
		// const INFURA_API_URL: string = 'https://kovan.infura.io/';
    const provider = new Web3.providers.HttpProvider(INFURA_API_URL);

  //		const Accounts = require('web3-eth-accounts');
  //		var accounts = new Accounts(INFURA_API_URL);
  //		console.log('accounts = ' + accounts);
  //		// Creating a new Account
  //		var web3=new Web3(provider);
  //		const privatekey: string = '0x528d53be9f33de80d68b148aac930b9ab757d798ef251bcbdcfd94b95961144a';
  //    var logAcc = web3.eth.accounts.privateKeyToAccount(privatekey);
  //    console.log(logAcc);

    // Instantiate 0x.js instance
    const zeroExConfig: ZeroExConfig = {
        // networkId: 50, // testrpc
				networkId: 1
    };
    const zeroEx = new ZeroEx(provider, zeroExConfig);

    // Instantiate relayer client pointing to a local server on port 3000
    const relayerApiUrl = 'https://api.radarrelay.com/0x/v0/';
    // const relayerApiUrl = 'http://localhost:3000/v0';
    const relayerClient = new HttpClient(relayerApiUrl);

    // Get exchange contract address
    const EXCHANGE_ADDRESS = await zeroEx.exchange.getContractAddress();
		console.log('Exchange address = ' + EXCHANGE_ADDRESS);

    // Get token information
    const wethTokenInfo = await zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync('WETH');
    const zrxTokenInfo = await zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync('ZRX');

    // Check if either getTokenBySymbolIfExistsAsync query resulted in undefined
    if (wethTokenInfo === undefined || zrxTokenInfo === undefined) {
        throw new Error('could not find token info');
    }

    // Get token contract addresses
    const WETH_ADDRESS = wethTokenInfo.address;
    const ZRX_ADDRESS = zrxTokenInfo.address;

		console.log('weth token info = ' + wethTokenInfo.address + ' and zrx token info = ' + zrxTokenInfo.address);

    // Generate orderbook request for ZRX/WETH pair
    const orderbookRequest: OrderbookRequest = {
        baseTokenAddress: ZRX_ADDRESS,
        quoteTokenAddress: WETH_ADDRESS,
    };

    // Send orderbook request to relayer and receive an OrderbookResponse instance
    const orderbookResponse: OrderbookResponse = await relayerClient.getOrderbookAsync(orderbookRequest);

    // Because we are looking to exchange our ZRX for WETH, we get the bids side of the order book
    // Sort them with the best rate first
    const sortedBids = orderbookResponse.bids.sort((orderA, orderB) => {
        const orderRateA = (new BigNumber(orderA.makerTokenAmount)).div(new BigNumber(orderA.takerTokenAmount));
        const orderRateB = (new BigNumber(orderB.makerTokenAmount)).div(new BigNumber(orderB.takerTokenAmount));
        return orderRateB.comparedTo(orderRateA);
    });

    // Calculate and print out the WETH/ZRX exchange rates
    const bid_rates = sortedBids.map(order => {
        const rate = (new BigNumber(order.makerTokenAmount)).div(new BigNumber(order.takerTokenAmount));
        return (rate.toString() + ' WETH/ZRX');
    });
    console.log(bid_rates);

    // Sort them with the best rate first
    const sortedAsks = orderbookResponse.asks.sort((orderA, orderB) => {
        const orderRateA = (new BigNumber(orderA.makerTokenAmount)).div(new BigNumber(orderA.takerTokenAmount));
        const orderRateB = (new BigNumber(orderB.makerTokenAmount)).div(new BigNumber(orderB.takerTokenAmount));
        return orderRateB.comparedTo(orderRateA);
    });

    // Calculate and print out the WETH/ZRX exchange rates
    const ask_rates = sortedAsks.map(order => {
        const rate = (new BigNumber(order.takerTokenAmount)).div(new BigNumber(order.makerTokenAmount));
        return (rate.toString() + ' WETH/ZRX');
    });
    console.log(ask_rates);
    
		console.log('Sorted bids = ');
		console.log(sortedBids[0]);

		console.log('Sorted asks = ');
		console.log(sortedAsks[0]);
  }
}
