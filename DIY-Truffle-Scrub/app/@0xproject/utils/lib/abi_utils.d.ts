import { AbiDefinition, DataItem, MethodAbi } from '@0xproject/types';
export declare const abiUtils: {
    parseFunctionParam(param: DataItem): string;
    getFunctionSignature(methodAbi: MethodAbi): string;
    renameOverloadedMethods(inputContractAbi: AbiDefinition[]): AbiDefinition[];
};
