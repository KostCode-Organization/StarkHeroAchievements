const { ethers } = require("hardhat");

const CONTRACT_ADDRESS = "0x415d9A74a280E93FAA1Eb49AE9a177a2BD2b8B15";

// contract ABI
const CONTRACT_ABI = [
  "function mint(address to, uint256 id, uint256 amount, bytes calldata data) external",
  "function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external",
  "function exists(uint256 id) external view returns (bool)",
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function uri(uint256 id) public view returns (string memory)"
];

const ACHIEVEMENTS = {
  "100_CODE_REVIEWED": 1,
  "100_ISSUES_CREATED": 2,
  "10_CODE_REVIEWED": 3,
  "10_DAYS_STREAK": 4,
  "10_ISSUES_CREATED": 5,
  "1_CODE_REVIEWED": 6,
  "1_ISSUE_CREATED": 7,
  "1_TASK_COMPLETED": 8,
  "25_DAYS_SCREAK": 9,
  "25_TASK_COMPLETED": 10,
  "50_DAYS_STREAK": 11,
  "50_TASK_COMPLETED": 12,
  "5_DAYS_STREAK": 13,
  "5_TASK_COMPLETED": 14,
  "BEST_MONTH_CONTRIBUTOR": 15,
  "HACKATHON_PARTICIPATED": 16,
  "PRO_IN_CAIRO": 17,
  "PRO_IN_JS": 18,
  "PRO_IN_PYTHON": 19,
  "PRO_IN_SOLIDITY": 20
};

async function mintNFT(recipientAddress, achievementId, amount = 1) {
  try {
    console.log("minting NFT...");
    
    const [signer] = await ethers.getSigners();
    console.log("minting from:", signer.address);
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    console.log("contract:", CONTRACT_ADDRESS);
    
    if (achievementId < 1 || achievementId > 20) {
      throw new Error(`invalid achievement ID: ${achievementId} (1-20 allowed)`);
    }
    
    const exists = await contract.exists(achievementId);
    if (!exists) {
      throw new Error(`achievement token ${achievementId} does not exist`);
    }
    
    const achievementNames = {
      1: "100 Code Reviewed",
      2: "100 Issues Created",
      3: "10 Code Reviewed",
      4: "10 Days Streak", 
      5: "10 Issues Created",
      6: "1 Code Reviewed",
      7: "1 Issue Created",
      8: "1 Task Completed",
      9: "25 Days Screak",
      10: "25 Task Completed",
      11: "50 Days Streak",
      12: "50 Task Completed",
      13: "5 Days Streak",
      14: "5 Task Completed",
      15: "Best Month Contributor",
      16: "Hackathon Participated",
      17: "Pro In Cairo",
      18: "Pro In JS",
      19: "Pro In Python",
      20: "Pro In Solidity"
    };
    
    console.log(`achievement: ${achievementNames[achievementId]} (ID: ${achievementId})`);
    console.log(`recipient: ${recipientAddress}`);
    console.log(`amount: ${amount}`);
    
    const currentBalance = await contract.balanceOf(recipientAddress, achievementId);
    console.log(`balance: ${currentBalance.toString()}`);
    
    const tx = await contract.mint(recipientAddress, achievementId, amount, "0x");
    console.log(`txn hash: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`NFT minted! gas: ${receipt.gasUsed.toString()}`);
    
    const newBalance = await contract.balanceOf(recipientAddress, achievementId);
    console.log(`balance now: ${newBalance.toString()}`);
    
    return {
      transactionHash: tx.hash,
      achievementId,
      recipient: recipientAddress,
      amount,
      newBalance: newBalance.toString()
    };
    
  } catch (error) {
    console.error("minting failed:", error.message);
    throw error;
  }
}

async function mintBatch(recipientAddress, achievementIds, amounts) {
  try {
    console.log("batch minting NFTs...");
    
    const [signer] = await ethers.getSigners();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    console.log(`recipient: ${recipientAddress}`);
    console.log(`achievements: [${achievementIds.join(', ')}]`);
    console.log(`amounts: [${amounts.join(', ')}]`);
    
    if (achievementIds.length !== amounts.length) {
      throw new Error("achievement IDs and amounts arrays must have the same length");
    }
    
    for (const id of achievementIds) {
      const exists = await contract.exists(id);
      if (!exists) {
        throw new Error(`achievement token ${id} does not exist`);
      }
    }
    
    console.log("batch minting NFTs...");
    const tx = await contract.mintBatch(recipientAddress, achievementIds, amounts, "0x");
    console.log(`txn hash: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`NFTs minted! gas: ${receipt.gasUsed.toString()}`);
    
    console.log("\nbalances now:");
    for (let i = 0; i < achievementIds.length; i++) {
      const balance = await contract.balanceOf(recipientAddress, achievementIds[i]);
      console.log(`   achievement ${achievementIds[i]}: ${balance.toString()}`);
    }
    
    return {
      transactionHash: tx.hash,
      recipient: recipientAddress,
      achievements: achievementIds.map((id, i) => ({ id, amount: amounts[i] }))
    };
    
  } catch (error) {
    console.error("batch minting failed:", error.message);
    throw error;
  }
}

