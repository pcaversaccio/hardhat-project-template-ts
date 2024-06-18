import { HardhatUserConfig, task, vars } from "hardhat/config";

import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-ledger";
import "@nomicfoundation/hardhat-foundry";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ignition-ethers";
import "@typechain/hardhat";

import "xdeployer";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-verify";
import "@matterlabs/hardhat-zksync-ethers";
// Uncomment if you want to use the Truffle Dashboard module
// You must also uncomment the subsequent `truffle` configuration in this file accordingly
// import "@truffle/dashboard-hardhat-plugin";
import "hardhat-gas-reporter";
import "hardhat-abi-exporter";
import "solidity-coverage";
import "hardhat-contract-sizer";
import * as tdly from "@tenderly/hardhat-tenderly";

// Turning off the automatic Tenderly verification
tdly.setup({ automaticVerifications: false });

const ethMainnetUrl = vars.get("ETH_MAINNET_URL", "https://rpc.ankr.com/eth");
const accounts = [
  vars.get(
    "PRIVATE_KEY",
    // `keccak256("DEFAULT_VALUE")`
    "0x0d1706281056b7de64efd2088195fa8224c39103f578c9b84f951721df3fa71c",
  ),
];
const ledgerAccounts = [
  vars.get(
    "LEDGER_ACCOUNT",
    // `bytes20(uint160(uint256(keccak256("DEFAULT_VALUE"))))`
    "0x8195fa8224c39103f578c9b84f951721df3fa71c",
  ),
];

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("evm", "Prints the configured EVM version", async (_, hre) => {
  console.log(hre.config.solidity.compilers[0].settings.evmVersion);
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
          (await hre.ethers.provider.getBalance(account.address)),
      );
    }
  },
);

