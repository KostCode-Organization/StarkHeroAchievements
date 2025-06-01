const { ethers } = require("hardhat");

async function deployContract() {
  try {
    console.log("deploying contract to Sepolia...");
    
    const [signer] = await ethers.getSigners();
    console.log("deploying from:", signer.address);
    
    const balance = await ethers.provider.getBalance(signer.address);
    console.log("balance:", ethers.formatEther(balance), "ETH");
    
    const MultiTypeNFT = await ethers.getContractFactory("MultiTypeNFT");
    
    // simple placeholder base URI
    const baseURI = "https://placeholder.starkhero.com/metadata/";
    console.log("using base URI:", baseURI);
    
    const contract = await MultiTypeNFT.deploy(baseURI);
    console.log("waiting for deployment confirmation...");
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    console.log("contract address:", contractAddress);
    console.log("owner:", signer.address);
    
    console.log("\nverifying deployment...");
    const owner = await contract.owner();
    const uri = await contract.uri(0);
    
    console.log("verification results:");
    console.log("   owner:", owner);
    console.log("   base URI:", uri);
    console.log("   owner == deployer:", owner.toLowerCase() === signer.address.toLowerCase());
    
    console.log("\nsave this contract address for your scripts:");
    console.log(`CONTRACT_ADDRESS = "${contractAddress}"`);
    
    return contractAddress;
    
  } catch (error) {
    console.error("deployment failed:", error.message);
    if (error.data) {
      console.error("error data:", error.data);
    }
    throw error;
  }
}

if (require.main === module) {
  deployContract()
    .then((address) => {
      console.log("\ndeployment completed successfully");
      console.log("contract address:", address);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { deployContract };
