"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("@0xproject/assert");
var json_schemas_1 = require("@0xproject/json-schemas");
var _ = require("lodash");
var WebSocket = require("websocket");
var schemas_1 = require("./schemas/schemas");
var types_1 = require("./types");
var orderbook_channel_message_parser_1 = require("./utils/orderbook_channel_message_parser");
var DEFAULT_HEARTBEAT_INTERVAL_MS = 15000;
var MINIMUM_HEARTBEAT_INTERVAL_MS = 10;
/**
 * This class includes all the functionality related to interacting with a websocket endpoint
 * that implements the standard relayer API v0
 */
var WebSocketOrderbookChannel = /** @class */ (function () {
    /**
     * Instantiates a new WebSocketOrderbookChannel instance
     * @param   url                 The relayer API base WS url you would like to interact with
     * @param   config              The configuration object. Look up the type for the description.
     * @return  An instance of WebSocketOrderbookChannel
     */
    function WebSocketOrderbookChannel(url, config) {
        this._subscriptionCounter = 0;
        assert_1.assert.isUri('url', url);
        if (!_.isUndefined(config)) {
            assert_1.assert.doesConformToSchema('config', config, schemas_1.schemas.webSocketOrderbookChannelConfigSchema);
        }
        this._apiEndpointUrl = url;
        this._heartbeatIntervalMs =
            _.isUndefined(config) || _.isUndefined(config.heartbeatIntervalMs)
                ? DEFAULT_HEARTBEAT_INTERVAL_MS
                : config.heartbeatIntervalMs;
        this._client = new WebSocket.client();
    }
    /**
     * Subscribe to orderbook snapshots and updates from the websocket
     * @param   subscriptionOpts     An OrderbookChannelSubscriptionOpts instance describing which
     *                               token pair to subscribe to
     * @param   handler              An OrderbookChannelHandler instance that responds to various
     *                               channel updates
     */
    WebSocketOrderbookChannel.prototype.subscribe = function (subscriptionOpts, handler) {
        var _this = this;
        assert_1.assert.doesConformToSchema('subscriptionOpts', subscriptionOpts, json_schemas_1.schemas.relayerApiOrderbookChannelSubscribePayload);
        assert_1.assert.isFunction('handler.onSnapshot', _.get(handler, 'onSnapshot'));
        assert_1.assert.isFunction('handler.onUpdate', _.get(handler, 'onUpdate'));
        assert_1.assert.isFunction('handler.onError', _.get(handler, 'onError'));
        assert_1.assert.isFunction('handler.onClose', _.get(handler, 'onClose'));
        this._subscriptionCounter += 1;
        var subscribeMessage = {
            type: 'subscribe',
            channel: 'orderbook',
            requestId: this._subscriptionCounter,
            payload: subscriptionOpts,
        };
        this._getConnection(function (error, connection) {
            if (!_.isUndefined(error)) {
                handler.onError(_this, subscriptionOpts, error);
            }
            else if (!_.isUndefined(connection) && connection.connected) {
                connection.on(types_1.WebsocketConnectionEventType.Error, function (wsError) {
                    handler.onError(_this, subscriptionOpts, wsError);
                });
                connection.on(types_1.WebsocketConnectionEventType.Close, function (code, desc) {
                    handler.onClose(_this, subscriptionOpts);
                });
                connection.on(types_1.WebsocketConnectionEventType.Message, function (message) {
                    _this._handleWebSocketMessage(subscribeMessage.requestId, subscriptionOpts, message, handler);
                });
                connection.sendUTF(JSON.stringify(subscribeMessage));
            }
        });
    };
    /**
     * Close the websocket and stop receiving updates
     */
    WebSocketOrderbookChannel.prototype.close = function () {
        if (!_.isUndefined(this._connectionIfExists)) {
            this._connectionIfExists.close();
        }
        if (!_.isUndefined(this._heartbeatTimerIfExists)) {
            clearInterval(this._heartbeatTimerIfExists);
        }
    };
    WebSocketOrderbookChannel.prototype._getConnection = function (callback) {
        var _this = this;
        if (!_.isUndefined(this._connectionIfExists) && this._connectionIfExists.connected) {
            callback(undefined, this._connectionIfExists);
        }
        else {
            this._client.on(types_1.WebsocketClientEventType.Connect, function (connection) {
                _this._connectionIfExists = connection;
                if (_this._heartbeatIntervalMs >= MINIMUM_HEARTBEAT_INTERVAL_MS) {
                    _this._heartbeatTimerIfExists = setInterval(function () {
                        connection.ping('');
                    }, _this._heartbeatIntervalMs);
                }
                else {
                    callback(new Error("Heartbeat interval is " + _this._heartbeatIntervalMs + "ms which is less than the required minimum of " + MINIMUM_HEARTBEAT_INTERVAL_MS + "ms"), undefined);
                }
                callback(undefined, _this._connectionIfExists);
            });
            this._client.on(types_1.WebsocketClientEventType.ConnectFailed, function (error) {
                callback(error, undefined);
            });
            this._client.connect(this._apiEndpointUrl);
        }
    };
    WebSocketOrderbookChannel.prototype._handleWebSocketMessage = function (requestId, subscriptionOpts, message, handler) {
        if (!_.isUndefined(message.utf8Data)) {
            try {
                var utf8Data = message.utf8Data;
                var parserResult = orderbook_channel_message_parser_1.orderbookChannelMessageParser.parse(utf8Data);
                if (parserResult.requestId === requestId) {
                    switch (parserResult.type) {
                        case types_1.OrderbookChannelMessageTypes.Snapshot: {
                            handler.onSnapshot(this, subscriptionOpts, parserResult.payload);
                            break;
                        }
                        case types_1.OrderbookChannelMessageTypes.Update: {
                            handler.onUpdate(this, subscriptionOpts, parserResult.payload);
                            break;
                        }
                        default: {
                            handler.onError(this, subscriptionOpts, new Error("Message has missing a type parameter: " + utf8Data));
                        }
                    }
                }
            }
            catch (error) {
                handler.onError(this, subscriptionOpts, error);
            }
        }
        else {
            handler.onError(this, subscriptionOpts, new Error("Message does not contain utf8Data"));
        }
    };
    return WebSocketOrderbookChannel;
}());
exports.WebSocketOrderbookChannel = WebSocketOrderbookChannel;
//# sourceMappingURL=ws_orderbook_channel.js.map