const { ethers } = require("hardhat");

const CONTRACT_ADDRESS = "0x415d9A74a280E93FAA1Eb49AE9a177a2BD2b8B15";

// full contract ABI for all operations
const CONTRACT_ABI = [
  "function addTokenType(uint256 id, string calldata tokenURI) external",
  "function mint(address to, uint256 id, uint256 amount, bytes calldata data) external",
  "function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external",
  "function exists(uint256 id) external view returns (bool)",
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function uri(uint256 id) public view returns (string memory)",
  "function owner() public view returns (address)"
];

async function checkContractStatus() {
  try {
    console.log("🔍 Checking contract status...");
    
    const [signer] = await ethers.getSigners();
    console.log("account:", signer.address);
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    console.log("contract address:", CONTRACT_ADDRESS);
    
    const owner = await contract.owner();
    console.log("owner:", owner);
    console.log("you are the owner:", owner.toLowerCase() === signer.address.toLowerCase());
    
    const balance = await ethers.provider.getBalance(signer.address);
    console.log("balance:", ethers.formatEther(balance), "ETH");
    
    console.log("\nchecking tokens (1-20):");
    for (let i = 1; i <= 10; i++) {
      try {
        const exists = await contract.exists(i);
        if (exists) {
          const uri = await contract.uri(i);
          const balance = await contract.balanceOf(signer.address, i);
          console.log(`   token ${i}: exists | URI: ${uri} | balance: ${balance.toString()}`);
        } else {
          console.log(`   token ${i}: does not exist`);
        }
      } catch (error) {
        console.log(`   token ${i}: error checking - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error("error:", error.message);
  }
}

const args = process.argv.slice(2);
const command = args[0];

if (require.main === module) {
  if (command === "check") {
    checkContractStatus()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  } else {
    console.error("unknown command, use 'check'");
    process.exit(1);
  }
}

module.exports = { checkContractStatus, CONTRACT_ADDRESS, CONTRACT_ABI };
