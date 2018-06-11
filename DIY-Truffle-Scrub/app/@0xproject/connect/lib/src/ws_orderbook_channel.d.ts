import { OrderbookChannel, OrderbookChannelHandler, OrderbookChannelSubscriptionOpts, WebSocketOrderbookChannelConfig } from './types';
/**
 * This class includes all the functionality related to interacting with a websocket endpoint
 * that implements the standard relayer API v0
 */
export declare class WebSocketOrderbookChannel implements OrderbookChannel {
    private _apiEndpointUrl;
    private _client;
    private _connectionIfExists?;
    private _heartbeatTimerIfExists?;
    private _subscriptionCounter;
    private _heartbeatIntervalMs;
    /**
     * Instantiates a new WebSocketOrderbookChannel instance
     * @param   url                 The relayer API base WS url you would like to interact with
     * @param   config              The configuration object. Look up the type for the description.
     * @return  An instance of WebSocketOrderbookChannel
     */
    constructor(url: string, config?: WebSocketOrderbookChannelConfig);
    /**
     * Subscribe to orderbook snapshots and updates from the websocket
     * @param   subscriptionOpts     An OrderbookChannelSubscriptionOpts instance describing which
     *                               token pair to subscribe to
     * @param   handler              An OrderbookChannelHandler instance that responds to various
     *                               channel updates
     */
    subscribe(subscriptionOpts: OrderbookChannelSubscriptionOpts, handler: OrderbookChannelHandler): void;
    /**
     * Close the websocket and stop receiving updates
     */
    close(): void;
    private _getConnection(callback);
    private _handleWebSocketMessage(requestId, subscriptionOpts, message, handler);
}
