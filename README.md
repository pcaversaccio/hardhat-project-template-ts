# Fully-Fledged Hardhat Project Template Based on TypeScript

[![build status](https://github.com/pcaversaccio/hardhat-project-template-ts/actions/workflows/test-contracts.yml/badge.svg)](https://github.com/pcaversaccio/hardhat-project-template-ts/actions)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

## Installation

It is recommended to install [Yarn](https://classic.yarnpkg.com) through the `npm` package manager, which comes bundled with [Node.js](https://nodejs.org) when you install it on your system. It is recommended to use a Node.js version `>= 16.0.0`.

Once you have `npm` installed, you can run the following both to install and upgrade Yarn:

```bash
npm install --global yarn
```

After having installed Yarn, simply run:

```bash
yarn install
```

## Running Deployments 

```
npx hardhat xdeploy
```

This starter use [xdeploy](https://github.com/pcaversaccio/xdeployer) check the documentation for more on deployments.

## env file 

In the .env file, place your wallets private key in the PRIVATE_KEY section, this allows access to your wallet to use both testnet and mainnet funds.

## Verification

Change the contract address to your contract after deployment has been successful. This works for both testnet & mainnet. You will need to get an API key from etherscan.io, bscscan, snowtrace etc. 

Typescript deployment example:
npx hardhat verify --network fantomMain YOUR_CONTRACT_HERE --constructor-args deploy-arg.ts 

Javascript deployment args example:
npx hardhat verify --network bscTestnet YOUR_CONTRACT_HERE --constructor-args arguments.js 
