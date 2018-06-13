export declare const schemas: {
    feesRequestSchema: {
        id: string;
        type: string;
        properties: {
            exchangeContractAddress: {
                $ref: string;
            };
            maker: {
                $ref: string;
            };
            taker: {
                $ref: string;
            };
            makerTokenAddress: {
                $ref: string;
            };
            takerTokenAddress: {
                $ref: string;
            };
            makerTokenAmount: {
                $ref: string;
            };
            takerTokenAmount: {
                $ref: string;
            };
            expirationUnixTimestampSec: {
                $ref: string;
            };
            salt: {
                $ref: string;
            };
        };
        required: string[];
    };
    orderBookRequestSchema: {
        id: string;
        type: string;
        properties: {
            baseTokenAddress: {
                $ref: string;
            };
            quoteTokenAddress: {
                $ref: string;
            };
        };
        required: string[];
    };
    ordersRequestOptsSchema: {
        id: string;
        type: string;
        properties: {
            exchangeContractAddress: {
                $ref: string;
            };
            tokenAddress: {
                $ref: string;
            };
            makerTokenAddress: {
                $ref: string;
            };
            takerTokenAddress: {
                $ref: string;
            };
            tokenA: {
                $ref: string;
            };
            tokenB: {
                $ref: string;
            };
            maker: {
                $ref: string;
            };
            taker: {
                $ref: string;
            };
            trader: {
                $ref: string;
            };
            feeRecipient: {
                $ref: string;
            };
        };
    };
    pagedRequestOptsSchema: {
        id: string;
        type: string;
        properties: {
            page: {
                type: string;
            };
            perPage: {
                type: string;
            };
        };
    };
    tokenPairsRequestOptsSchema: {
        id: string;
        type: string;
        properties: {
            tokenA: {
                $ref: string;
            };
            tokenB: {
                $ref: string;
            };
        };
    };
    webSocketOrderbookChannelConfigSchema: {
        id: string;
        type: string;
        properties: {
            heartbeatIntervalMs: {
                type: string;
                minimum: number;
            };
        };
    };
};
