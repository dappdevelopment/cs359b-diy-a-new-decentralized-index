"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("@0xproject/assert");
var json_schemas_1 = require("@0xproject/json-schemas");
var type_converters_1 = require("./type_converters");
exports.relayerResponseJsonParsers = {
    parseTokenPairsJson: function (json) {
        assert_1.assert.doesConformToSchema('tokenPairs', json, json_schemas_1.schemas.relayerApiTokenPairsResponseSchema);
        return json.map(function (tokenPair) {
            return type_converters_1.typeConverters.convertStringsFieldsToBigNumbers(tokenPair, [
                'tokenA.minAmount',
                'tokenA.maxAmount',
                'tokenB.minAmount',
                'tokenB.maxAmount',
            ]);
        });
    },
    parseOrdersJson: function (json) {
        assert_1.assert.doesConformToSchema('orders', json, json_schemas_1.schemas.signedOrdersSchema);
        return json.map(function (order) { return type_converters_1.typeConverters.convertOrderStringFieldsToBigNumber(order); });
    },
    parseOrderJson: function (json) {
        assert_1.assert.doesConformToSchema('order', json, json_schemas_1.schemas.signedOrderSchema);
        return type_converters_1.typeConverters.convertOrderStringFieldsToBigNumber(json);
    },
    parseOrderbookResponseJson: function (json) {
        assert_1.assert.doesConformToSchema('orderBook', json, json_schemas_1.schemas.relayerApiOrderBookResponseSchema);
        return type_converters_1.typeConverters.convertOrderbookStringFieldsToBigNumber(json);
    },
    parseFeesResponseJson: function (json) {
        assert_1.assert.doesConformToSchema('fees', json, json_schemas_1.schemas.relayerApiFeesResponseSchema);
        return type_converters_1.typeConverters.convertStringsFieldsToBigNumbers(json, ['makerFee', 'takerFee']);
    },
};
//# sourceMappingURL=relayer_response_json_parsers.js.map