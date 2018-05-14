# CS359B Project DIY - A New Decentralized Index

“DIY” is a dapp that allows the user to create a personalized Index Fund in which the user can select ERC20 tokens of choice and set parameters for rebalancing. User can also invest in funds that were started by other people and thematic indices. 

## Technologies used

* Solidity
* Radar Relayer API
* React

## Installation intructions

1. Launch 'testrpc' in oracleDapp folder, in one terminal.
2. Run 'node bridge -a 9 -H 127.0.0.1 -p 8545 --dev' in ethereum-bridge folder, in another terminal.
3. Copy the resultant OAR = "..." line into OracleTest.sol file (replacing the existing OAR line)
4. Open oracleDapp in a new terminal, run 'truffle compile'
5. Run 'truffle migrate --developement --reset'
6. Start the server with 'npm run dev'
