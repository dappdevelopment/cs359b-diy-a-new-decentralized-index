import { SignedOrder } from '@0xproject/types';
import { FeesResponse, OrderbookResponse, TokenPairsItem } from '../types';
export declare const relayerResponseJsonParsers: {
    parseTokenPairsJson(json: any): TokenPairsItem[];
    parseOrdersJson(json: any): SignedOrder[];
    parseOrderJson(json: any): SignedOrder;
    parseOrderbookResponseJson(json: any): OrderbookResponse;
    parseFeesResponseJson(json: any): FeesResponse;
};
