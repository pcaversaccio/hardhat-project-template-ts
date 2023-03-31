# Fully-Fledged Hardhat Project Template Based on TypeScript

[![Test smart contracts](https://github.com/pcaversaccio/hardhat-project-template-ts/actions/workflows/test-contracts.yml/badge.svg)](https://github.com/pcaversaccio/hardhat-project-template-ts/actions/workflows/test-contracts.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

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

**Example Goerli:**

```bash
yarn deploy:goerli
```

> The deployment script [`deploy.ts`](./scripts/deploy.ts) includes the `tenderly` Hardhat Runtime Environment (HRE) extension with the `verify` method. Please consider uncommenting and configuring the Tenderly `project`, `username`, `forkNetwork`, `privateVerification`, and `deploymentsDir` attributes in the [`hardhat.config.ts`](./hardhat.config.ts) file before deploying or remove this call. Also, for this plugin to function you need to create a `config.yaml` file at `$HOME/.tenderly/config.yaml` or `%HOMEPATH%\.tenderly\config.yaml` and add an `access_key` field to it. For further information, see [here](https://www.npmjs.com/package/@tenderly/hardhat-tenderly#usage).

> For the deployment on the [zkSync Era](https://era.zksync.io) test network, you must add your to-be-deployed contract artifact to [`deploy-zksync.ts`](./deploy/deploy-zksync.ts), enable `zksync` in the [`hardhat.config.ts`](./hardhat.config.ts#L83) file, and then run `yarn compile`. Next, fund your deployer account on zkSync Era Testnet, configure your `.env` file accordingly, and simply run `yarn deploy:zksynctestnet`. Eventually, to verify the contract you can invoke: `npx hardhat verify --network zkSyncTestnet --constructor-args arguments.js <YOUR_CONTRACT_ADDRESS>`.

## Running `CREATE2` Deployments

```bash
yarn xdeploy
```

This template uses the [xdeploy](https://github.com/pcaversaccio/xdeployer) Hardhat plugin. Check out the documentation for more information on the specifics of the deployments.

## `.env` File

In the `.env` file place the private key of your wallet in the `PRIVATE_KEY` section. This allows secure access to your wallet to use with both testnet and mainnet funds during Hardhat deployments. For more information on how this works, please read the documentation of the `npm` package [`dotenv`](https://www.npmjs.com/package/dotenv).

## Using the Truffle Dashboard

[Truffle](https://trufflesuite.com) developed the [Truffle Dashboard](https://trufflesuite.com/docs/truffle/getting-started/using-the-truffle-dashboard.html) to provide an easy way to use your existing MetaMask wallet for your deployments and for other transactions that you need to send from a command line context. Because the Truffle Dashboard connects directly to MetaMask it is also possible to use it in combination with hardware wallets like [Ledger](https://www.ledger.com) or [Trezor](https://trezor.io).

First, it is recommended that you install Truffle globally by running:

```bash
npm install -g truffle
```

To start a Truffle Dashboard, you need to run the following command in a separate terminal window:

```bash
truffle dashboard
```

By default, the command above starts a Truffle Dashboard at http://localhost:24012 and opens the Dashboard in a new tab in your default browser. The Dashboard then prompts you to connect your wallet and confirm that you're connected to the right network. **You should double check your connected network at this point, since switching to a different network during a deployment can have unintended consequences.**

Eventually, in order to deploy with the Truffle Dashboard, you can simply run:

```bash
yarn deploy:dashboard
```

## Mainnet Forking

You can start an instance of the Hardhat network that forks the mainnet. This means that it will simulate having the same state as the mainnet, but it will work as a local development network. That way you can interact with deployed protocols and test complex interactions locally. To use this feature, you need to connect to an archive node.

This template is currently configured via the [hardhat.config.ts](./hardhat.config.ts) as follows:

```ts
forking: {
    url: process.env.ETH_MAINNET_URL || "",
    // The Hardhat network will by default fork from the latest mainnet block
    // To pin the block number, specify it below
    // You will need access to a node with archival data for this to work!
    // blockNumber: 14743877,
    // If you want to do some forking, set `enabled` to true
    enabled: false,
}
```

## Contract Verification

Change the contract address to your contract after the deployment has been successful. This works for both testnet and mainnet. You will need to get an API key from [etherscan](https://etherscan.io), [snowtrace](https://snowtrace.io) etc.

**Example:**

```bash
npx hardhat verify --network fantomMain --constructor-args arguments.js <YOUR_CONTRACT_ADDRESS>
```

## Foundry

This template repository also includes the [Foundry](https://github.com/foundry-rs/foundry) toolkit.

> If you need help getting started with Foundry, I recommend reading the [📖 Foundry Book](https://book.getfoundry.sh).

### Dependencies

```bash
make update
```

or

```
forge update
```

### Compilation

```bash
make build
```

or

```
forge build
```

### Testing

To run only TypeScript tests:

```bash
yarn test:hh
```

To run only Solidity tests:

```bash
yarn test:forge
```

or

```bash
make test-forge
```

To additionally display the gas report, you can run:

```bash
make test-gasreport
```

### Deployment and Etherscan Verification

Inside the [`scripts/`](./scripts) folder are a few preconfigured scripts that can be used to deploy and verify contracts via Foundry. These scripts are required to be _executable_ meaning they must be made executable by running:

```bash
make scripts
```
