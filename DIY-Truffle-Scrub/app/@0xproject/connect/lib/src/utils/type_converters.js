"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@0xproject/utils");
var _ = require("lodash");
exports.typeConverters = {
    convertOrderbookStringFieldsToBigNumber: function (orderbook) {
        var _this = this;
        var bids = _.get(orderbook, 'bids', []);
        var asks = _.get(orderbook, 'asks', []);
        return {
            bids: bids.map(function (order) { return _this.convertOrderStringFieldsToBigNumber(order); }),
            asks: asks.map(function (order) { return _this.convertOrderStringFieldsToBigNumber(order); }),
        };
    },
    convertOrderStringFieldsToBigNumber: function (order) {
        return this.convertStringsFieldsToBigNumbers(order, [
            'makerTokenAmount',
            'takerTokenAmount',
            'makerFee',
            'takerFee',
            'expirationUnixTimestampSec',
            'salt',
        ]);
    },
    convertStringsFieldsToBigNumbers: function (obj, fields) {
        var result = _.assign({}, obj);
        _.each(fields, function (field) {
            _.update(result, field, function (value) { return new utils_1.BigNumber(value); });
        });
        return result;
    },
};
//# sourceMappingURL=type_converters.js.map