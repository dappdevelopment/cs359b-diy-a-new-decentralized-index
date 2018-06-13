import { AbiDefinition, LogEntry, LogWithDecodedArgs, RawLog } from '@0xproject/types';
export declare class AbiDecoder {
    private _savedABIs;
    private _methodIds;
    private static _padZeros(address);
    constructor(abiArrays: AbiDefinition[][]);
    tryToDecodeLogOrNoop<ArgsType>(log: LogEntry): LogWithDecodedArgs<ArgsType> | RawLog;
    addABI(abiArray: AbiDefinition[]): void;
}