const config: HardhatUserConfig = {
  paths: {
    sources: "./contracts/src",
  },
  solidity: {
    // Only use Solidity default versions `>=0.8.25` for EVM networks that support the new `cancun` opcodes:
    // https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/cancun.md
    // Only use Solidity default versions `>=0.8.20` for EVM networks that support the opcode `PUSH0`
    // Otherwise, use the versions `<=0.8.19`
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 999_999,
      },
      evmVersion: "paris", // Prevent using the `PUSH0` and `cancun` opcodes
    },
  },
  zksolc: {
    version: "1.4.1",
    compilerSource: "binary",
    settings: {
      isSystem: false,
      forceEvmla: false,
      optimizer: {
        enabled: true,
        mode: "3",
        fallback_to_optimizing_for_size: false,
      },
    },
  },
  // Uncomment if you want to use the Truffle Dashboard module
  // truffle: {
  //   dashboardNetworkName: "truffleDashboard", // Truffle's default value is "truffleDashboard"
  //   dashboardNetworkConfig: {
  //     // Truffle's default value is 0 (i.e. no timeout), while Hardhat's default
  //     // value is 40000 (40 seconds)
  //     timeout: 0,
  //   },
  // },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
      chainId: 31337,
      hardfork: "cancun",
      forking: {
        url: vars.get("ETH_MAINNET_URL", ethMainnetUrl),
        // The Hardhat network will by default fork from the latest mainnet block
        // To pin the block number, specify it below
        // You will need access to a node with archival data for this to work!
        // blockNumber: 14743877,
        // If you want to do some forking, set `enabled` to true
        enabled: false,
      },
      ledgerAccounts,
      // zksync: true, // Enable zkSync in the Hardhat local network
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      ledgerAccounts,
    },
    tenderly: {
      // Add your own Tenderly fork ID
      url: `https://rpc.tenderly.co/fork/${vars.get("TENDERLY_FORK_ID", "")}`,
      ledgerAccounts,
    },
    devnet: {
      // Add your own Tenderly DevNet ID
      url: `https://rpc.vnet.tenderly.co/devnet/${vars.get(
        "TENDERLY_DEVNET_ID",
        "",
      )}`,
      accounts,
      ledgerAccounts,
    },
    goerli: {
      chainId: 5,
      url: vars.get(
        "ETH_GOERLI_TESTNET_URL",
        "https://rpc.ankr.com/eth_goerli",
      ),
      accounts,
      ledgerAccounts,
    },
    sepolia: {
      chainId: 11155111,
      url: vars.get("ETH_SEPOLIA_TESTNET_URL", "https://rpc.sepolia.org"),
      accounts,
      ledgerAccounts,
    },
    holesky: {
      chainId: 17000,
      url: vars.get(
        "ETH_HOLESKY_TESTNET_URL",
        "https://holesky.rpc.thirdweb.com",
      ),
      accounts,
      ledgerAccounts,
    },
    ethMain: {
      chainId: 1,
      url: ethMainnetUrl,
      accounts,
      ledgerAccounts,
    },
    bscTestnet: {
      chainId: 97,
      url: vars.get(
        "BSC_TESTNET_URL",
        "https://data-seed-prebsc-1-s1.binance.org:8545",
      ),
      accounts,
      ledgerAccounts,
    },
    bscMain: {
      chainId: 56,
      url: vars.get("BSC_MAINNET_URL", "https://bsc-dataseed1.binance.org"),
      accounts,
      ledgerAccounts,
    },
    optimismTestnet: {
      chainId: 420,
      url: vars.get("OPTIMISM_TESTNET_URL", "https://goerli.optimism.io"),
      accounts,
      ledgerAccounts,
    },
    optimismSepolia: {
      chainId: 11155420,
      url: vars.get("OPTIMISM_SEPOLIA_URL", "https://sepolia.optimism.io"),
      accounts,
      ledgerAccounts,
    },
    optimismMain: {
      chainId: 10,
      url: vars.get("OPTIMISM_MAINNET_URL", "https://mainnet.optimism.io"),
      accounts,
      ledgerAccounts,
    },
    arbitrumSepolia: {
      chainId: 421614,
      url: vars.get(
        "ARBITRUM_SEPOLIA_URL",
        "https://sepolia-rollup.arbitrum.io/rpc",
      ),
      accounts,
      ledgerAccounts,
    },
    arbitrumMain: {
      chainId: 42161,
      url: vars.get("ARBITRUM_MAINNET_URL", "https://arb1.arbitrum.io/rpc"),
      accounts,
      ledgerAccounts,
    },
    arbitrumNova: {
      chainId: 42170,
      url: vars.get("ARBITRUM_NOVA_URL", "https://nova.arbitrum.io/rpc"),
      accounts,
      ledgerAccounts,
    },
    amoy: {
      chainId: 80002,
      url: vars.get(
        "POLYGON_TESTNET_URL",
        "https://rpc-amoy.polygon.technology",
      ),
      accounts,
      ledgerAccounts,
    },
    polygonZkEVMTestnet: {
      chainId: 2442,
      url: vars.get(
        "POLYGON_ZKEVM_TESTNET_URL",
        "https://rpc.cardona.zkevm-rpc.com",
      ),
      accounts,
      ledgerAccounts,
    },
    polygon: {
      chainId: 137,
      url: vars.get("POLYGON_MAINNET_URL", "https://polygon-rpc.com"),
      accounts,
      ledgerAccounts,
    },
    polygonZkEVMMain: {
      chainId: 1101,
      url: vars.get("POLYGON_ZKEVM_MAINNET_URL", "https://zkevm-rpc.com"),
      accounts,
      ledgerAccounts,
    },
    hecoMain: {
      chainId: 128,
      url: vars.get("HECO_MAINNET_URL", "https://http-mainnet.hecochain.com"),
      accounts,
      ledgerAccounts,
    },
    fantomTestnet: {
      chainId: 4002,
      url: vars.get("FANTOM_TESTNET_URL", "https://rpc.testnet.fantom.network"),
      accounts,
      ledgerAccounts,
    },
    fantomMain: {
      chainId: 250,
      url: vars.get("FANTOM_MAINNET_URL", "https://rpc.ankr.com/fantom"),
      accounts,
      ledgerAccounts,
    },
    fuji: {
      chainId: 43113,
      url: vars.get(
        "AVALANCHE_TESTNET_URL",
        "https://api.avax-test.network/ext/bc/C/rpc",
      ),
      accounts,
      ledgerAccounts,
    },
    avalanche: {
      chainId: 43114,
      url: vars.get(
        "AVALANCHE_MAINNET_URL",
        "https://api.avax.network/ext/bc/C/rpc",
      ),
      accounts,
      ledgerAccounts,
    },
    chiado: {
      chainId: 10200,
      url: vars.get("GNOSIS_TESTNET_URL", "https://rpc.chiadochain.net"),
      accounts,
      ledgerAccounts,
    },
    gnosis: {
      chainId: 100,
      url: vars.get("GNOSIS_MAINNET_URL", "https://rpc.gnosischain.com"),
      accounts,
      ledgerAccounts,
    },
    moonbaseAlpha: {
      chainId: 1287,
      url: vars.get(
        "MOONBEAM_TESTNET_URL",
        "https://rpc.api.moonbase.moonbeam.network",
      ),
      accounts,
      ledgerAccounts,
    },
    moonriver: {
      chainId: 1285,
      url: vars.get(
        "MOONRIVER_MAINNET_URL",
        "https://moonriver.public.blastapi.io",
      ),
      accounts,
      ledgerAccounts,
    },
    moonbeam: {
      chainId: 1284,
      url: vars.get(
        "MOONBEAM_MAINNET_URL",
        "https://moonbeam.public.blastapi.io",
      ),
      accounts,
      ledgerAccounts,
    },
    alfajores: {
      chainId: 44787,
      url: vars.get(
        "CELO_TESTNET_URL",
        "https://alfajores-forno.celo-testnet.org",
      ),
      accounts,
      ledgerAccounts,
    },
    celo: {
      chainId: 42220,
      url: vars.get("CELO_MAINNET_URL", "https://forno.celo.org"),
      accounts,
      ledgerAccounts,
    },
    auroraTestnet: {
      chainId: 1313161555,
      url: vars.get("AURORA_TESTNET_URL", "https://testnet.aurora.dev"),
      accounts,
      ledgerAccounts,
    },
    auroraMain: {
      chainId: 1313161554,
      url: vars.get("AURORA_MAINNET_URL", "https://mainnet.aurora.dev"),
      accounts,
      ledgerAccounts,
    },
    harmonyTestnet: {
      chainId: 1666700000,
      url: vars.get("HARMONY_TESTNET_URL", "https://api.s0.b.hmny.io"),
      accounts,
      ledgerAccounts,
    },
    harmonyMain: {
      chainId: 1666600000,
      url: vars.get("HARMONY_MAINNET_URL", "https://api.harmony.one"),
      accounts,
      ledgerAccounts,
    },
    spark: {
      chainId: 123,
      url: vars.get("FUSE_TESTNET_URL", "https://rpc.fusespark.io"),
      accounts,
      ledgerAccounts,
    },
    fuse: {
      chainId: 122,
      url: vars.get("FUSE_MAINNET_URL", "https://rpc.fuse.io"),
      accounts,
      ledgerAccounts,
    },
    cronosTestnet: {
      chainId: 338,
      url: vars.get("CRONOS_TESTNET_URL", "https://evm-t3.cronos.org"),
      accounts,
      ledgerAccounts,
    },
    cronosMain: {
      chainId: 25,
      url: vars.get("CRONOS_MAINNET_URL", "https://evm.cronos.org"),
      accounts,
      ledgerAccounts,
    },
    evmosTestnet: {
      chainId: 9000,
      url: vars.get("EVMOS_TESTNET_URL", "https://evmos-testnet.lava.build"),
      accounts,
      ledgerAccounts,
    },
    evmosMain: {
      chainId: 9001,
      url: vars.get("EVMOS_MAINNET_URL", "https://evmos.lava.build"),
      accounts,
      ledgerAccounts,
    },
    bobaTestnet: {
      chainId: 2888,
      url: vars.get("BOBA_TESTNET_URL", "https://goerli.boba.network"),
      accounts,
      ledgerAccounts,
    },
    bobaMain: {
      chainId: 288,
      url: vars.get("BOBA_MAINNET_URL", "https://replica.boba.network"),
      accounts,
      ledgerAccounts,
    },
    cantoTestnet: {
      chainId: 7701,
      url: vars.get("CANTO_TESTNET_URL", "https://canto-testnet.plexnode.wtf"),
      accounts,
      ledgerAccounts,
    },
    cantoMain: {
      chainId: 7700,
      url: vars.get("CANTO_MAINNET_URL", "https://canto.slingshot.finance"),
      accounts,
      ledgerAccounts,
    },
    baseTestnet: {
      chainId: 84531,
      url: vars.get("BASE_TESTNET_URL", "https://goerli.base.org"),
      accounts,
      ledgerAccounts,
    },
    baseSepolia: {
      chainId: 84532,
      url: vars.get("BASE_SEPOLIA_URL", "https://sepolia.base.org"),
      accounts,
      ledgerAccounts,
    },
    baseMain: {
      chainId: 8453,
      url: vars.get("BASE_MAINNET_URL", "https://mainnet.base.org"),
      accounts,
      ledgerAccounts,
    },
    zkSyncTestnet: {
      chainId: 300,
      url: vars.get("ZKSYNC_TESTNET_URL", "https://sepolia.era.zksync.dev"),
      ethNetwork: "sepolia",
      zksync: true,
      verifyURL:
        "https://explorer.sepolia.era.zksync.dev/contract_verification",
      accounts,
      ledgerAccounts,
    },
    zkSyncMain: {
      chainId: 324,
      url: vars.get("ZKSYNC_MAINNET_URL", "https://mainnet.era.zksync.io"),
      ethNetwork: "mainnet",
      zksync: true,
      verifyURL:
        "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
      accounts,
      ledgerAccounts,
    },
    mantleTestnet: {
      chainId: 5003,
      url: vars.get("MANTLE_TESTNET_URL", "https://rpc.sepolia.mantle.xyz"),
      accounts,
      ledgerAccounts,
    },
    mantleMain: {
      chainId: 5000,
      url: vars.get("MANTLE_MAINNET_URL", "https://rpc.mantle.xyz"),
      accounts,
      ledgerAccounts,
    },
    filecoinTestnet: {
      chainId: 314159,
      url: vars.get(
        "FILECOIN_TESTNET_URL",
        "https://rpc.ankr.com/filecoin_testnet",
      ),
      accounts,
      ledgerAccounts,
    },
    filecoinMain: {
      chainId: 314,
      url: vars.get("FILECOIN_MAINNET_URL", "https://rpc.ankr.com/filecoin"),
      accounts,
      ledgerAccounts,
    },
    scrollTestnet: {
      chainId: 534351,
      url: vars.get("SCROLL_TESTNET_URL", "https://sepolia-rpc.scroll.io"),
      accounts,
      ledgerAccounts,
    },
    scrollMain: {
      chainId: 534352,
      url: vars.get("SCROLL_MAINNET_URL", "https://rpc.scroll.io"),
      accounts,
      ledgerAccounts,
    },
    lineaTestnet: {
      chainId: 59141,
      url: vars.get("LINEA_TESTNET_URL", "https://rpc.sepolia.linea.build"),
      accounts,
      ledgerAccounts,
    },
    lineaMain: {
      chainId: 59144,
      url: vars.get("LINEA_MAINNET_URL", "https://rpc.linea.build"),
      accounts,
      ledgerAccounts,
    },
    shimmerEVMTestnet: {
      chainId: 1071,
      url: vars.get(
        "SHIMMEREVM_TESTNET_URL",
        "https://json-rpc.evm.testnet.shimmer.network",
      ),
      accounts,
      ledgerAccounts,
    },
    zoraTestnet: {
      chainId: 999999999,
      url: vars.get("ZORA_TESTNET_URL", "https://sepolia.rpc.zora.energy"),
      accounts,
      ledgerAccounts,
    },
    zoraMain: {
      chainId: 7777777,
      url: vars.get("ZORA_MAINNET_URL", "https://rpc.zora.energy"),
      accounts,
      ledgerAccounts,
    },
    luksoTestnet: {
      chainId: 4201,
      url: vars.get("LUKSO_TESTNET_URL", "https://rpc.testnet.lukso.network"),
      accounts,
      ledgerAccounts,
    },
    luksoMain: {
      chainId: 42,
      url: vars.get("LUKSO_MAINNET_URL", "https://rpc.lukso.gateway.fm"),
      accounts,
      ledgerAccounts,
    },
    mantaTestnet: {
      chainId: 3441005,
      url: vars.get(
        "MANTA_TESTNET_URL",
        "https://pacific-rpc.testnet.manta.network/http",
      ),
      accounts,
      ledgerAccounts,
    },
    mantaMain: {
      chainId: 169,
      url: vars.get(
        "MANTA_MAINNET_URL",
        "https://pacific-rpc.manta.network/http",
      ),
      accounts,
      ledgerAccounts,
    },
    shardeumTestnet: {
      chainId: 8081,
      url: vars.get("SHARDEUM_TESTNET_URL", "https://dapps.shardeum.org"),
      accounts,
      ledgerAccounts,
    },
    artheraTestnet: {
      chainId: 10243,
      url: vars.get("ARTHERA_TESTNET_URL", "https://rpc-test.arthera.net"),
      accounts,
      ledgerAccounts,
    },
    frameTestnet: {
      chainId: 68840142,
      url: vars.get("FRAME_TESTNET_URL", "https://rpc.testnet.frame.xyz/http"),
      accounts,
      ledgerAccounts,
    },
    enduranceTestnet: {
      chainId: 6480,
      url: vars.get(
        "ENDURANCE_TESTNET_URL",
        "https://myrpctestnet.fusionist.io",
      ),
      accounts,
      ledgerAccounts,
    },
    openduranceTestnet: {
      chainId: 6480001001,
      url: vars.get(
        "OPENDURANCE_TESTNET_URL",
        "https://rpc-l2-testnet.fusionist.io",
      ),
      accounts,
      ledgerAccounts,
    },
    enduranceMain: {
      chainId: 648,
      url: vars.get(
        "ENDURANCE_MAINNET_URL",
        "https://rpc-endurance.fusionist.io",
      ),
      accounts,
      ledgerAccounts,
    },
    blastTestnet: {
      chainId: 168587773,
      url: vars.get("BLAST_TESTNET_URL", "https://sepolia.blast.io"),
      accounts,
      ledgerAccounts,
    },
    blastMain: {
      chainId: 81457,
      url: vars.get("BLAST_MAINNET_URL", "https://rpc.blast.io"),
      accounts,
      ledgerAccounts,
    },
    kromaTestnet: {
      chainId: 2358,
      url: vars.get("KROMA_TESTNET_URL", "https://api.sepolia.kroma.network"),
      accounts,
      ledgerAccounts,
    },
    kromaMain: {
      chainId: 255,
      url: vars.get("KROMA_MAINNET_URL", "https://api.kroma.network"),
      accounts,
      ledgerAccounts,
    },
    dosTestnet: {
      chainId: 3939,
      url: vars.get("DOS_TESTNET_URL", "https://test.doschain.com"),
      accounts,
      ledgerAccounts,
    },
    dosMain: {
      chainId: 7979,
      url: vars.get("DOS_MAINNET_URL", "https://main.doschain.com"),
      accounts,
      ledgerAccounts,
    },
    fraxtalTestnet: {
      chainId: 2522,
      url: vars.get("FRAXTAL_TESTNET_URL", "https://rpc.testnet.frax.com"),
      accounts,
      ledgerAccounts,
    },
    fraxtalMain: {
      chainId: 252,
      url: vars.get("FRAXTAL_MAINNET_URL", "https://rpc.frax.com"),
      accounts,
      ledgerAccounts,
    },
    kavaMain: {
      chainId: 2222,
      url: vars.get("KAVA_MAINNET_URL", "https://evm.kava-rpc.com"),
      accounts,
      ledgerAccounts,
    },
    metisTestnet: {
      chainId: 59902,
      url: vars.get("METIS_TESTNET_URL", "https://sepolia.metisdevops.link"),
      accounts,
      ledgerAccounts,
    },
    metisMain: {
      chainId: 1088,
      url: vars.get(
        "METIS_MAINNET_URL",
        "https://andromeda.metis.io/?owner=1088",
      ),
      accounts,
      ledgerAccounts,
    },
    modeTestnet: {
      chainId: 919,
      url: vars.get("MODE_TESTNET_URL", "https://sepolia.mode.network"),
      accounts,
      ledgerAccounts,
    },
    modeMain: {
      chainId: 34443,
      url: vars.get("MODE_MAINNET_URL", "https://mainnet.mode.network"),
      accounts,
      ledgerAccounts,
    },
    seiTestnet: {
      chainId: 713715,
      url: vars.get("SEI_TESTNET_URL", "https://evm-rpc-arctic-1.sei-apis.com"),
      accounts,
      ledgerAccounts,
    },
    xlayerTestnet: {
      chainId: 195,
      url: vars.get("XLAYER_TESTNET_URL", "https://testrpc.xlayer.tech"),
      accounts,
      ledgerAccounts,
    },
    xlayerMain: {
      chainId: 196,
      url: vars.get("XLAYER_MAINNET_URL", "https://rpc.xlayer.tech"),
      accounts,
      ledgerAccounts,
    },
    bobTestnet: {
      chainId: 111,
      url: vars.get("BOB_TESTNET_URL", "https://testnet.rpc.gobob.xyz"),
      accounts,
      ledgerAccounts,
    },
    bobMain: {
      chainId: 60808,
      url: vars.get("BOB_MAINNET_URL", "https://rpc.gobob.xyz"),
      accounts,
      ledgerAccounts,
    },
    coreTestnet: {
      chainId: 1115,
      url: vars.get("CORE_TESTNET_URL", "https://rpc.test.btcs.network"),
      accounts,
      ledgerAccounts,
    },
    coreMain: {
      chainId: 1116,
      url: vars.get("CORE_MAINNET_URL", "https://rpc.coredao.org"),
      accounts,
      ledgerAccounts,
    },
    telosTestnet: {
      chainId: 41,
      url: vars.get("TELOS_TESTNET_URL", "https://testnet.telos.net/evm"),
      accounts,
      ledgerAccounts,
    },
    telosMain: {
      chainId: 40,
      url: vars.get("TELOS_MAINNET_URL", "https://mainnet.telos.net/evm"),
      accounts,
      ledgerAccounts,
    },
    rootstockTestnet: {
      chainId: 31,
      url: vars.get(
        "ROOTSTOCK_TESTNET_URL",
        "https://public-node.testnet.rsk.co",
      ),
      accounts,
      ledgerAccounts,
    },
    rootstockMain: {
      chainId: 30,
      url: vars.get("ROOTSTOCK_MAINNET_URL", "https://public-node.rsk.co"),
      accounts,
      ledgerAccounts,
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
    salt: vars.get(
      "SALT",
      // `keccak256("SALT")`
      "0x087ee6a43229fddc3e140062b42bcff0c6d1c5a3bba8123976a59688e7024c25",
    ),

    // This is your wallet's private key
    signer: accounts[0],

    // Use the network names specified here: https://github.com/pcaversaccio/xdeployer#configuration
    // Use `localhost` or `hardhat` for local testing
    networks: ["hardhat", "sepolia", "optimismSepolia"],

    // Use the matching env URL with your chosen RPC in the `.env` file
    rpcUrls: [
      "hardhat",
      vars.get("ETH_SEPOLIA_TESTNET_URL", "https://rpc.sepolia.org"),
      vars.get("OPTIMISM_SEPOLIA_URL", "https://sepolia.optimism.io"),
    ],

    // Maximum limit is 15 * 10 ** 6 or 15,000,000. If the deployments are failing, try increasing this number
    // However, keep in mind that this costs money in a production environment!
    gasLimit: 1.2 * 10 ** 6,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
    strict: true,
    only: [],
    except: ["CreateX", "Create2DeployerLocal"],
  },
  gasReporter: {
    enabled: vars.has("REPORT_GAS") ? true : false,
    currency: "USD",
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
  sourcify: {
    // Enable Sourcify verification by default
    enabled: true,
    apiUrl: "https://sourcify.dev/server",
    browserUrl: "https://repo.sourcify.dev",
  },
  etherscan: {
    // Add your own API key by getting an account at etherscan (https://etherscan.io), snowtrace (https://snowtrace.io) etc.
    // This is used for verification purposes when you want to `npx hardhat verify` your contract using Hardhat
    // The same API key works usually for both testnet and mainnet
    apiKey: {
      // For Ethereum testnets & mainnet
      mainnet: vars.get("ETHERSCAN_API_KEY", ""),
      goerli: vars.get("ETHERSCAN_API_KEY", ""),
      sepolia: vars.get("ETHERSCAN_API_KEY", ""),
      holesky: vars.get("ETHERSCAN_API_KEY", ""),
      // For BSC testnet & mainnet
      bsc: vars.get("BSC_API_KEY", ""),
      bscTestnet: vars.get("BSC_API_KEY", ""),
      // For Heco mainnet
      heco: vars.get("HECO_API_KEY", ""),
      // For Fantom testnet & mainnet
      opera: vars.get("FANTOM_API_KEY", ""),
      ftmTestnet: vars.get("FANTOM_API_KEY", ""),
      // For Optimism testnets & mainnet
      optimisticEthereum: vars.get("OPTIMISM_API_KEY", ""),
      optimisticGoerli: vars.get("OPTIMISM_API_KEY", ""),
      optimisticSepolia: vars.get("OPTIMISM_API_KEY", ""),
      // For Polygon testnets & mainnets
      polygon: vars.get("POLYGON_API_KEY", ""),
      polygonZkEVM: vars.get("POLYGON_ZKEVM_API_KEY", ""),
      polygonAmoy: vars.get("POLYGON_API_KEY", ""),
      polygonZkEVMTestnet: vars.get("POLYGON_ZKEVM_API_KEY", ""),
      // For Arbitrum testnet & mainnets
      arbitrumOne: vars.get("ARBITRUM_API_KEY", ""),
      arbitrumNova: vars.get("ARBITRUM_API_KEY", ""),
      arbitrumSepolia: vars.get("ARBITRUM_API_KEY", ""),
      // For Avalanche testnet & mainnet
      avalanche: vars.get("AVALANCHE_API_KEY", ""),
      avalancheFujiTestnet: vars.get("AVALANCHE_API_KEY", ""),
      // For Moonbeam testnet & mainnets
      moonbeam: vars.get("MOONBEAM_API_KEY", ""),
      moonriver: vars.get("MOONBEAM_API_KEY", ""),
      moonbaseAlpha: vars.get("MOONBEAM_API_KEY", ""),
      // For Celo testnet & mainnet
      celo: vars.get("CELO_API_KEY", ""),
      alfajores: vars.get("CELO_API_KEY", ""),
      // For Harmony testnet & mainnet
      harmony: vars.get("HARMONY_API_KEY", ""),
      harmonyTest: vars.get("HARMONY_API_KEY", ""),
      // For Aurora testnet & mainnet
      aurora: vars.get("AURORA_API_KEY", ""),
      auroraTestnet: vars.get("AURORA_API_KEY", ""),
      // For Cronos testnet & mainnet
      cronos: vars.get("CRONOS_API_KEY", ""),
      cronosTestnet: vars.get("CRONOS_API_KEY", ""),
      // For Gnosis/xDai testnet & mainnets
      gnosis: vars.get("GNOSIS_API_KEY", ""),
      xdai: vars.get("GNOSIS_API_KEY", ""),
      chiado: vars.get("GNOSIS_API_KEY", ""),
      // For Fuse testnet & mainnet
      fuse: vars.get("FUSE_API_KEY", ""),
      spark: vars.get("FUSE_API_KEY", ""),
      // For Evmos testnet & mainnet
      evmos: vars.get("EVMOS_API_KEY", ""),
      evmosTestnet: vars.get("EVMOS_API_KEY", ""),
      // For Boba network testnet & mainnet
      boba: vars.get("BOBA_API_KEY", ""),
      bobaTestnet: vars.get("BOBA_API_KEY", ""),
      // For Canto testnet & mainnet
      canto: vars.get("CANTO_API_KEY", ""),
      cantoTestnet: vars.get("CANTO_API_KEY", ""),
      // For Base testnets & mainnet
      base: vars.get("BASE_API_KEY", ""),
      baseTestnet: vars.get("BASE_API_KEY", ""),
      baseSepolia: vars.get("BASE_API_KEY", ""),
      // For Mantle testnet & mainnet
      mantle: vars.get("MANTLE_API_KEY", ""),
      mantleTestnet: vars.get("MANTLE_API_KEY", ""),
      // For Filecoin testnet & mainnet
      filecoin: vars.get("FILECOIN_API_KEY", ""),
      filecoinTestnet: vars.get("FILECOIN_API_KEY", ""),
      // For Scroll testnet & mainnet
      scroll: vars.get("SCROLL_API_KEY", ""),
      scrollTestnet: vars.get("SCROLL_API_KEY", ""),
      // For Linea testnet & mainnet
      linea: vars.get("LINEA_API_KEY", ""),
      lineaTestnet: vars.get("LINEA_API_KEY", ""),
      // For ShimmerEVM testnet
      shimmerEVMTestnet: vars.get("SHIMMEREVM_API_KEY", ""),
      // For Zora testnet & mainnet
      zora: vars.get("ZORA_API_KEY", ""),
      zoraTestnet: vars.get("ZORA_API_KEY", ""),
      // For Lukso testnet & mainnet
      lukso: vars.get("LUKSO_API_KEY", ""),
      luksoTestnet: vars.get("LUKSO_API_KEY", ""),
      // For Manta testnet & mainnet
      manta: vars.get("MANTA_API_KEY", ""),
      mantaTestnet: vars.get("MANTA_API_KEY", ""),
      // For Arthera testnet
      artheraTestnet: vars.get("ARTHERA_API_KEY", ""),
      // For Endurance testnets & mainnet
      endurance: vars.get("ENDURANCE_API_KEY", ""),
      enduranceTestnet: vars.get("ENDURANCE_API_KEY", ""),
      openduranceTestnet: vars.get("OPENDURANCE_API_KEY", ""),
      // For Blast testnet & mainnet
      blast: vars.get("BLAST_API_KEY", ""),
      blastTestnet: vars.get("BLAST_API_KEY", ""),
      // For Kroma testnet & mainnet
      kroma: vars.get("KROMA_API_KEY", ""),
      kromaTestnet: vars.get("KROMA_API_KEY", ""),
      // For DOS Chain testnet & mainnet
      dos: vars.get("DOS_API_KEY", ""),
      dosTestnet: vars.get("DOS_API_KEY", ""),
      // For Fraxtal testnet & mainnet
      fraxtal: vars.get("FRAXTAL_API_KEY", ""),
      fraxtalTestnet: vars.get("FRAXTAL_API_KEY", ""),
      // For Kava mainnet
      kava: vars.get("KAVA_API_KEY", ""),
      // For Metis testnet & mainnet
      metis: vars.get("METIS_API_KEY", ""),
      metisTestnet: vars.get("METIS_API_KEY", ""),
      // For Mode testnet & mainnet
      mode: vars.get("MODE_API_KEY", ""),
      modeTestnet: vars.get("MODE_API_KEY", ""),
      // For X Layer testnet & mainnet
      xlayer: vars.get("OKLINK_API_KEY", ""),
      xlayerTestnet: vars.get("OKLINK_API_KEY", ""),
      // For BOB testnet & mainnet
      bob: vars.get("BOB_API_KEY", ""),
      bobTestnet: vars.get("BOB_API_KEY", ""),
      // For Core testnet & mainnet
      core: vars.get("CORE_MAINNET_API_KEY", ""),
      coreTestnet: vars.get("CORE_TESTNET_API_KEY", ""),
      // For Telos testnet & mainnet
      telos: vars.get("TELOS_API_KEY", ""),
      telosTestnet: vars.get("TELOS_API_KEY", ""),
      // For Rootstock testnet & mainnet
      rootstock: vars.get("ROOTSTOCK_API_KEY", ""),
      rootstockTestnet: vars.get("ROOTSTOCK_API_KEY", ""),
    },
    customChains: [
      {
        network: "holesky",
        chainId: 17000,
        urls: {
          apiURL: "https://api-holesky.etherscan.io/api",
          browserURL: "https://holesky.etherscan.io",
        },
      },
      {
        network: "optimisticSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimism.etherscan.io",
        },
      },
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          apiURL: "https://gnosis-chiado.blockscout.com/api",
          browserURL: "https://gnosis-chiado.blockscout.com",
        },
      },
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io",
        },
      },
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io",
        },
      },
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
          apiURL: "https://cronos.org/explorer/testnet3/api",
          browserURL: "https://cronos.org/explorer/testnet3",
        },
      },
      {
        network: "fuse",
        chainId: 122,
        urls: {
          apiURL: "https://explorer.fuse.io/api",
          browserURL: "https://explorer.fuse.io",
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
          apiURL: "https://api.verify.mintscan.io/evm/api/0x2329",
          browserURL: "https://www.mintscan.io/evmos",
        },
      },
      {
        network: "evmosTestnet",
        chainId: 9000,
        urls: {
          apiURL: "https://api.verify.mintscan.io/evm/api/0x2328",
          browserURL: "https://www.mintscan.io/evmos-testnet",
        },
      },
      {
        network: "boba",
        chainId: 288,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/mainnet/evm/288/etherscan",
          browserURL: "https://bobascan.com",
        },
      },
      {
        network: "bobaTestnet",
        chainId: 2888,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/testnet/evm/2888/etherscan",
          browserURL: "https://testnet.bobascan.com",
        },
      },
      {
        network: "arbitrumNova",
        chainId: 42170,
        urls: {
          apiURL: "https://api-nova.arbiscan.io/api",
          browserURL: "https://nova.arbiscan.io",
        },
      },
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io",
        },
      },
      {
        network: "canto",
        chainId: 7700,
        urls: {
          apiURL: "https://tuber.build/api",
          browserURL: "https://tuber.build",
        },
      },
      {
        network: "cantoTestnet",
        chainId: 7701,
        urls: {
          apiURL: "https://testnet.tuber.build/api",
          browserURL: "https://testnet.tuber.build",
        },
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "baseTestnet",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
      {
        network: "mantle",
        chainId: 5000,
        urls: {
          apiURL: "https://explorer.mantle.xyz/api",
          browserURL: "https://explorer.mantle.xyz",
        },
      },
      {
        network: "mantleTestnet",
        chainId: 5003,
        urls: {
          apiURL: "https://explorer.sepolia.mantle.xyz/api",
          browserURL: "https://explorer.sepolia.mantle.xyz",
        },
      },
      {
        network: "filecoin",
        chainId: 314,
        urls: {
          apiURL: "https://filfox.info/api/v1/tools/verifyContract",
          browserURL: "https://filfox.info/en",
        },
      },
      {
        network: "filecoinTestnet",
        chainId: 314159,
        urls: {
          apiURL: "https://calibration.filfox.info/api/v1/tools/verifyContract",
          browserURL: "https://calibration.filfox.info/en",
        },
      },
      {
        network: "scroll",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com",
        },
      },
      {
        network: "scrollTestnet",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com",
        },
      },
      {
        network: "polygonZkEVM",
        chainId: 1101,
        urls: {
          apiURL: "https://api-zkevm.polygonscan.com/api",
          browserURL: "https://zkevm.polygonscan.com",
        },
      },
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
      {
        network: "polygonZkEVMTestnet",
        chainId: 2442,
        urls: {
          apiURL: "https://api-cardona-zkevm.polygonscan.com/api",
          browserURL: "https://cardona-zkevm.polygonscan.com",
        },
      },
      {
        network: "linea",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build",
        },
      },
      {
        network: "lineaTestnet",
        chainId: 59141,
        urls: {
          apiURL: "https://api-sepolia.lineascan.build/api",
          browserURL: "https://sepolia.lineascan.build",
        },
      },
      {
        network: "shimmerEVMTestnet",
        chainId: 1071,
        urls: {
          apiURL: "https://explorer.evm.testnet.shimmer.network/api",
          browserURL: "https://explorer.evm.testnet.shimmer.network",
        },
      },
      {
        network: "zora",
        chainId: 7777777,
        urls: {
          apiURL: "https://explorer.zora.energy/api",
          browserURL: "https://explorer.zora.energy",
        },
      },
      {
        network: "zoraTestnet",
        chainId: 999999999,
        urls: {
          apiURL: "https://sepolia.explorer.zora.energy/api",
          browserURL: "https://sepolia.explorer.zora.energy",
        },
      },
      {
        network: "lukso",
        chainId: 42,
        urls: {
          apiURL: "https://explorer.execution.mainnet.lukso.network/api",
          browserURL: "https://explorer.execution.mainnet.lukso.network",
        },
      },
      {
        network: "luksoTestnet",
        chainId: 4201,
        urls: {
          apiURL: "https://explorer.execution.testnet.lukso.network/api",
          browserURL: "https://explorer.execution.testnet.lukso.network",
        },
      },
      {
        network: "manta",
        chainId: 169,
        urls: {
          apiURL: "https://pacific-explorer.manta.network/api",
          browserURL: "https://pacific-explorer.manta.network",
        },
      },
      {
        network: "mantaTestnet",
        chainId: 3441005,
        urls: {
          apiURL: "https://pacific-explorer.testnet.manta.network/api",
          browserURL: "https://pacific-explorer.testnet.manta.network",
        },
      },
      {
        network: "artheraTestnet",
        chainId: 10243,
        urls: {
          apiURL: "https://explorer-test.arthera.net/api",
          browserURL: "https://explorer-test.arthera.net",
        },
      },
      {
        network: "endurance",
        chainId: 648,
        urls: {
          apiURL: "https://explorer-endurance.fusionist.io/api",
          browserURL: "https://explorer-endurance.fusionist.io",
        },
      },
      {
        network: "enduranceTestnet",
        chainId: 6480,
        urls: {
          apiURL: "https://myexplorertestnet.fusionist.io/api",
          browserURL: "https://myexplorertestnet.fusionist.io",
        },
      },
      {
        network: "openduranceTestnet",
        chainId: 6480001001,
        urls: {
          apiURL: "https://explorer-l2-testnet.fusionist.io/api",
          browserURL: "https://explorer-l2-testnet.fusionist.io",
        },
      },
      {
        network: "blast",
        chainId: 81457,
        urls: {
          apiURL: "https://api.blastscan.io/api",
          browserURL: "https://blastscan.io",
        },
      },
      {
        network: "blastTestnet",
        chainId: 168587773,
        urls: {
          apiURL: "https://api-sepolia.blastscan.io/api",
          browserURL: "https://sepolia.blastscan.io",
        },
      },
      {
        network: "kroma",
        chainId: 255,
        urls: {
          apiURL: "https://api.kromascan.com/api",
          browserURL: "https://kromascan.com",
        },
      },
      {
        network: "kromaTestnet",
        chainId: 2358,
        urls: {
          apiURL: "https://api-sepolia.kromascan.com",
          browserURL: "https://sepolia.kromascan.com",
        },
      },
      {
        network: "dos",
        chainId: 7979,
        urls: {
          apiURL: "https://doscan.io/api",
          browserURL: "https://doscan.io",
        },
      },
      {
        network: "dosTestnet",
        chainId: 3939,
        urls: {
          apiURL: "https://test.doscan.io/api",
          browserURL: "https://test.doscan.io",
        },
      },
      {
        network: "fraxtal",
        chainId: 252,
        urls: {
          apiURL: "https://api.fraxscan.com/api",
          browserURL: "https://fraxscan.com",
        },
      },
      {
        network: "fraxtalTestnet",
        chainId: 2522,
        urls: {
          apiURL: "https://api-holesky.fraxscan.com/api",
          browserURL: "https://holesky.fraxscan.com",
        },
      },
      {
        network: "kava",
        chainId: 2222,
        urls: {
          apiURL: "https://kavascan.com/api",
          browserURL: "https://kavascan.com",
        },
      },
      {
        network: "metis",
        chainId: 1088,
        urls: {
          apiURL: "https://andromeda-explorer.metis.io/api",
          browserURL: "https://andromeda-explorer.metis.io",
        },
      },
      {
        network: "metisTestnet",
        chainId: 59902,
        urls: {
          apiURL: "https://sepolia-explorer.metisdevops.link/api",
          browserURL: "https://sepolia-explorer.metisdevops.link",
        },
      },
      {
        network: "mode",
        chainId: 34443,
        urls: {
          apiURL: "https://explorer.mode.network/api",
          browserURL: "https://explorer.mode.network",
        },
      },
      {
        network: "modeTestnet",
        chainId: 919,
        urls: {
          apiURL: "https://sepolia.explorer.mode.network/api",
          browserURL: "https://sepolia.explorer.mode.network",
        },
      },
      {
        network: "xlayer",
        chainId: 196,
        urls: {
          apiURL:
            "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER",
          browserURL: "https://www.oklink.com/xlayer",
        },
      },
      {
        network: "xlayerTestnet",
        chainId: 195,
        urls: {
          apiURL:
            "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET",
          browserURL: "https://www.oklink.com/xlayer-test",
        },
      },
      {
        network: "bob",
        chainId: 60808,
        urls: {
          apiURL: "https://explorer.gobob.xyz/api",
          browserURL: "https://explorer.gobob.xyz",
        },
      },
      {
        network: "bobTestnet",
        chainId: 111,
        urls: {
          apiURL: "https://testnet-explorer.gobob.xyz/api",
          browserURL: "https://testnet-explorer.gobob.xyz",
        },
      },
      {
        network: "core",
        chainId: 1116,
        urls: {
          apiURL: "https://openapi.coredao.org/api",
          browserURL: "https://scan.coredao.org",
        },
      },
      {
        network: "coreTestnet",
        chainId: 1115,
        urls: {
          apiURL: "https://api.test.btcs.network/api",
          browserURL: "https://scan.test.btcs.network",
        },
      },
      {
        network: "telos",
        chainId: 40,
        urls: {
          apiURL: "https://api.teloscan.io/api",
          browserURL: "https://www.teloscan.io",
        },
      },
      {
        network: "telosTestnet",
        chainId: 41,
        urls: {
          apiURL: "https://api.testnet.teloscan.io/api",
          browserURL: "https://testnet.teloscan.io",
        },
      },
      {
        network: "rootstock",
        chainId: 30,
        urls: {
          apiURL: "https://rootstock.blockscout.com/api",
          browserURL: "https://rootstock.blockscout.com",
        },
      },
      {
        network: "rootstockTestnet",
        chainId: 31,
        urls: {
          apiURL: "https://rootstock-testnet.blockscout.com/api",
          browserURL: "https://rootstock-testnet.blockscout.com",
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
