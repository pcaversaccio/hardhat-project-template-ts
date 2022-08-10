import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "xdeployer";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer";
import * as tdly from "@tenderly/hardhat-tenderly";
import "hardhat-abi-exporter";

dotenv.config();

// Turning off the automatic Tenderly verification
tdly.setup({ automaticVerifications: false });

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task(
  "balances",
  "Prints the list of accounts and their balances",
  async (_, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
      console.log(
        account.address +
          " " +
          (await hre.ethers.provider.getBalance(account.address))
      );
    }
  }
);

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
      chainId: 31337,
      forking: {
        url: process.env.ETH_MAINNET_URL || "",
        // The Hardhat network will by default fork from the latest mainnet block
        // To pin the block number, specify it below
        // You will need access to a node with archival data for this to work!
        // blockNumber: 14743877,
        // If you want to do some forking, set `enabled` to true
        enabled: false,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    "truffle-dashboard": {
      url: "http://localhost:24012/rpc",
    },
    tenderly: {
      url: `https://rpc.tenderly.co/fork/${process.env.TENDERLY_FORK_ID}`,
    },
    rinkeby: {
      chainId: 4,
      url: process.env.ETH_RINKEBY_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    kovan: {
      chainId: 42,
      url: process.env.ETH_KOVAN_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ropsten: {
      chainId: 3,
      url: process.env.ETH_ROPSTEN_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    goerli: {
      chainId: 5,
      url: process.env.ETH_GOERLI_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    sepolia: {
      chainId: 11155111,
      url: process.env.ETH_SEPOLIA_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ethMain: {
      chainId: 1,
      url: process.env.ETH_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bscTestnet: {
      chainId: 97,
      url: process.env.BSC_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bscMain: {
      chainId: 56,
      url: process.env.BSC_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    optimismTestnet: {
      chainId: 69,
      url: process.env.OPTIMISM_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    optimismMain: {
      chainId: 10,
      url: process.env.OPTIMISM_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrumTestnet: {
      chainId: 421613,
      url: process.env.ARBITRUM_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrumMain: {
      chainId: 42161,
      url: process.env.ARBITRUM_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrumNova: {
      chainId: 42170,
      url: process.env.ARBITRUM_NOVA_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      chainId: 80001,
      url: process.env.POLYGON_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    polygon: {
      chainId: 137,
      url: process.env.POLYGON_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    hecoTestnet: {
      chainId: 256,
      url: process.env.HECO_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    hecoMain: {
      chainId: 128,
      url: process.env.HECO_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fantomTestnet: {
      chainId: 4002,
      url: process.env.FANTOM_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fantomMain: {
      chainId: 250,
      url: process.env.FANTOM_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fuji: {
      chainId: 43113,
      url: process.env.AVALANCHE_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    avalanche: {
      chainId: 43114,
      url: process.env.AVALANCHE_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    sokol: {
      chainId: 77,
      url: process.env.GNOSIS_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    gnosis: {
      chainId: 100,
      url: process.env.GNOSIS_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    moonbaseAlpha: {
      chainId: 1287,
      url: process.env.MOONBEAM_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    moonriver: {
      chainId: 1285,
      url: process.env.MOONRIVER_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    moonbeam: {
      chainId: 1284,
      url: process.env.MOONBEAM_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    alfajores: {
      chainId: 44787,
      url: process.env.CELO_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    celo: {
      chainId: 42220,
      url: process.env.CELO_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    auroraTestnet: {
      chainId: 1313161555,
      url: process.env.AURORA_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    auroraMain: {
      chainId: 1313161554,
      url: process.env.AURORA_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    harmonyTestnet: {
      chainId: 1666700000,
      url: process.env.HARMONY_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    harmonyMain: {
      chainId: 1666600000,
      url: process.env.HARMONY_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    autobahn: {
      chainId: 45000,
      url: process.env.AUTOBAHN_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    spark: {
      chainId: 123,
      url: process.env.FUSE_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fuse: {
      chainId: 122,
      url: process.env.FUSE_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    cronosTestnet: {
      chainId: 338,
      url: process.env.CRONOS_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    cronosMain: {
      chainId: 25,
      url: process.env.CRONOS_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    evmosTestnet: {
      chainId: 9000,
      url: process.env.EVMOS_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    evmosMain: {
      chainId: 9001,
      url: process.env.EVMOS_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bobaTestnet: {
      chainId: 28,
      url: process.env.BOBA_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bobaMain: {
      chainId: 288,
      url: process.env.BOBA_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  xdeploy: {
    // Change this name to the name of your main contract
    // Does not necessarily have to match the contract file name
    contract: "Greeter",

    // Change to `undefined` if your constructor does not have any input arguments
    constructorArgsPath: "./deploy-args.ts",

    // The salt must be the same for each EVM chain for which you want to have a single contract address
    // Change the salt if you are doing a re-deployment with the same codebase
    salt: process.env.SALT,

    // This is your wallet's private key
    signer: process.env.PRIVATE_KEY,

    // Use the network names specified here: https://github.com/pcaversaccio/xdeployer#configuration
    // Use `localhost` or `hardhat` for local testing
    networks: ["hardhat", "rinkeby", "bscTestnet"],

    // Use the matching env URL with your chosen RPC in the `.env` file
    rpcUrls: [
      "hardhat",
      process.env.ETH_RINKEBY_TESTNET_URL,
      process.env.BSC_TESTNET_URL,
    ],

    // Maximum limit is 15 * 10 ** 6 or 15,000,000. If the deployments are failing, try increasing this number
    // However, keep in mind that this costs money in a production environment!
    gasLimit: 1.2 * 10 ** 6,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
    strict: true,
    only: [],
    except: [],
  },
  abiExporter: {
    path: "./abis",
    runOnCompile: true,
    clear: true,
    flat: false,
    only: [],
    spacing: 2,
    pretty: true,
  },
  etherscan: {
    apiKey: {
      // For Mainnet, Ropsten, Rinkeby, Goerli, Kovan, Sepolia
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      ropsten: process.env.ETHERSCAN_API_KEY || "",
      rinkeby: process.env.ETHERSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
      kovan: process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      // For BSC testnet & mainnet
      bsc: process.env.BSC_API_KEY || "",
      bscTestnet: process.env.BSC_API_KEY || "",
      // For Heco testnet & mainnet
      heco: process.env.HECO_API_KEY || "",
      hecoTestnet: process.env.HECO_API_KEY || "",
      // For Fantom testnet & mainnet
      opera: process.env.FANTOM_API_KEY || "",
      ftmTestnet: process.env.FANTOM_API_KEY || "",
      // For Optimism testnets & mainnet; we use the same
      // string placeholder for Optimism Goerli as for xdai and sokol
      optimisticEthereum: process.env.OPTIMISM_API_KEY || "",
      optimisticKovan: process.env.OPTIMISM_API_KEY || "",
      optimisticGoerli: "wagmi",
      // For Polygon testnet & mainnet
      polygon: process.env.POLYGON_API_KEY || "",
      polygonMumbai: process.env.POLYGON_API_KEY || "",
      // For Arbitrum testnet & mainnets; we use the same
      // string placeholder for Arbitrum Nova as for xdai and sokol
      arbitrumOne: process.env.ARBITRUM_API_KEY || "",
      arbitrumNova: "wagmi",
      arbitrumTestnet: process.env.ARBITRUM_API_KEY || "",
      // For Avalanche testnet & mainnet
      avalanche: process.env.AVALANCHE_API_KEY || "",
      avalancheFujiTestnet: process.env.AVALANCHE_API_KEY || "",
      // For Moonbeam testnet & mainnets
      moonbeam: process.env.MOONBEAM_API_KEY || "",
      moonriver: process.env.MOONBEAM_API_KEY || "",
      moonbaseAlpha: process.env.MOONBEAM_API_KEY || "",
      // For Harmony testnet & mainnet
      harmony: process.env.HARMONY_API_KEY || "",
      harmonyTest: process.env.HARMONY_API_KEY || "",
      // For Aurora testnet & mainnet
      aurora: process.env.AURORA_API_KEY || "",
      auroraTestnet: process.env.AURORA_API_KEY || "",
      // For Cronos testnet & mainnet
      cronos: process.env.CRONOS_API_KEY || "",
      cronosTestnet: process.env.CRONOS_API_KEY || "",
      // xdai and sokol don't need an API key, but you still need
      // to specify one; any string placeholder will work
      xdai: "wagmi",
      sokol: "wagmi",
      // For Fuse testnet; we use the same string placeholder as for
      // xdai and sokol
      spark: "wagmi",
      // For Evmos testnet & mainnet; we use the same string placeholder
      // as for xdai and sokol
      evmos: "wagmi",
      evmosTestnet: "wagmi",
      // For Boba network testnet & mainnet
      boba: process.env.BOBA_API_KEY || "",
      bobaTestnet: process.env.BOBA_API_KEY || "",
    },
    customChains: [
      {
        network: "cronos",
        chainId: 25,
        urls: {
          apiURL: "https://api.cronoscan.com/api",
          browserURL: "https://cronoscan.com",
        },
      },
      {
        network: "cronosTestnet",
        chainId: 338,
        urls: {
          apiURL: "https://api-testnet.cronoscan.com/api",
          browserURL: "https://testnet.cronoscan.com",
        },
      },
      {
        network: "optimisticGoerli",
        chainId: 420,
        urls: {
          apiURL: "https://blockscout.com/optimism/goerli/api",
          browserURL: "https://blockscout.com/optimism/goerli",
        },
      },
      {
        network: "spark",
        chainId: 123,
        urls: {
          apiURL: "https://explorer.fusespark.io/api",
          browserURL: "https://explorer.fusespark.io",
        },
      },
      {
        network: "evmos",
        chainId: 9001,
        urls: {
          apiURL: "https://evm.evmos.org/api",
          browserURL: "https://evm.evmos.org",
        },
      },
      {
        network: "evmosTestnet",
        chainId: 9000,
        urls: {
          apiURL: "https://evm.evmos.dev/api",
          browserURL: "https://evm.evmos.dev",
        },
      },
      {
        network: "boba",
        chainId: 288,
        urls: {
          apiURL: "https://api.bobascan.com/api",
          browserURL: "https://bobascan.com",
        },
      },
      {
        network: "bobaTestnet",
        chainId: 28,
        urls: {
          apiURL: "https://api-testnet.bobascan.com/api",
          browserURL: "https://testnet.bobascan.com",
        },
      },
      {
        network: "arbitrumNova",
        chainId: 42170,
        urls: {
          apiURL: "https://nova-explorer.arbitrum.io/api",
          browserURL: "https://nova-explorer.arbitrum.io",
        },
      },
      {
        network: "arbitrumTestnet",
        chainId: 421613,
        urls: {
          apiURL: "https://goerli-rollup-explorer.arbitrum.io/api",
          browserURL: "https://goerli-rollup-explorer.arbitrum.io",
        },
      },
    ],
  },
  tenderly: {
    username: "MyAwesomeUsername",
    project: "super-awesome-project",
    forkNetwork: "",
    privateVerification: false,
    deploymentsDir: "deployments_tenderly",
  },
};

export default config;
