<div align="center">
  <h1>
    <code>Solana Whitelisting PDA contract</code>
  </h1>

  
  <sub>
    Built in Solana using Anchor and 🦀  <a href="https://solana.com/es" target="_blank">Solana</a>
    
  </sub>
  
</div>

## Description

The Solana Whitelisting PDA contract is an open-source tool for developers in the Solana ecosystem, enabling them to create an on-chain whitelisting solution as easier as possible. 
<img width="898" alt="image" src="https://user-images.githubusercontent.com/62452212/185815952-78ec3be5-f3e8-4cd2-97dd-8c61592df07f.png">

![image](https://user-images.githubusercontent.com/62452212/184254717-48bbc920-1663-4ef3-8f3c-bf4ae6dc1f2f.png)


## Setting up your Localnet

Set your config to localhost
```bash
solana config set --url localhost
```
Then run in separate window
```bash
solana-test-validator --reset
````
Also you can view all the program interactions with:
```bash
solana logs
```

## Installing Project & Dependencies 

Set your config to localhost
```bash
git clone https://github.com/cleon30/solana-labs-PDA-Whitelisting.git
cd solana-labs-PDA-Whitelisting.git
yarn add ts-mocha
```
Also if you don't have Anchor or npm or Solana, please follow these instructions: https://project-serum.github.io/anchor/getting-started/installation.html

## Running


Take in consideration that I assume that you are running a local validator, if not follow localnet commands

All in instruction:
```bash
solana airdrop 10 ~/.config/solana/id.json && clear && anchor build && clear && anchor deploy && clear && anchor run counter
```

Step by step:

To build the smart contract programs:
```bash
anchor build
```
To have money to deploy
```bash
solana airdrop 10 ~/.config/solana/id.json
```
To deploy the smart contract to Blockchain
```bash
anchor deploy
```
## Tests

For testing the Smart Contracts I have used multiple cases, with different parameters and situations when calling the functions.
In the project you will find 3 tests inside the test directory. You will be able to run all them with ```anchor run test``` . 

### Testing the Whitelist

```bash
anchor run whitelist
```
<img width="505" alt="image" src="https://user-images.githubusercontent.com/62452212/184933813-ee4095dd-be8b-42c5-9f2c-e86e64b284b8.png">

### Testing the Counter

```bash
anchor run counter
```
<img width="679" alt="image" src="https://user-images.githubusercontent.com/62452212/184934015-816a72fc-fb2f-497f-8091-fc0307a29f80.png">

0xCleon
