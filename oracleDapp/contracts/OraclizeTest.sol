pragma solidity ^0.4.21;
import "installed_contracts/oraclize-api/contracts/usingOraclize.sol";

contract OraclizeTest is usingOraclize {

    address owner;

    event LogInfo(string description);
    event LogPriceUpdateEth(string price);
    event LogPriceUpdateEos(string price);
    event LogPriceUpdateTrx(string price);
    event LogPriceUpdateVen(string price);
    event LogPriceUpdateIcx(string price);
    event LogPriceUpdateBnb(string price);
    event LogPriceUpdateOmg(string price);
    event LogPriceUpdateZil(string price);
    event LogPriceUpdateAe(string price);
    event LogPriceUpdateZrx(string price);
    event LogPriceUpdateBtm(string price);
    event LogUpdate(address indexed _owner, uint indexed _balance);
    enum oraclizeState { ForEth, ForEos, ForTrx, ForVen, ForIcx, ForBnb, ForOmg, ForZil, ForAe, ForZrx, ForBtm}

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
        OAR = OraclizeAddrResolverI(0x08193C23804b292452a6fdc0E88F42Fd121A2443);

        oraclize_setProof(proofType_TLSNotary | proofStorage_IPFS);
        updateEth();
        updateEos();
        updateTrx();
        updateVen();
        updateIcx();
        updateBnb();
        updateOmg();
        updateZil();
        updateAe();
        updateZrx();
        updateBtm();
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
            emit LogPriceUpdateEth(result);
            updateEth();
        } 
        if (o.oState == oraclizeState.ForEos){
            emit LogPriceUpdateEos(result);
            updateEos();
        } 
        if (o.oState == oraclizeState.ForTrx){
            emit LogPriceUpdateTrx(result);
            updateTrx();
        } 
        if (o.oState == oraclizeState.ForVen){
            emit LogPriceUpdateVen(result);
            updateVen();
        } 
        if (o.oState == oraclizeState.ForIcx){
            emit LogPriceUpdateIcx(result);
            updateIcx();
        } 
        if (o.oState == oraclizeState.ForBnb){
            emit LogPriceUpdateBnb(result);
            updateBnb();
        } 
        if (o.oState == oraclizeState.ForOmg){
            emit LogPriceUpdateOmg(result);
            updateOmg();
        } 
        if (o.oState == oraclizeState.ForZil){
            emit LogPriceUpdateZil(result);
            updateZil();
        } 
        if (o.oState == oraclizeState.ForAe){
            emit LogPriceUpdateAe(result);
            updateAe();
        } 
        if (o.oState == oraclizeState.ForZrx){
            emit LogPriceUpdateZrx(result);
            updateZrx();
        } 
        if (o.oState == oraclizeState.ForBtm){
            emit LogPriceUpdateBtm(result);
            updateBtm();
        } 
    }

    function getBalance()
    public
    returns (uint _balance) {
        return address(this).balance;
    }

    function updateEth()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize ETH query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize ETH query was sent, standing by for the answer..");
            bytes32 queryId = oraclize_query("URL","json(https://api.coinbase.com/v2/prices/ETH-USD/spot).data.amount");
            oraclizeCallbacks[queryId] = oraclizeCallback(oraclizeState.ForEth);
        }
    }

    function updateEos()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize EOS query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize EOS query was sent, standing by for the answer..");
            bytes32 queryId2 = oraclize_query("URL", "json(https://api.coinmarketcap.com/v2/ticker/1765/).data.quotes.USD.price");
            oraclizeCallbacks[queryId2] = oraclizeCallback(oraclizeState.ForEos);
        }
    }

    function updateTrx()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize TRX query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize TRX query was sent, standing by for the answer..");
            bytes32 queryId3 = oraclize_query("URL", "json(https://api.coinmarketcap.com/v2/ticker/1958/).data.quotes.USD.price");
            oraclizeCallbacks[queryId3] = oraclizeCallback(oraclizeState.ForTrx);
   
        }
    }

    function updateVen()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize VEN query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize VEN query was sent, standing by for the answer..");
            bytes32 queryId4 = oraclize_query("URL", "json(https://api.coinmarketcap.com/v2/ticker/1904/).data.quotes.USD.price");
            oraclizeCallbacks[queryId4] = oraclizeCallback(oraclizeState.ForVen);
   
        }
    }

    function updateIcx()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize ICX query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize ICX query was sent, standing by for the answer..");
            bytes32 queryId5 = oraclize_query("URL", "json(https://api.coinmarketcap.com/v2/ticker/2099/).data.quotes.USD.price");
            oraclizeCallbacks[queryId5] = oraclizeCallback(oraclizeState.ForIcx);
   
        }
    }
    
    function updateBnb()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize BNB query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize BNB query was sent, standing by for the answer..");
            bytes32 queryId6 = oraclize_query("URL", "json(https://api.coinmarketcap.com/v2/ticker/1839/).data.quotes.USD.price");
            oraclizeCallbacks[queryId6] = oraclizeCallback(oraclizeState.ForBnb);
   
        }
    }

    function updateOmg()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize OMG query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize OMG query was sent, standing by for the answer..");
            bytes32 queryId7 = oraclize_query("URL", "json(https://api.coinmarketcap.com/v2/ticker/1808/).data.quotes.USD.price");
            oraclizeCallbacks[queryId7] = oraclizeCallback(oraclizeState.ForOmg);
   
        }
    }

    function updateZil()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize ZIL query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize ZIL query was sent, standing by for the answer..");
            bytes32 queryId8 = oraclize_query("URL", "json(https://api.coinmarketcap.com/v2/ticker/2469/).data.quotes.USD.price");
            oraclizeCallbacks[queryId8] = oraclizeCallback(oraclizeState.ForZil);
   
        }
    }
    function updateAe()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize AE query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize AE query was sent, standing by for the answer..");
            bytes32 queryId9 = oraclize_query("URL", "json(https://api.coinmarketcap.com/v2/ticker/1700/).data.quotes.USD.price");
            oraclizeCallbacks[queryId9] = oraclizeCallback(oraclizeState.ForAe);
        }
    }
    function updateZrx()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize ZRX query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize ZRX query was sent, standing by for the answer..");
            bytes32 queryId10 = oraclize_query("URL", "json(https://api.coinmarketcap.com/v2/ticker/1896/).data.quotes.USD.price");
            oraclizeCallbacks[queryId10] = oraclizeCallback(oraclizeState.ForZrx);
   
        }
    }

    function updateBtm()
    payable
    public {
        // Check if we have enough remaining funds
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit LogInfo("Oraclize BTM query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogInfo("Oraclize BTM query was sent, standing by for the answer..");
            bytes32 queryId11 = oraclize_query("URL", "json(https://api.coinmarketcap.com/v2/ticker/1866/).data.quotes.USD.price");
            oraclizeCallbacks[queryId11] = oraclizeCallback(oraclizeState.ForBtm);
   
        }
    }
}