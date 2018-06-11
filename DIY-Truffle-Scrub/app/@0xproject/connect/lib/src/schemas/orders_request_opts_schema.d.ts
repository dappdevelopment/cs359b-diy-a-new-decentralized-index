export declare const ordersRequestOptsSchema: {
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
