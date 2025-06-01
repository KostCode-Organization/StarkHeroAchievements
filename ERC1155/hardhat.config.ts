import type { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-network-helpers";
import "@nomicfoundation/hardhat-foundry";

const { vars } = require("hardhat/config");
import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-toolbox";
// Go to https://infura.io, sign up, create a new API key
// in its dashboard, and add it to the configuration variables
const INFURA_API_KEY = vars.get("INFURA_API_KEY");

// Add your Sepolia account private key to the configuration variables
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");

// module.exports = {
//   solidity: "0.8.28",
//   networks: {
//     sepolia: {
//       url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
//       accounts: [SEPOLIA_PRIVATE_KEY],
//     },
//   },
// };

const ETH_SCANER = vars.get("ETH_SCAN_PRIVATE_KEY");

const PRIVATE_KEY = vars.get("PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    'sepolia': {
      url: 'https://1rpc.io/sepolia',
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      // Is not required by blockscout. Can be any non-empty string
      sepolia: ETH_SCANER
    },
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://eth-sepolia.blockscout.com/api",
          browserURL: "https://eth-sepolia.blockscout.com/",
        }
      }
    ]
  },
  sourcify: {
    enabled: false
  }
};

// export default config;

export default config;
