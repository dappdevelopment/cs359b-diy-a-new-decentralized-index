pragma solidity ^0.4.21;

contract DIY {
    mapping (address => uint256) public balances;
    uint256 totalSupply = 21000000;
    event BalanceChanged(address indexed _address, uint256 _balance);

    function DIY() public {
        balances[msg.sender] = totalSupply;        // Give the creator initially all the tokens
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit BalanceChanged(msg.sender, balances[msg.sender]);
        emit BalanceChanged(_to, balances[_to]);
    return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function mint(uint256 _amount) public returns (bool success) {
        require(msg.sender == 0xcfE8890Af1EA254544D2aEDbfE42D7d6E628Ea91);
        totalSupply += _amount;
        balances[msg.sender] += _amount;
        emit BalanceChanged(msg.sender, balances[msg.sender]);
    return true;
    }
}