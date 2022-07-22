import * as dotenv from "dotenv";

import {HardhatUserConfig} from "hardhat/config";
import 'hardhat-deploy';
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import '@typechain/hardhat'
import "hardhat-gas-reporter";
import "solidity-coverage";
import 'hardhat-watcher'

import {mnemonic, mainnetMnemonic} from './mnemonics';


dotenv.config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: any = {
  solidity: {
    compilers: [
      {version: '0.8.4'},
      {version: '0.8.10'}
    ]
  },
  namedAccounts: {
    deployer: 0,
    alice: 1,
    bob: 2,
    charlie: 3,
    drew: 4,
  },
  networks: {
    hardhat: {
      chainId: 1337,
      // mining: {
      //   interval: 1000
      // },
      accounts: {
        mnemonic
      }
    },
    kovan: {
      url: 'https://kovan.infura.io/v3/a1f1a6ef150f4c25996cc3c45314c03f',
      accounts: {
        mnemonic
      },
      live: true,
      saveDeployments: true,
      tags: ['staging']
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/a1f1a6ef150f4c25996cc3c45314c03f',
      accounts: {
        mnemonic
      },
      live: true,
      saveDeployments: true,
      tags: ['staging']
    },
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/HTJg7UON9Axg5HDnRcUavxD2CaXCZnmv',
      accounts: {
        mnemonic
      },
      live: true,
      saveDeployments: true,
      tags: ['staging'],
      verify: {
        apiKey: '69M8YQVJCE46N1XN2FJ7N3YMKQZE3I5IRE',
        apiUrl: 'https://api-testnet.polygonscan.com/api'
      }
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.CMC_API_KEY
  },
  etherscan: {
    apiKey: '69M8YQVJCE46N1XN2FJ7N3YMKQZE3I5IRE',
  },
  typechain: {
    outDir: './typechain',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: [
      './node_modules/@openzeppelin/contracts-upgradeable/build/contracts*.json',
      './node_modules/@openzeppelin/contracts/build/contracts*.json',
    ] // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  },
  watcher: {
    compilation: {
      tasks: ['compile'],
      verbose: true
    },
  }
};

export default config;
