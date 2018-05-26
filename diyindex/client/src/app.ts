// import * as bootstrap from 'bootstrap';

import * as Web3 from 'web3';
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

/*** MVC ***/
let radar_relay = new RadarRelay.RadarRelay();
radar_relay.get_radar_relay_orders().catch(console.error);

let create_order = new CreateOrder.CreateOrder();
create_order.create_and_fill_order();
