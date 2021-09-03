# Coin + SimpleToken DApp

Mint NFTs and transfer them to others

Instructions:

- Install Truffle
- Install NPM
- Install Chrome
- Install Metamask extension for Chrome


Open a terminal at ```/Coin``` or ```/SimpleToken ```dir, and run
```
truffle develop
truffle compile
truffle migrate --reset
```

Open another terminal at ```/Coin``` or ```/SimpleToken ```dir, and run
```
npm install
npm install lite-server
npm run dev
```

- with Chrome, go to localhost:3000
- connect metamask to localhost:9545
- add wallet mnemoinc from ```truffle develop``` to metamask
- make some coins, make some NFTs, send them around