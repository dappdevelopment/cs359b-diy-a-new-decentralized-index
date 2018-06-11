"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrderbookChannelMessageTypes;
(function (OrderbookChannelMessageTypes) {
    OrderbookChannelMessageTypes["Snapshot"] = "snapshot";
    OrderbookChannelMessageTypes["Update"] = "update";
    OrderbookChannelMessageTypes["Unknown"] = "unknown";
})(OrderbookChannelMessageTypes = exports.OrderbookChannelMessageTypes || (exports.OrderbookChannelMessageTypes = {}));
var WebsocketConnectionEventType;
(function (WebsocketConnectionEventType) {
    WebsocketConnectionEventType["Close"] = "close";
    WebsocketConnectionEventType["Error"] = "error";
    WebsocketConnectionEventType["Message"] = "message";
})(WebsocketConnectionEventType = exports.WebsocketConnectionEventType || (exports.WebsocketConnectionEventType = {}));
var WebsocketClientEventType;
(function (WebsocketClientEventType) {
    WebsocketClientEventType["Connect"] = "connect";
    WebsocketClientEventType["ConnectFailed"] = "connectFailed";
})(WebsocketClientEventType = exports.WebsocketClientEventType || (exports.WebsocketClientEventType = {}));
var HttpRequestType;
(function (HttpRequestType) {
    HttpRequestType["Get"] = "GET";
    HttpRequestType["Post"] = "POST";
})(HttpRequestType = exports.HttpRequestType || (exports.HttpRequestType = {}));
//# sourceMappingURL=types.js.map