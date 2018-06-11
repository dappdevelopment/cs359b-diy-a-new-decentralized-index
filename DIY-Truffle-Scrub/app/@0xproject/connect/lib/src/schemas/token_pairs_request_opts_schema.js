"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenPairsRequestOptsSchema = {
    id: '/TokenPairsRequestOpts',
    type: 'object',
    properties: {
        tokenA: { $ref: '/Address' },
        tokenB: { $ref: '/Address' },
    },
};
//# sourceMappingURL=token_pairs_request_opts_schema.js.map