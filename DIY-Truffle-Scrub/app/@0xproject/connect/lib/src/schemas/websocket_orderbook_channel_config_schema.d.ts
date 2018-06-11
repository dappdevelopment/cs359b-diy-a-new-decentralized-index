export declare const webSocketOrderbookChannelConfigSchema: {
    id: string;
    type: string;
    properties: {
        heartbeatIntervalMs: {
            type: string;
            minimum: number;
        };
    };
};
