export declare const orderBookRequestSchema: {
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
