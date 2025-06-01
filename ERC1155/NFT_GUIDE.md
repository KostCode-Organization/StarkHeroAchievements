# StarkHero Achievements NFT Management

This project contains scripts to interact with deployed ERC1155 contract on Sepolia testnet.

## Contract Details
- **Contract Address**: `0x415d9A74a280E93FAA1Eb49AE9a177a2BD2b8B15`
- **Network**: Sepolia Testnet
- **Contract Type**: ERC1155 MultiTypeNFT

## Prerequisites

1. **Node.js and npm** installed
2. **Private key** configured in Hardhat environment variables
3. **Sepolia ETH** for gas fees

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure your private key is set in the Hardhat configuration:
```bash
npx hardhat vars set PRIVATE_KEY
# Enter your private key when prompted
```

## Available Scripts

### 1. Check Contract Status
Check the current state of your contract, including token types and balances:

```bash
npm run check
```

### 2. Add Token Types (Publish NFTs)
Register new token types that can be minted:

```bash
npm run add-tokens
```

### 3. Mint NFTs
Mint a single NFT:

```bash
npm run mint
```

Mint multiple NFTs in one transaction:

```bash
npm run mint-batch
```

### 4. Complete Setup (Recommended)
Publish token types AND mint initial NFTs in one go:

```bash
npm run setup
```

## Token Types for StarkHero Achievements

The scripts are pre-configured with these achievement tokens:

| ID | Name | Description |
|----|------|-------------|
| 1 | 100 Code Reviewed | Awarded for reviewing 100 code submissions |
| 2 | 100 Issues Created | Awarded for creating 100 valuable issues |
| 3 | 10 Code Reviewed | Awarded for reviewing 10 code submissions |
| 4 | 10 Days Streak | Awarded for maintaining a 10-day activity streak |
| 5 | 10 Issues Created | Awarded for creating 10 issues |
| 6 | 1 Code Reviewed | Awarded for your first code review |
| 7 | 1 Issue Created | Awarded for creating your first issue |
| 8 | 1 Task Completed | Awarded for completing your first task |
| 9 | 25 Days Streak | Awarded for maintaining a 25-day activity streak |
| 10 | 25 Task Completed | Awarded for completing 25 tasks |
| 11 | 50 Days Streak | Awarded for maintaining a 50-day activity streak |
| 12 | 50 Task Completed | Awarded for completing 50 tasks |
| 13 | 5 Days Streak | Awarded for maintaining a 5-day activity streak |
| 14 | 5 Task Completed | Awarded for completing 5 tasks |
| 15 | Best Month Contributor | Awarded for being the top contributor of the month |
| 16 | Hackathon Participated | Awarded for participating in a hackathon |
| 17 | Pro In Cairo | Awarded for demonstrating expertise in Cairo |
| 18 | Pro In JS | Awarded for demonstrating expertise in JavaScript |
| 19 | Pro In Python | Awarded for demonstrating expertise in Python |
| 20 | Pro In Solidity | Awarded for demonstrating expertise in Solidity |

## Metadata Configuration

Before running the scripts, you should:

1. **Upload your NFT images** to IPFS (e.g., using Pinata)
4. **Update the token URIs** in the scripts with your actual IPFS hashes

## Troubleshooting

### "You are not the contract owner" Error
Make sure the private key you're using is the same one that deployed the contract.

### "Token type does not exist" Error
You need to add token types first before minting. Use `npm run add-tokens` or `npm run setup`.

### "Insufficient funds" Error
You need more Sepolia ETH. Get some from a faucet like:
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia

## Integration with Your App

To integrate these NFTs with application:

1. Use the contract address: `0x415d9A74a280E93FAA1Eb49AE9a177a2BD2b8B15`
3. Call `mint()` function when users earn achievements
4. Call `balanceOf()` to check user's achievement tokens
5. Call `uri()` to get metadata for displaying achievements

