pragma solidity ^0.4.21;
import "installed_contracts/oraclize-api/contracts/usingOraclize.sol";

contract OraclizeTest is usingOraclize {

    address owner;
    string public ETHUSD;
    string public BTCUSD;

    event LogInfo(string description);
    event LogPriceUpdate(string price);
    event LogPriceUpdate2(string price);
    event LogUpdate(address indexed _owner, uint indexed _balance);
    enum oraclizeState { ForEth, ForBitcoin }

    struct oraclizeCallback {
        oraclizeState oState;
    }

    mapping (bytes32 => oraclizeCallback) public oraclizeCallbacks;

    // Constructor
    function OraclizeTest()
    payable
    public {
        owner = msg.sender;

        emit LogUpdate(owner, address(this).balance);

        // Replace the next line with your version:
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);

        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        update();
        update2();
    }

    // Fallback function
    function()
    public{
        revert();
    }

    function __callback(bytes32 id, string result, bytes proof)
    public {
        require(msg.sender == oraclize_cbAddress());
        oraclizeCallback memory o = oraclizeCallbacks[id];
        if (o.oState == oraclizeState.ForEth){
            ETHUSD = result;
            emit LogPriceUpdate(ETHUSD);
            update();
        } 
        if (o.oState == oraclizeState.ForBitcoin){
            BTCUSD = result;
            emit LogPriceUpdate2(BTCUSD);
            update2();
        } 

    }

    function getBalance()
    public
    returns (uint _balance) {
        return address(this).balance;
    }

    function update()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize ETH query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize ETH query was sent, standing by for the answer..");
            bytes32 queryId = oraclize_query("URL","json(https://api.coinbase.com/v2/prices/ETH-USD/spot).data.amount");
            oraclizeCallbacks[queryId] = oraclizeCallback(oraclizeState.ForEth);
   
            // Using XPath to to fetch the right element in the JSON response
            // oraclize_query("URL", "json(https://api.coinbase.com/v2/prices/ETH-USD/spot).data.amount");
            // oraclize_query("URL", "json(https://api.coinmarketcap.com/v2/ticker/1/).data.quotes.USD.price");
        }
    }

    function update2()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize BTC query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize BTC query was sent, standing by for the answer..");
            bytes32 queryId2 = oraclize_query("URL", "json(https://api.coinmarketcap.com/v2/ticker/1/).data.quotes.USD.price");
            oraclizeCallbacks[queryId2] = oraclizeCallback(oraclizeState.ForBitcoin);
   
            // Using XPath to to fetch the right element in the JSON response
            // oraclize_query("URL", "json(https://api.coinbase.com/v2/prices/ETH-USD/spot).data.amount");
            // oraclize_query("URL", "json(https://api.coinmarketcap.com/v2/ticker/1/).data.quotes.USD.price");
        }
    }



}