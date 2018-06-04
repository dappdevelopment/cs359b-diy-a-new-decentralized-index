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
import * as $ from "jquery";

export class RadarRelay {
	private _window: Window;
	private INFURA_API_URL: string; 
	private zeroExConfig: ZeroExConfig;
	private relayerApiUrl: string;
	private orderbookRequest: OrderbookRequest;
	public orderbookResponse: OrderbookResponse;
	public best_bid: Order;
	public best_ask: Order;
	private run_init: boolean;

	constructor() {
		this.INFURA_API_URL = "https://kovan.infura.io/rdkuEWbeKAjSR9jZ6P1h";
		this.relayerApiUrl = 'https://api.kovan.radarrelay.com/0x/v0/';
		this.zeroExConfig = {
				networkId: 42
    };
		this.run_init = false;
	}

  public async init() {
		const provider = new Web3.providers.HttpProvider(this.INFURA_API_URL);
		const zeroEx = new ZeroEx(provider, this.zeroExConfig);
    const relayerClient = new HttpClient(this.relayerApiUrl);

    // Get exchange contract address
    const EXCHANGE_ADDRESS = await zeroEx.exchange.getContractAddress();
		console.log('Exchange address = ' + EXCHANGE_ADDRESS);

    // Get token information
    const wethTokenInfo = await zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync('WETH');
    const zrxTokenInfo = await zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync('ZRX');

		if (wethTokenInfo === undefined || zrxTokenInfo === undefined) {
        throw new Error('could not find token info');
    }

    // Get token contract addresses
    const WETH_ADDRESS = wethTokenInfo.address;
    const ZRX_ADDRESS = zrxTokenInfo.address;

		console.log('weth token info = ' + wethTokenInfo.address + ' and zrx token info = ' + zrxTokenInfo.address);

		 this.orderbookRequest = {
        baseTokenAddress: ZRX_ADDRESS,
        quoteTokenAddress: WETH_ADDRESS,
    };

		// Send orderbook request to relayer and receive an OrderbookResponse instance
    this.orderbookResponse = await relayerClient.getOrderbookAsync(this.orderbookRequest);
		this.run_init = true;
	}

  public async get_radar_relay_orders() {
    // Instantiate 0x.js instance
    // Check if either getTokenBySymbolIfExistsAsync query resulted in undefined
	  // Generate orderbook request for ZRX/WETH pair
   
    // Because we are looking to exchange our ZRX for WETH, we get the bids side of the order book
    // Sort them with the best rate first
		if (!(this.run_init)) {
			await this.init();
		}

    const sortedBids = this.orderbookResponse.bids.sort((orderA, orderB) => {
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
    const sortedAsks = this.orderbookResponse.asks.sort((orderA, orderB) => {
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
		this.best_bid = sortedBids[0];
		console.log(sortedBids[0]);

		console.log('Sorted asks = ');
		this.best_ask = sortedAsks[0];
		console.log(sortedAsks[0]);
  }

	public async get_best_bid(): Promise<Order> {
		if (!(this.run_init)) {
			await this.init();
		};

		return this.best_bid;
	}

	public async get_best_ask(): Promise<Order> {
		if (!(this.run_init)) {
			await this.init();
		};

		return this.best_ask;
	}

	public async get_order_book(): Promise<OrderbookResponse> {
		if (!(this.run_init)) {
			await this.init();
		};

		return this.orderbookResponse;
	}

}
