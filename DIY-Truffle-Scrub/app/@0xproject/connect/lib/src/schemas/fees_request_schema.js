"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feesRequestSchema = {
    id: '/FeesRequest',
    type: 'object',
    properties: {
        exchangeContractAddress: { $ref: '/Address' },
        maker: { $ref: '/Address' },
        taker: { $ref: '/Address' },
        makerTokenAddress: { $ref: '/Address' },
        takerTokenAddress: { $ref: '/Address' },
        makerTokenAmount: { $ref: '/Number' },
        takerTokenAmount: { $ref: '/Number' },
        expirationUnixTimestampSec: { $ref: '/Number' },
        salt: { $ref: '/Number' },
    },
    required: [
        'exchangeContractAddress',
        'maker',
        'taker',
        'makerTokenAddress',
        'takerTokenAddress',
        'makerTokenAmount',
        'takerTokenAmount',
        'expirationUnixTimestampSec',
        'salt',
    ],
};
//# sourceMappingURL=fees_request_schema.js.map