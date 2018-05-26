import { DecodedLogEvent, ZeroEx } from '0x.js';
import { BigNumber } from '@0xproject/utils';
import * as Web3 from 'web3';

export class CreateOrder{

  constructor() {}

  public async init () {}

  public async create_and_fill_order() {

    // const TESTRPC_NETWORK_ID = 50;
    // Provider pointing to local TestRPC on default port 8545
    // const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    let web3: Web3;
    // web3 = new Web3(window.web3!.currentProvider);

    // if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
    // const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    // const provider = new Web3.providers.HttpProvider(web3.currentProvider);
    const provider = window.web3!.currentProvider;
    const NETWORK_ID = 1;
//    } else {
//      console.log('No web3? You should consider trying MetaMask!')
//        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
//      const provider = new Web3.providers.HttpProvider("http://localhost:8545");
//      const NETWORK_ID = 50;
//    }

    // Instantiate 0x.js instance
    const configs = {
        networkId: NETWORK_ID,
    };
    const zeroEx = new ZeroEx(provider, configs);


    // Number of decimals to use (for ETH and ZRX)
    const DECIMALS = 18;

    // The Exchange.sol address (0x exchange smart contract)
    const EXCHANGE_ADDRESS = zeroEx.exchange.getContractAddress();
    console.log('Exchange address = ' + EXCHANGE_ADDRESS);

    // Getting list of accounts
    const accounts = await zeroEx.getAvailableAddressesAsync();
    console.log('accounts = ', accounts);

    // Addresses
    // const WETH_ADDRESS = zeroEx.etherToken.getContractAddressIfExists() as string; // The wrapped ETH token contract
    const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    console.log('WETH Address = ' + WETH_ADDRESS);

    const ZRX_ADDRESS = zeroEx.exchange.getZRXTokenAddress(); // The ZRX token contract
    console.log('ZRX Address = ' + ZRX_ADDRESS);

    // Set our addresses
    const [makerAddress, takerAddress] = accounts;
    console.log('Maker address = ' + makerAddress);
    console.log('Taker address = ' + takerAddress);

    // Unlimited allowances to 0x proxy contract for maker and taker
    const setMakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(ZRX_ADDRESS, makerAddress);
    await zeroEx.awaitTransactionMinedAsync(setMakerAllowTxHash);

    const setTakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(WETH_ADDRESS, takerAddress);
    await zeroEx.awaitTransactionMinedAsync(setTakerAllowTxHash);
    console.log('Taker allowance mined...');

    // Deposit WETH
    const ethAmount = new BigNumber(.1);
    const ethToConvert = ZeroEx.toBaseUnitAmount(ethAmount, DECIMALS); // Number of ETH to convert to WETH
    const convertEthTxHash = await zeroEx.etherToken.depositAsync(WETH_ADDRESS, ethToConvert, takerAddress);
    await zeroEx.awaitTransactionMinedAsync(convertEthTxHash);
    console.log(`${ethAmount} ETH -> WETH conversion mined...`);

    // Generate order
    const order = {
        maker: makerAddress,
        taker: ZeroEx.NULL_ADDRESS,
        feeRecipient: ZeroEx.NULL_ADDRESS,
        makerTokenAddress: ZRX_ADDRESS,
        takerTokenAddress: WETH_ADDRESS,
        exchangeContractAddress: EXCHANGE_ADDRESS,
        salt: ZeroEx.generatePseudoRandomSalt(),
        makerFee: new BigNumber(0),
        takerFee: new BigNumber(0),
        makerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(0.2), DECIMALS), // Base 18 decimals
        takerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(0.3), DECIMALS), // Base 18 decimals
        expirationUnixTimestampSec: new BigNumber(Date.now() + 3600000), // Valid for up to an hour
    };

    // Create orderHash
    const orderHash = ZeroEx.getOrderHashHex(order);

    // Signing orderHash -> ecSignature
    const shouldAddPersonalMessagePrefix = false;
    // Made changes here to the ecSignature
    // const ecSignature = await zeroEx.signOrderHashAsync(orderHash, makerAddress, shouldAddPersonalMessagePrefix);
    const ecSignature = await zeroEx.signOrderHashAsync(orderHash, makerAddress);

    // Appending signature to order
    const signedOrder = {
        ...order,
        ecSignature,
    };

    // Verify that order is fillable
    await zeroEx.exchange.validateOrderFillableOrThrowAsync(signedOrder);

    // Try to fill order
    const shouldThrowOnInsufficientBalanceOrAllowance = true;
    const fillTakerTokenAmount = ZeroEx.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);

    // Filling order
    const txHash = await zeroEx.exchange.fillOrderAsync(
        signedOrder,
        fillTakerTokenAmount,
        shouldThrowOnInsufficientBalanceOrAllowance,
        takerAddress,
    );

    // Transaction receipt
    const txReceipt = await zeroEx.awaitTransactionMinedAsync(txHash);
    console.log('FillOrder transaction receipt: ', txReceipt);
    }
}
