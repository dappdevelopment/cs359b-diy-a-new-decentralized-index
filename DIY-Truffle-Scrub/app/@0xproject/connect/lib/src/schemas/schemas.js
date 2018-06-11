"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fees_request_schema_1 = require("./fees_request_schema");
var orderbook_request_schema_1 = require("./orderbook_request_schema");
var orders_request_opts_schema_1 = require("./orders_request_opts_schema");
var paged_request_opts_schema_1 = require("./paged_request_opts_schema");
var token_pairs_request_opts_schema_1 = require("./token_pairs_request_opts_schema");
var websocket_orderbook_channel_config_schema_1 = require("./websocket_orderbook_channel_config_schema");
exports.schemas = {
    feesRequestSchema: fees_request_schema_1.feesRequestSchema,
    orderBookRequestSchema: orderbook_request_schema_1.orderBookRequestSchema,
    ordersRequestOptsSchema: orders_request_opts_schema_1.ordersRequestOptsSchema,
    pagedRequestOptsSchema: paged_request_opts_schema_1.pagedRequestOptsSchema,
    tokenPairsRequestOptsSchema: token_pairs_request_opts_schema_1.tokenPairsRequestOptsSchema,
    webSocketOrderbookChannelConfigSchema: websocket_orderbook_channel_config_schema_1.webSocketOrderbookChannelConfigSchema,
};
//# sourceMappingURL=schemas.js.map