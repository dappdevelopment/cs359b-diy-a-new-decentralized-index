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
var assert_1 = require("@0xproject/assert");
var json_schemas_1 = require("@0xproject/json-schemas");
require("isomorphic-fetch");
var _ = require("lodash");
var queryString = require("query-string");
var schemas_1 = require("./schemas/schemas");
var types_1 = require("./types");
var relayer_response_json_parsers_1 = require("./utils/relayer_response_json_parsers");
var TRAILING_SLASHES_REGEX = /\/+$/;
var DEFAULT_PAGED_REQUEST_OPTS = {
    page: 1,
    perPage: 100,
};
/**
 * This mapping defines how an option property name gets converted into an HTTP request query field
 */
var OPTS_TO_QUERY_FIELD_MAP = {
    perPage: 'per_page',
};
/**
 * This class includes all the functionality related to interacting with a set of HTTP endpoints
 * that implement the standard relayer API v0
 */
var HttpClient = /** @class */ (function () {
    /**
     * Instantiates a new HttpClient instance
     * @param   url    The relayer API base HTTP url you would like to interact with
     * @return  An instance of HttpClient
     */
    function HttpClient(url) {
        assert_1.assert.isWebUri('url', url);
        this._apiEndpointUrl = url.replace(TRAILING_SLASHES_REGEX, ''); // remove trailing slashes
    }
    /**
     * Format parameters to be appended to http requests into query string form
     */
    HttpClient._buildQueryStringFromHttpParams = function (params) {
        // if params are undefined or empty, return an empty string
        if (_.isUndefined(params) || _.isEmpty(params)) {
            return '';
        }
        // format params into a form the api expects
        var formattedParams = _.mapKeys(params, function (value, key) {
            return _.get(OPTS_TO_QUERY_FIELD_MAP, key, key);
        });
        // stringify the formatted object
        var stringifiedParams = queryString.stringify(formattedParams);
        return "?" + stringifiedParams;
    };
    /**
     * Retrieve token pair info from the API
     * @param   requestOpts     Options specifying token information to retrieve and page information, defaults to { page: 1, perPage: 100 }
     * @return  The resulting TokenPairsItems that match the request
     */
    HttpClient.prototype.getTokenPairsAsync = function (requestOpts) {
        return __awaiter(this, void 0, void 0, function () {
            var httpRequestOpts, responseJson, tokenPairs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!_.isUndefined(requestOpts)) {
                            assert_1.assert.doesConformToSchema('requestOpts', requestOpts, schemas_1.schemas.tokenPairsRequestOptsSchema);
                            assert_1.assert.doesConformToSchema('requestOpts', requestOpts, schemas_1.schemas.pagedRequestOptsSchema);
                        }
                        httpRequestOpts = {
                            params: _.defaults({}, requestOpts, DEFAULT_PAGED_REQUEST_OPTS),
                        };
                        return [4 /*yield*/, this._requestAsync('/token_pairs', types_1.HttpRequestType.Get, httpRequestOpts)];
                    case 1:
                        responseJson = _a.sent();
                        tokenPairs = relayer_response_json_parsers_1.relayerResponseJsonParsers.parseTokenPairsJson(responseJson);
                        return [2 /*return*/, tokenPairs];
                }
            });
        });
    };
    /**
     * Retrieve orders from the API
     * @param   requestOpts     Options specifying orders to retrieve and page information, defaults to { page: 1, perPage: 100 }
     * @return  The resulting SignedOrders that match the request
     */
    HttpClient.prototype.getOrdersAsync = function (requestOpts) {
        return __awaiter(this, void 0, void 0, function () {
            var httpRequestOpts, responseJson, orders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!_.isUndefined(requestOpts)) {
                            assert_1.assert.doesConformToSchema('requestOpts', requestOpts, schemas_1.schemas.ordersRequestOptsSchema);
                            assert_1.assert.doesConformToSchema('requestOpts', requestOpts, schemas_1.schemas.pagedRequestOptsSchema);
                        }
                        httpRequestOpts = {
                            params: _.defaults({}, requestOpts, DEFAULT_PAGED_REQUEST_OPTS),
                        };
                        return [4 /*yield*/, this._requestAsync("/orders", types_1.HttpRequestType.Get, httpRequestOpts)];
                    case 1:
                        responseJson = _a.sent();
                        orders = relayer_response_json_parsers_1.relayerResponseJsonParsers.parseOrdersJson(responseJson);
                        return [2 /*return*/, orders];
                }
            });
        });
    };
    /**
     * Retrieve a specific order from the API
     * @param   orderHash     An orderHash generated from the desired order
     * @return  The SignedOrder that matches the supplied orderHash
     */
    HttpClient.prototype.getOrderAsync = function (orderHash) {
        return __awaiter(this, void 0, void 0, function () {
            var responseJson, order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('orderHash', orderHash, json_schemas_1.schemas.orderHashSchema);
                        return [4 /*yield*/, this._requestAsync("/order/" + orderHash, types_1.HttpRequestType.Get)];
                    case 1:
                        responseJson = _a.sent();
                        order = relayer_response_json_parsers_1.relayerResponseJsonParsers.parseOrderJson(responseJson);
                        return [2 /*return*/, order];
                }
            });
        });
    };
    /**
     * Retrieve an orderbook from the API
     * @param   request         An OrderbookRequest instance describing the specific orderbook to retrieve
     * @param   requestOpts     Options specifying page information, defaults to { page: 1, perPage: 100 }
     * @return  The resulting OrderbookResponse that matches the request
     */
    HttpClient.prototype.getOrderbookAsync = function (request, requestOpts) {
        return __awaiter(this, void 0, void 0, function () {
            var httpRequestOpts, responseJson, orderbook;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('request', request, schemas_1.schemas.orderBookRequestSchema);
                        if (!_.isUndefined(requestOpts)) {
                            assert_1.assert.doesConformToSchema('requestOpts', requestOpts, schemas_1.schemas.pagedRequestOptsSchema);
                        }
                        httpRequestOpts = {
                            params: _.defaults({}, request, requestOpts, DEFAULT_PAGED_REQUEST_OPTS),
                        };
                        return [4 /*yield*/, this._requestAsync('/orderbook', types_1.HttpRequestType.Get, httpRequestOpts)];
                    case 1:
                        responseJson = _a.sent();
                        orderbook = relayer_response_json_parsers_1.relayerResponseJsonParsers.parseOrderbookResponseJson(responseJson);
                        return [2 /*return*/, orderbook];
                }
            });
        });
    };
    /**
     * Retrieve fee information from the API
     * @param   request     A FeesRequest instance describing the specific fees to retrieve
     * @return  The resulting FeesResponse that matches the request
     */
    HttpClient.prototype.getFeesAsync = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var httpRequestOpts, responseJson, fees;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('request', request, schemas_1.schemas.feesRequestSchema);
                        httpRequestOpts = {
                            payload: request,
                        };
                        return [4 /*yield*/, this._requestAsync('/fees', types_1.HttpRequestType.Post, httpRequestOpts)];
                    case 1:
                        responseJson = _a.sent();
                        fees = relayer_response_json_parsers_1.relayerResponseJsonParsers.parseFeesResponseJson(responseJson);
                        return [2 /*return*/, fees];
                }
            });
        });
    };
    /**
     * Submit a signed order to the API
     * @param   signedOrder     A SignedOrder instance to submit
     */
    HttpClient.prototype.submitOrderAsync = function (signedOrder) {
        return __awaiter(this, void 0, void 0, function () {
            var requestOpts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.doesConformToSchema('signedOrder', signedOrder, json_schemas_1.schemas.signedOrderSchema);
                        requestOpts = {
                            payload: signedOrder,
                        };
                        return [4 /*yield*/, this._requestAsync('/order', types_1.HttpRequestType.Post, requestOpts)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HttpClient.prototype._requestAsync = function (path, requestType, requestOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var params, payload, query, url, headers, response, text, errorString, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = _.get(requestOptions, 'params');
                        payload = _.get(requestOptions, 'payload');
                        query = HttpClient._buildQueryStringFromHttpParams(params);
                        url = "" + this._apiEndpointUrl + path + query;
                        headers = new Headers({
                            'content-type': 'application/json',
                        });
                        return [4 /*yield*/, fetch(url, {
                                method: requestType,
                                body: JSON.stringify(payload),
                                headers: headers,
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        text = _a.sent();
                        if (!response.ok) {
                            errorString = response.status + " - " + response.statusText + "\n" + requestType + " " + url + "\n" + text;
                            throw Error(errorString);
                        }
                        result = !_.isEmpty(text) ? JSON.parse(text) : undefined;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return HttpClient;
}());
exports.HttpClient = HttpClient;
//# sourceMappingURL=http_client.js.map