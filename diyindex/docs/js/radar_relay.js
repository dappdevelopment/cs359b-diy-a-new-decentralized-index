"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _0x_js_1 = require("0x.js");
var connect_1 = require("@0xproject/connect");
var utils_1 = require("@0xproject/utils");
var Web3 = require("web3");
var RadarRelay = /** @class */ (function () {
    function RadarRelay() {
        this.INFURA_API_URL = "https://kovan.infura.io/rdkuEWbeKAjSR9jZ6P1h";
        this.relayerApiUrl = 'https://api.kovan.radarrelay.com/0x/v0/';
        this.zeroExConfig = {
            networkId: 42
        };
        this.run_init = false;
    }
    RadarRelay.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var provider, zeroEx, relayerClient, EXCHANGE_ADDRESS, wethTokenInfo, zrxTokenInfo, WETH_ADDRESS, ZRX_ADDRESS, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        provider = new Web3.providers.HttpProvider(this.INFURA_API_URL);
                        zeroEx = new _0x_js_1.ZeroEx(provider, this.zeroExConfig);
                        relayerClient = new connect_1.HttpClient(this.relayerApiUrl);
                        return [4 /*yield*/, zeroEx.exchange.getContractAddress()];
                    case 1:
                        EXCHANGE_ADDRESS = _b.sent();
                        console.log('Exchange address = ' + EXCHANGE_ADDRESS);
                        return [4 /*yield*/, zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync('WETH')];
                    case 2:
                        wethTokenInfo = _b.sent();
                        return [4 /*yield*/, zeroEx.tokenRegistry.getTokenBySymbolIfExistsAsync('ZRX')];
                    case 3:
                        zrxTokenInfo = _b.sent();
                        if (wethTokenInfo === undefined || zrxTokenInfo === undefined) {
                            throw new Error('could not find token info');
                        }
                        WETH_ADDRESS = wethTokenInfo.address;
                        ZRX_ADDRESS = zrxTokenInfo.address;
                        console.log('weth token info = ' + wethTokenInfo.address + ' and zrx token info = ' + zrxTokenInfo.address);
                        this.orderbookRequest = {
                            baseTokenAddress: ZRX_ADDRESS,
                            quoteTokenAddress: WETH_ADDRESS,
                        };
                        // Send orderbook request to relayer and receive an OrderbookResponse instance
                        _a = this;
                        return [4 /*yield*/, relayerClient.getOrderbookAsync(this.orderbookRequest)];
                    case 4:
                        // Send orderbook request to relayer and receive an OrderbookResponse instance
                        _a.orderbookResponse = _b.sent();
                        this.run_init = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    RadarRelay.prototype.get_radar_relay_orders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sortedBids, bid_rates, sortedAsks, ask_rates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!(this.run_init)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        sortedBids = this.orderbookResponse.bids.sort(function (orderA, orderB) {
                            var orderRateA = (new utils_1.BigNumber(orderA.makerTokenAmount)).div(new utils_1.BigNumber(orderA.takerTokenAmount));
                            var orderRateB = (new utils_1.BigNumber(orderB.makerTokenAmount)).div(new utils_1.BigNumber(orderB.takerTokenAmount));
                            return orderRateB.comparedTo(orderRateA);
                        });
                        bid_rates = sortedBids.map(function (order) {
                            var rate = (new utils_1.BigNumber(order.makerTokenAmount)).div(new utils_1.BigNumber(order.takerTokenAmount));
                            return (rate.toString() + ' WETH/ZRX');
                        });
                        console.log(bid_rates);
                        sortedAsks = this.orderbookResponse.asks.sort(function (orderA, orderB) {
                            var orderRateA = (new utils_1.BigNumber(orderA.makerTokenAmount)).div(new utils_1.BigNumber(orderA.takerTokenAmount));
                            var orderRateB = (new utils_1.BigNumber(orderB.makerTokenAmount)).div(new utils_1.BigNumber(orderB.takerTokenAmount));
                            return orderRateB.comparedTo(orderRateA);
                        });
                        ask_rates = sortedAsks.map(function (order) {
                            var rate = (new utils_1.BigNumber(order.takerTokenAmount)).div(new utils_1.BigNumber(order.makerTokenAmount));
                            return (rate.toString() + ' WETH/ZRX');
                        });
                        console.log(ask_rates);
                        console.log('Sorted bids = ');
                        this.best_bid = sortedBids[0];
                        console.log(sortedBids[0]);
                        console.log('Sorted asks = ');
                        this.best_ask = sortedAsks[0];
                        console.log(sortedAsks[0]);
                        return [2 /*return*/];
                }
            });
        });
    };
    RadarRelay.prototype.get_best_bid = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!(this.run_init)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        ;
                        return [2 /*return*/, this.best_bid];
                }
            });
        });
    };
    RadarRelay.prototype.get_best_ask = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!(this.run_init)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        ;
                        return [2 /*return*/, this.best_ask];
                }
            });
        });
    };
    RadarRelay.prototype.get_order_book = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!(this.run_init)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        ;
                        return [2 /*return*/, this.orderbookResponse];
                }
            });
        });
    };
    return RadarRelay;
}());
exports.RadarRelay = RadarRelay;
//# sourceMappingURL=radar_relay.js.map