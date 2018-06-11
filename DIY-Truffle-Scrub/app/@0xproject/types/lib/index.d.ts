import { BigNumber } from 'bignumber.js';
export declare type JSONRPCErrorCallback = (err: Error | null, result?: JSONRPCResponsePayload) => void;
/**
 * Do not create your own provider. Use an existing provider from a Web3 or ProviderEngine library
 * Read more about Providers in the 0x wiki.
 */
export interface Provider {
    sendAsync(payload: JSONRPCRequestPayload, callback: JSONRPCErrorCallback): void;
}
export declare type ContractAbi = AbiDefinition[];
export declare type AbiDefinition = FunctionAbi | EventAbi;
export declare type FunctionAbi = MethodAbi | ConstructorAbi | FallbackAbi;
export declare type ConstructorStateMutability = 'nonpayable' | 'payable';
export declare type StateMutability = 'pure' | 'view' | ConstructorStateMutability;
export interface MethodAbi {
    type: AbiType.Function;
    name: string;
    inputs: DataItem[];
    outputs: DataItem[];
    constant: boolean;
    stateMutability: StateMutability;
    payable: boolean;
}
export interface ConstructorAbi {
    type: AbiType.Constructor;
    inputs: DataItem[];
    payable: boolean;
    stateMutability: ConstructorStateMutability;
}
export interface FallbackAbi {
    type: AbiType.Fallback;
    payable: boolean;
}
export interface EventParameter extends DataItem {
    indexed: boolean;
}
export interface EventAbi {
    type: AbiType.Event;
    name: string;
    inputs: EventParameter[];
    anonymous: boolean;
}
export interface DataItem {
    name: string;
    type: string;
    components?: DataItem[];
}
export declare type OpCode = string;
export interface StructLog {
    depth: number;
    error: string;
    gas: number;
    gasCost: number;
    memory: string[];
    op: OpCode;
    pc: number;
    stack: string[];
    storage: {
        [location: string]: string;
    };
}
export interface TransactionTrace {
    gas: number;
    returnValue: any;
    structLogs: StructLog[];
}
export declare type Unit = 'kwei' | 'ada' | 'mwei' | 'babbage' | 'gwei' | 'shannon' | 'szabo' | 'finney' | 'ether' | 'kether' | 'grand' | 'einstein' | 'mether' | 'gether' | 'tether';
export interface JSONRPCRequestPayload {
    params: any[];
    method: string;
    id: number;
    jsonrpc: string;
}
export interface JSONRPCResponsePayload {
    result: any;
    id: number;
    jsonrpc: string;
}
export interface AbstractBlock {
    number: number | null;
    hash: string | null;
    parentHash: string;
    nonce: string | null;
    sha3Uncles: string;
    logsBloom: string | null;
    transactionsRoot: string;
    stateRoot: string;
    miner: string;
    difficulty: BigNumber;
    totalDifficulty: BigNumber;
    extraData: string;
    size: number;
    gasLimit: number;
    gasUsed: number;
    timestamp: number;
    uncles: string[];
}
export interface BlockWithoutTransactionData extends AbstractBlock {
    transactions: string[];
}
export interface BlockWithTransactionData extends AbstractBlock {
    transactions: Transaction[];
}
export interface Transaction {
    hash: string;
    nonce: number;
    blockHash: string | null;
    blockNumber: number | null;
    transactionIndex: number | null;
    from: string;
    to: string | null;
    value: BigNumber;
    gasPrice: BigNumber;
    gas: number;
    input: string;
}
export interface CallTxDataBase {
    to?: string;
    value?: number | string | BigNumber;
    gas?: number | string | BigNumber;
    gasPrice?: number | string | BigNumber;
    data?: string;
    nonce?: number;
}
export interface TxData extends CallTxDataBase {
    from: string;
}
export interface CallData extends CallTxDataBase {
    from?: string;
}
export interface FilterObject {
    fromBlock?: number | string;
    toBlock?: number | string;
    address?: string;
    topics?: LogTopic[];
}
export declare type LogTopic = null | string | string[];
export interface DecodedLogEntry<A> extends LogEntry {
    event: string;
    args: A;
}
export interface DecodedLogEntryEvent<A> extends DecodedLogEntry<A> {
    removed: boolean;
}
export interface LogEntryEvent extends LogEntry {
    removed: boolean;
}
export interface LogEntry {
    logIndex: number | null;
    transactionIndex: number | null;
    transactionHash: string;
    blockHash: string | null;
    blockNumber: number | null;
    address: string;
    data: string;
    topics: string[];
}
export interface TxDataPayable extends TxData {
    value?: BigNumber;
}
export interface TransactionReceipt {
    blockHash: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
    from: string;
    to: string;
    status: null | string | 0 | 1;
    cumulativeGasUsed: number;
    gasUsed: number;
    contractAddress: string | null;
    logs: LogEntry[];
}
export declare enum AbiType {
    Function = "function",
    Constructor = "constructor",
    Event = "event",
    Fallback = "fallback",
}
export declare type ContractEventArg = string | BigNumber | number;
export interface DecodedLogArgs {
    [argName: string]: ContractEventArg;
}
export interface LogWithDecodedArgs<ArgsType> extends DecodedLogEntry<ArgsType> {
}
export declare type RawLog = LogEntry;
export declare enum SolidityTypes {
    Address = "address",
    Uint256 = "uint256",
    Uint8 = "uint8",
    Uint = "uint",
}
/**
 * Contains the logs returned by a TransactionReceipt. We attempt to decode the
 * logs using AbiDecoder. If we have the logs corresponding ABI, we decode it,
 * otherwise we don't.
 */
