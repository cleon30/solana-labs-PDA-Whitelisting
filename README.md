<div align="center">
  <h1>
    <code>Solana Whitelisting PDA contract</code>
  </h1>
  <strong>Whitelisting PDA</sup>
  
  <sub>
    Built in Solana using Anchor and 🦀  <a href="https://solana.com/es" target="_blank">Solana</a>
    
  </sub>
  
</div>

## Description

The Solana Whitelisting PDA contract is an open-source tool for developers in the Solana ecosystem, enabling them to create an on-chain whitelisting solution as easier as possible. 

## Setting up your Localnet

Set your config to localhost
  1. `solana config set --url localhost`
Then run in separate window
  2. `solana-test-validator --reset`
Also you can view all the program interactions with:
  3. `solana logs`

## Installing Project & Dependencies 

Set your config to localhost
  1. `git clone https://github.com/cleon30/solana-labs-PDA-Whitelisting.git`
  2. `cd solana-labs-PDA-Whitelisting.git`
  3. `yarn add ts-mocha`

Also if you don't have Anchor or npm or Solana, please follow these instructions:
https://project-serum.github.io/anchor/getting-started/installation.html

## Running 
Take in consideration that I assume that you are running a local validator, if not follow localnet commands

All in instruction:
  1. `clear && anchor build && clear && anchor deploy && clear && anchor run counter`
Steps:
  2. `anchor build`
  3. `anchor deploy`
  3. `anchor run counter`


  0xCleon