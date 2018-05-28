## **Main repository for DIY - Decentralized Index** ##

## Instructions 
- Install dependencies:   ``` $ npm install ```
 -  Bundle the JS application:   ``` $ npm run build ``` 
  - Serve the client locally:  ``` $ npm run serve``` 

## Help

- Disclaimer: File structure from 0xtrades.info (webpack setup)
- ``` $ yarn add package ``` to add packages or ``` npm install xyz -- save ```
- To compile the typescript files (in client folder) - ``` tsc ```
- Can use *.js or *.ts files
- index.html in ../docs folder

## Status
**0x**
- On console.log() - Order book from radar relay
- [Almost completed] On console.log() - order creation and fills

**Smart Contract**
- [Currently working] Create a smart contract from js directly at runtime

**Backend**
- [Currently working] Adding mongoose support and price data series
- [Currently working] Cron job to update prices everyday from 0x or CoinMarketCap

**Frontend**