async function main() {
  // Check if called from Python service via environment variables
  if (process.env.MINT_RECIPIENT) {
    if (process.env.MINT_BATCH === "true") {
      // Batch minting
      const recipient = process.env.MINT_RECIPIENT;
      const ids = process.env.MINT_ACHIEVEMENT_IDS.split(',').map(Number);
      const amounts = process.env.MINT_AMOUNTS.split(',').map(Number);
      await mintBatch(recipient, ids, amounts);
    } else {
      // Single minting
      const recipient = process.env.MINT_RECIPIENT;
      const achievementId = parseInt(process.env.MINT_ACHIEVEMENT_ID);
      const amount = parseInt(process.env.MINT_AMOUNT || "1");
      await mintNFT(recipient, achievementId, amount);
    }
    return;
  }

  // Original command line interface
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log("usage:");
    console.log("  mint single NFT: node mintAchievement.js <recipient> <achievementId> [amount]");
    console.log("  mint batch: node mintAchievement.js batch <recipient> <id1,id2,...> <amount1,amount2,...>");
    console.log("");
    console.log("achievement IDs (1-20):");
    console.log("  1 - 100 Code Reviewed");
    console.log("  2 - 100 Issues Created");
    console.log("  3 - 10 Code Reviewed");
    console.log("  4 - 10 Days Streak");
    console.log("  5 - 10 Issues Created");
    console.log("  6 - 1 Code Reviewed");
    console.log("  7 - 1 Issue Created");
    console.log("  8 - 1 Task Completed");
    console.log("  9 - 25 Days Screak");
    console.log("  10 - 25 Task Completed");
    console.log("  11 - 50 Days Streak");
    console.log("  12 - 50 Task Completed");
    console.log("  13 - 5 Days Streak");
    console.log("  14 - 5 Task Completed");
    console.log("  15 - Best Month Contributor");
    console.log("  16 - Hackathon Participated");
    console.log("  17 - Pro In Cairo");
    console.log("  18 - Pro In JS");
    console.log("  19 - Pro In Python");
    console.log("  20 - Pro In Solidity");
    console.log("");
    console.log("examples:");
    console.log("  node mintAchievement.js 0x123...abc 1 1");
    console.log("  node mintAchievement.js batch 0x123...abc 1,2,3 1,1,1");
    return;
  }
  
  if (args[0] === "batch") {
    const recipient = args[1];
    const ids = args[2].split(',').map(Number);
    const amounts = args[3].split(',').map(Number);
    await mintBatch(recipient, ids, amounts);
  } else {
    const recipient = args[0];
    const achievementId = parseInt(args[1]);
    const amount = parseInt(args[2] || "1");
    await mintNFT(recipient, achievementId, amount);
  }
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { mintNFT, mintBatch, ACHIEVEMENTS, CONTRACT_ADDRESS };
