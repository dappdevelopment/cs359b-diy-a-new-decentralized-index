"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderBookRequestSchema = {
    id: '/OrderBookRequest',
    type: 'object',
    properties: {
        baseTokenAddress: { $ref: '/Address' },
        quoteTokenAddress: { $ref: '/Address' },
    },
    required: ['baseTokenAddress', 'quoteTokenAddress'],
};
//# sourceMappingURL=orderbook_request_schema.js.map