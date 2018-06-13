import { SignedOrder } from '@0xproject/types';
import 'isomorphic-fetch';
import { Client, FeesRequest, FeesResponse, OrderbookRequest, OrderbookResponse, OrdersRequestOpts, PagedRequestOpts, TokenPairsItem, TokenPairsRequestOpts } from './types';
/**
 * This class includes all the functionality related to interacting with a set of HTTP endpoints
 * that implement the standard relayer API v0
 */
export declare class HttpClient implements Client {
    private _apiEndpointUrl;
    /**
     * Format parameters to be appended to http requests into query string form
     */
    private static _buildQueryStringFromHttpParams(params?);
    /**
     * Instantiates a new HttpClient instance
     * @param   url    The relayer API base HTTP url you would like to interact with
     * @return  An instance of HttpClient
     */
    constructor(url: string);
    /**
     * Retrieve token pair info from the API
     * @param   requestOpts     Options specifying token information to retrieve and page information, defaults to { page: 1, perPage: 100 }
     * @return  The resulting TokenPairsItems that match the request
     */
    getTokenPairsAsync(requestOpts?: TokenPairsRequestOpts & PagedRequestOpts): Promise<TokenPairsItem[]>;
    /**
     * Retrieve orders from the API
     * @param   requestOpts     Options specifying orders to retrieve and page information, defaults to { page: 1, perPage: 100 }
     * @return  The resulting SignedOrders that match the request
     */
    getOrdersAsync(requestOpts?: OrdersRequestOpts & PagedRequestOpts): Promise<SignedOrder[]>;
    /**
     * Retrieve a specific order from the API
     * @param   orderHash     An orderHash generated from the desired order
     * @return  The SignedOrder that matches the supplied orderHash
     */
    getOrderAsync(orderHash: string): Promise<SignedOrder>;
    /**
     * Retrieve an orderbook from the API
     * @param   request         An OrderbookRequest instance describing the specific orderbook to retrieve
     * @param   requestOpts     Options specifying page information, defaults to { page: 1, perPage: 100 }
     * @return  The resulting OrderbookResponse that matches the request
     */
    getOrderbookAsync(request: OrderbookRequest, requestOpts?: PagedRequestOpts): Promise<OrderbookResponse>;
    /**
     * Retrieve fee information from the API
     * @param   request     A FeesRequest instance describing the specific fees to retrieve
     * @return  The resulting FeesResponse that matches the request
     */
    getFeesAsync(request: FeesRequest): Promise<FeesResponse>;
    /**
     * Submit a signed order to the API
     * @param   signedOrder     A SignedOrder instance to submit
     */
    submitOrderAsync(signedOrder: SignedOrder): Promise<void>;
    private _requestAsync(path, requestType, requestOptions?);
}
