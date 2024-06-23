# Fully-Fledged Hardhat Project Template Based on TypeScript

[![🕵️‍♂️ Test smart contracts](https://github.com/pcaversaccio/hardhat-project-template-ts/actions/workflows/test-contracts.yml/badge.svg)](https://github.com/pcaversaccio/hardhat-project-template-ts/actions/workflows/test-contracts.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/license/mit)

## Installation

It is recommended to install [`pnpm`](https://pnpm.io) through the `npm` package manager, which comes bundled with [Node.js](https://nodejs.org/en) when you install it on your system. It is recommended to use a Node.js version `>= 20.0.0`.

Once you have `npm` installed, you can run the following both to install and upgrade `pnpm`:

```console
npm install -g pnpm
```

After having installed `pnpm`, simply run:

```console
pnpm install
```

## Running Deployments

> [!NOTE]
> The deployment script [`deploy.ts`](./scripts/deploy.ts) attempts to automatically verify the contract on the target chain after deployment. If you have not configured an API key, the verification will fail.

**Example Goerli:**

```console
pnpm deploy:goerli
```

> The deployment script [`deploy.ts`](./scripts/deploy.ts) includes the `tenderly` Hardhat Runtime Environment (HRE) extension with the `verify` method. Please consider uncommenting and configuring the Tenderly `project`, `username`, `forkNetwork`, `privateVerification`, and `deploymentsDir` attributes in the [`hardhat.config.ts`](./hardhat.config.ts) file before deploying or remove this call. Also, for this plugin to function you need to create a `config.yaml` file at `$HOME/.tenderly/config.yaml` or `%HOMEPATH%\.tenderly\config.yaml` and add an `access_key` field to it. For further information, see [here](https://www.npmjs.com/package/@tenderly/hardhat-tenderly#installing-tenderly-cli).

> For the deployment on the [ZKsync Era](https://docs.zksync.io/) test network, you must add your to-be-deployed contract artifact to [`deploy-zksync.ts`](./deploy/deploy-zksync.ts), enable `zksync` in the [`hardhat.config.ts`](./hardhat.config.ts#L121) file, and then run `pnpm compile` (in case you face any compilation issues, disable all configurations associated with the [`@tenderly/hardhat-tenderly`](https://github.com/Tenderly/hardhat-tenderly) plugin, including the `import` statement itself; see also [here](https://github.com/matter-labs/hardhat-zksync/issues/998) and [here](https://github.com/matter-labs/hardhat-zksync/issues/1174)). Next, fund your deployer account on ZKsync Era Testnet, setup the ZKsync-related configuration variables accordingly, and simply run `pnpm deploy:zksynctestnet`. Eventually, to verify the contract you can invoke: `npx hardhat verify --network zkSyncTestnet --constructor-args arguments.js <YOUR_CONTRACT_ADDRESS>`. The same approach applies if you want to deploy on the production network, except that you need to run `pnpm deploy:zksyncmain` and use `--network zkSyncMain` for the contract verification.

## Running `CREATE2` Deployments

```console
pnpm xdeploy
```

This template uses the [`xdeployer`](https://github.com/pcaversaccio/xdeployer) Hardhat plugin. Check out the documentation for more information on the specifics of the deployments.

## Configuration Variables

Run `npx hardhat vars set PRIVATE_KEY` to set the private key of your wallet. This allows secure access to your wallet to use with both testnet and mainnet funds during Hardhat deployments.

You can also run `npx hardhat vars setup` to see which other [configuration variables](https://hardhat.org/hardhat-runner/docs/guides/configuration-variables) are available.

## Using a Ledger Hardware Wallet

This template implements the [`hardhat-ledger`](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-ledger) plugin. Run `npx hardhat set LEDGER_ACCOUNT` and enter the address of the Ledger account you want to use.

## Using the Truffle Dashboard

> [!IMPORTANT]
> Truffle has been [sunsetted](https://consensys.io/blog/consensys-announces-the-sunset-of-truffle-and-ganache-and-new-hardhat) by Consensys, but I still keep it in the template as I find it a very valuable tool. Please note that due to the lengthy loading time of Truffle Dashboard's `npm` package [`@truffle/dashboard-hardhat-plugin`](https://www.npmjs.com/package/@truffle/dashboard-hardhat-plugin), the module is disabled by default in the [`hardhat.config.ts`](./hardhat.config.ts) file. If you want to use it, you must uncomment the module import and the `truffle` configuration accordingly.

[Truffle](https://archive.trufflesuite.com) developed the [Truffle Dashboard](https://archive.trufflesuite.com/docs/truffle/how-to/use-the-truffle-dashboard/) to provide an easy way to use your existing MetaMask wallet for your deployments and for other transactions that you need to send from a command line context. Because the Truffle Dashboard connects directly to MetaMask it is also possible to use it in combination with hardware wallets like [Ledger](https://www.ledger.com) or [Trezor](https://trezor.io).

First, it is recommended that you install Truffle globally by running:

```console
npm install -g truffle
```

> If you have already installed Truffle, you need to ensure that you have at least version [`5.11.5`](https://github.com/trufflesuite/truffle/releases/tag/v5.11.5) installed and otherwise upgrade.

To start a Truffle Dashboard, you need to run the following command in a separate terminal window:

```console
truffle dashboard
```

By default, the command above starts a Truffle Dashboard at `http://localhost:24012` and opens the Dashboard in a new tab in your default browser. The Dashboard then prompts you to connect your wallet and confirm that you're connected to the right network. **You should double check your connected network at this point, since switching to a different network during a deployment can have unintended consequences.**

Eventually, in order to deploy with the Truffle Dashboard, you can simply run:

```console
pnpm deploy:dashboard
```

## Mainnet Forking

You can start an instance of the Hardhat network that forks the mainnet. This means that it will simulate having the same state as the mainnet, but it will work as a local development network. That way you can interact with deployed protocols and test complex interactions locally. To use this feature, you need to connect to an archive node.

This template is currently configured via the [`hardhat.config.ts`](./hardhat.config.ts) as follows:

```ts
forking: {
  url: vars.get("ETH_MAINNET_URL", ethMainnetUrl),
  // The Hardhat network will by default fork from the latest mainnet block
  // To pin the block number, specify it below
  // You will need access to a node with archival data for this to work!
  // blockNumber: 14743877,
  // If you want to do some forking, set `enabled` to true
  enabled: false,
},
```

## Contract Verification

Change the contract address to your contract after the deployment has been successful. This works for both testnet and mainnet. You will need to get an API key from [etherscan](https://etherscan.io), [snowtrace](https://snowtrace.io) etc.

**Example:**

```console
npx hardhat verify --network fantomMain --constructor-args arguments.js <YOUR_CONTRACT_ADDRESS>
```

## Contract Interaction

This template includes an [example script](./scripts/interact.ts) that shows how to interact programmatically with a deployed contract. You must customise it according to your contract's specifications. The script can be simply invoked via:

```console
npx hardhat run scripts/interact.ts --network <network_name>
```

## Foundry

This template repository also includes the [Foundry](https://github.com/foundry-rs/foundry) toolkit as well as the [`@nomicfoundation/hardhat-foundry`](https://hardhat.org/hardhat-runner/docs/advanced/hardhat-and-foundry) plugin.

> If you need help getting started with Foundry, I recommend reading the [📖 Foundry Book](https://book.getfoundry.sh).

### Dependencies

```console
make update
```

or

```console
forge update
```

### Compilation

```console
make build
```

or

```console
forge build
```

### Testing

To run only TypeScript tests:

```console
pnpm test:hh
```

To run only Solidity tests:

```console
pnpm test:forge
```

or

```console
make test-forge
```

To additionally display the gas report, you can run:

```console
make test-gasreport
```

### Deployment and Etherscan Verification

Inside the [`scripts/`](./scripts) folder are a few preconfigured scripts that can be used to deploy and verify contracts via Foundry. These scripts are required to be _executable_ meaning they must be made executable by running:

```console
make scripts
```
