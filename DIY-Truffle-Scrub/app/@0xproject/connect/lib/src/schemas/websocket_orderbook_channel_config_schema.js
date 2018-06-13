"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocketOrderbookChannelConfigSchema = {
    id: '/WebSocketOrderbookChannelConfig',
    type: 'object',
    properties: {
        heartbeatIntervalMs: {
            type: 'number',
            minimum: 10,
        },
    },
};
//# sourceMappingURL=websocket_orderbook_channel_config_schema.js.map