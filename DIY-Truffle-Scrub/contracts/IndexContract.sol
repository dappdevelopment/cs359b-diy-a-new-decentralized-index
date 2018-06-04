pragma solidity ^0.4.21;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import {Token} from './Token.sol';
import {Exchange} from './Exchange.sol';
import {ReentrancyGuard} from './ReentrancyGuard.sol';

contract IndexContract is Ownable, ReentrancyGuard {
		using SafeMath for uint256;
		uint256 constant MAX_UINT = 2**256 - 1;

		event allowanceSet(address tokenAddress);

		// TokenInfo is the address of the tokens and the %age weight
		struct TokenInfo {
        address addr;
        uint256 weight;
				uint256 curr_quantity;
    }

		TokenInfo[] public _tokens;
		uint256 public _rebalanceInBlocks;
		uint256 public _lastRebalanced;
		address _proxyAddress; // Address of token transfer proxy: https://0xproject.com/wiki#Deployed-Addresses
		address _WETHAddress;
		Exchange _exchange;
    address _diyindex;
    
		mapping (address => uint256) public balances;

		constructor(
			address[] addresses, 
			uint256[] weights, 
			uint256 rebalanceInBlocks,
			address proxyAddress,
			address exchangeAddress,
			address WETHAddress,
      address diyindex
		) public {
			  require(addresses.length > 0);
        require(addresses.length == weights.length);

				_rebalanceInBlocks = rebalanceInBlocks;
				_proxyAddress = proxyAddress;
				_exchange = Exchange(exchangeAddress);
				_WETHAddress = WETHAddress;
        _diyindex = diyindex;
				_lastRebalanced = 0;
				
        for (uint256 i = 0; i < addresses.length; i++) {
            _tokens.push(TokenInfo({
                addr: addresses[i],
                weight: weights[i],
								curr_quantity: 0
            }));
        }
		}

		function deposit_weth(uint256 amount) external onlyOwner returns (bool success) {
				require(amount > 0);
        uint256 i;
				bool exists;
				(i, exists) = get_index(_WETHAddress);	
				require(exists);
				Token token = Token(_WETHAddress);
				require(token.transferFrom(msg.sender, this, amount));
				_tokens[i].curr_quantity = _tokens[i].curr_quantity.add(amount);
				return true;
		}

		function get_last_rebalanced() external view returns (uint256) {
			return _lastRebalanced;
		}

		function rebalance_in_blocks() external view returns (uint256) {
			return _rebalanceInBlocks;
		}

		function withdraw() external onlyOwner nonReentrant returns (bool success) {
				for (uint256 i = 0; i < _tokens.length; i++) {
            TokenInfo memory withdraw_token = _tokens[i];
            Token token = Token(withdraw_token.addr);
            uint256 amount = withdraw_token.curr_quantity;
						_tokens[i].curr_quantity = 0;
            require(token.transfer(owner, amount));
        }	
        return true;
		}

		/// @return addresses
    function token_addresses() external view returns (address[]){
        address[] memory addresses = new address[](_tokens.length);
        for (uint256 i = 0; i < _tokens.length; i++) {
            addresses[i] = _tokens[i].addr;
        }
        return addresses;
    }

		/// @return weight that we'd like to achieve
    function token_weight() external view returns (uint256[]){
        uint256[] memory weight = new uint256[](_tokens.length);
        for (uint256 i = 0; i < _tokens.length; i++) {
            weight[i] = _tokens[i].weight;
        }
        return weight;
    }

		/// @return weight that we'd like to achieve
    function token_quantities() external view returns (uint256[]){
        uint256[] memory quantities = new uint256[](_tokens.length);
        for (uint256 i = 0; i < _tokens.length; i++) {
            quantities[i] = _tokens[i].curr_quantity;
        }
        return quantities;
    }

		function get_index(address token) internal view returns (uint256, bool) {
        for (uint256 i = 0; i < _tokens.length; i++) {
            if (_tokens[i].addr == token) {
                return (i, true);
            }
        }
        return (0, false);
    }

		//
		// Makes token tradeable by setting an allowance for etherDelta and 0x proxy contract.
		// Also sets an allowance for the owner of the contracts therefore allowing to withdraw tokens.
		//
    function set_allowances(address tokenAddress) external onlyOwner {
        Token token = Token(tokenAddress);
        token.approve(_proxyAddress, MAX_UINT);
        token.approve(owner, MAX_UINT);
				token.approve(_diyindex, MAX_UINT);
				// The smart contract should be allowed to trade this
				// token.approve(address(this), MAX_UINT);
				emit allowanceSet(tokenAddress);
    }

		function make_exchange_trade(
        address[5] addresses, uint[7] values,
        uint8 v, bytes32 r, bytes32 s, uint256 block_height
    ) public returns (bool success) {
        // make exchange trade can only be called by us
        require(msg.sender == _diyindex);
        address[5] memory orderAddresses = [
            addresses[0], // maker
            addresses[1], // taker
            addresses[2], // makerToken
            addresses[3], // takerToken
            addresses[4] // feeRecepient
        ];
        uint[6] memory orderValues = [
            values[0], // makerTokenAmount
            values[1], // takerTokenAmount
            values[2], // makerFee
            values[3], // takerFee
            values[4], // expirationTimestampInSec
            values[5]  // salt
        ];
        uint fillTakerTokenAmount = values[6]; // fillTakerTokenAmount
        // Execute Exchange trade. It either succeeds in full or fails and reverts all the changes.

        _exchange.fillOrKillOrder(orderAddresses, orderValues, fillTakerTokenAmount, v, r, s);
				_lastRebalanced = block_height;
        return true;
    }
}