export interface TransactionReceiptWithDecodedLogs extends TransactionReceipt {
    logs: Array<LogWithDecodedArgs<DecodedLogArgs> | LogEntry>;
}
export declare enum BlockParamLiteral {
    Latest = "latest",
    Pending = "pending",
}
export declare type BlockParam = BlockParamLiteral | number;
export interface RawLogEntry {
    logIndex: string | null;
    transactionIndex: string | null;
    transactionHash: string;
    blockHash: string | null;
    blockNumber: string | null;
    address: string;
    data: string;
    topics: string[];
}
export interface Order {
    maker: string;
    taker: string;
    makerFee: BigNumber;
    takerFee: BigNumber;
    makerTokenAmount: BigNumber;
    takerTokenAmount: BigNumber;
    makerTokenAddress: string;
    takerTokenAddress: string;
    salt: BigNumber;
    exchangeContractAddress: string;
    feeRecipient: string;
    expirationUnixTimestampSec: BigNumber;
}
export interface SignedOrder extends Order {
    ecSignature: ECSignature;
}
/**
 * Elliptic Curve signature
 */
export interface ECSignature {
    v: number;
    r: string;
    s: string;
}
/**
 * Errors originating from the 0x exchange contract
 */
export declare enum ExchangeContractErrs {
    OrderFillExpired = "ORDER_FILL_EXPIRED",
    OrderCancelExpired = "ORDER_CANCEL_EXPIRED",
    OrderCancelAmountZero = "ORDER_CANCEL_AMOUNT_ZERO",
    OrderAlreadyCancelledOrFilled = "ORDER_ALREADY_CANCELLED_OR_FILLED",
    OrderFillAmountZero = "ORDER_FILL_AMOUNT_ZERO",
    OrderRemainingFillAmountZero = "ORDER_REMAINING_FILL_AMOUNT_ZERO",
    OrderFillRoundingError = "ORDER_FILL_ROUNDING_ERROR",
    FillBalanceAllowanceError = "FILL_BALANCE_ALLOWANCE_ERROR",
    InsufficientTakerBalance = "INSUFFICIENT_TAKER_BALANCE",
    InsufficientTakerAllowance = "INSUFFICIENT_TAKER_ALLOWANCE",
    InsufficientMakerBalance = "INSUFFICIENT_MAKER_BALANCE",
    InsufficientMakerAllowance = "INSUFFICIENT_MAKER_ALLOWANCE",
    InsufficientTakerFeeBalance = "INSUFFICIENT_TAKER_FEE_BALANCE",
    InsufficientTakerFeeAllowance = "INSUFFICIENT_TAKER_FEE_ALLOWANCE",
    InsufficientMakerFeeBalance = "INSUFFICIENT_MAKER_FEE_BALANCE",
    InsufficientMakerFeeAllowance = "INSUFFICIENT_MAKER_FEE_ALLOWANCE",
    TransactionSenderIsNotFillOrderTaker = "TRANSACTION_SENDER_IS_NOT_FILL_ORDER_TAKER",
    MultipleMakersInSingleCancelBatchDisallowed = "MULTIPLE_MAKERS_IN_SINGLE_CANCEL_BATCH_DISALLOWED",
    InsufficientRemainingFillAmount = "INSUFFICIENT_REMAINING_FILL_AMOUNT",
    MultipleTakerTokensInFillUpToDisallowed = "MULTIPLE_TAKER_TOKENS_IN_FILL_UP_TO_DISALLOWED",
    BatchOrdersMustHaveSameExchangeAddress = "BATCH_ORDERS_MUST_HAVE_SAME_EXCHANGE_ADDRESS",
    BatchOrdersMustHaveAtLeastOneItem = "BATCH_ORDERS_MUST_HAVE_AT_LEAST_ONE_ITEM",
}
export declare type ArtifactContractName = 'ZRX' | 'TokenTransferProxy' | 'TokenRegistry' | 'Token' | 'Exchange' | 'EtherToken';
export interface Artifact {
    contract_name: ArtifactContractName;
    abi: ContractAbi;
    networks: {
        [networkId: number]: {
            address: string;
        };
    };
}
export declare type OrderAddresses = [string, string, string, string, string];
export declare type OrderValues = [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber];
export declare type DoneCallback = (err?: Error) => void;
export interface OrderRelevantState {
    makerBalance: BigNumber;
    makerProxyAllowance: BigNumber;
    makerFeeBalance: BigNumber;
    makerFeeProxyAllowance: BigNumber;
    filledTakerTokenAmount: BigNumber;
    cancelledTakerTokenAmount: BigNumber;
    remainingFillableMakerTokenAmount: BigNumber;
    remainingFillableTakerTokenAmount: BigNumber;
}
export interface OrderStateValid {
    isValid: true;
    orderHash: string;
    orderRelevantState: OrderRelevantState;
}
export interface OrderStateInvalid {
    isValid: false;
    orderHash: string;
    error: ExchangeContractErrs;
}
export declare type OrderState = OrderStateValid | OrderStateInvalid;
export interface Token {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
}
