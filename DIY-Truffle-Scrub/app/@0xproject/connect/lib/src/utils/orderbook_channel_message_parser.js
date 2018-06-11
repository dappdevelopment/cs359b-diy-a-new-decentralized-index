"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("@0xproject/assert");
var json_schemas_1 = require("@0xproject/json-schemas");
var _ = require("lodash");
var types_1 = require("../types");
var relayer_response_json_parsers_1 = require("./relayer_response_json_parsers");
exports.orderbookChannelMessageParser = {
    parse: function (utf8Data) {
        var messageObj = JSON.parse(utf8Data);
        var type = _.get(messageObj, 'type');
        assert_1.assert.assert(!_.isUndefined(type), "Message is missing a type parameter: " + utf8Data);
        assert_1.assert.isString('type', type);
        switch (type) {
            case types_1.OrderbookChannelMessageTypes.Snapshot: {
                assert_1.assert.doesConformToSchema('message', messageObj, json_schemas_1.schemas.relayerApiOrderbookChannelSnapshotSchema);
                var orderbookJson = messageObj.payload;
                var orderbook = relayer_response_json_parsers_1.relayerResponseJsonParsers.parseOrderbookResponseJson(orderbookJson);
                return _.assign(messageObj, { payload: orderbook });
            }
            case types_1.OrderbookChannelMessageTypes.Update: {
                assert_1.assert.doesConformToSchema('message', messageObj, json_schemas_1.schemas.relayerApiOrderbookChannelUpdateSchema);
                var orderJson = messageObj.payload;
                var order = relayer_response_json_parsers_1.relayerResponseJsonParsers.parseOrderJson(orderJson);
                return _.assign(messageObj, { payload: order });
            }
            default: {
                return {
                    type: types_1.OrderbookChannelMessageTypes.Unknown,
                    requestId: 0,
                    payload: undefined,
                };
            }
        }
    },
};
//# sourceMappingURL=orderbook_channel_message_parser.js.map