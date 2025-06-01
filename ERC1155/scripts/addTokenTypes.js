const { ethers } = require("hardhat");

const CONTRACT_ADDRESS = "0x415d9A74a280E93FAA1Eb49AE9a177a2BD2b8B15";

// contract minimal ABI
const CONTRACT_ABI = [
  "function addTokenType(uint256 id, string calldata tokenURI) external",
  "function exists(uint256 id) external view returns (bool)",
  "function uri(uint256 id) public view returns (string memory)",
  "function owner() public view returns (address)"
];

const TOKEN_TYPES = [
  {
    id: 1,
    tokenURI: "https://ipfs.io/ipfs/QmNsWGeCyhnHFKT5Eqzuiy1qc2ULUuGU7iY9aJ8siRcA4x",
    name: "100 Code Reviewed"
  },
  {
    id: 2,
    tokenURI: "https://ipfs.io/ipfs/QmZPdrtoLq2VrdJ9U6nu4wgS4mtKKkWAcEvxhmgaoYP94P",
    name: "100 Issues Created"
  },
  {
    id: 3,
    tokenURI: "https://ipfs.io/ipfs/QmU2XpCzifW5wx9iDnfNPTcU9b3b4LB56HocKs6XNAWyzt",
    name: "10 Code Reviewed"
  },
  {
    id: 4,
    tokenURI: "https://ipfs.io/ipfs/QmNo7mkDf9QEdNhw4TTA6QRGPR8UzTxZqwZPs6kLjKPETx",
    name: "10 Days Streak"
  },
  {
    id: 5,
    tokenURI: "https://ipfs.io/ipfs/QmNjDGzHmrah3jeRcqP5qnvSAekrTYGBRkEW5TRg9fVKRg",
    name: "10 Issues Created"
  },
  {
    id: 6,
    tokenURI: "https://ipfs.io/ipfs/QmZDyreGNofdq7Mc55G2CgXPafCCLu3xTxzTxttLy4QXVj",
    name: "1 Code Reviewed"
  },
  {
    id: 7,
    tokenURI: "https://ipfs.io/ipfs/QmRABziTXcbGqmN1SSuMaPsmcaxg9t4yVR474mdvyPW5CL",
    name: "1 Issue Created"
  },
  {
    id: 8,
    tokenURI: "https://ipfs.io/ipfs/QmehpQKMRLEa61JEn1SMkB58M9biSfypuVr52dQ6Ziu8qV",
    name: "1 Task Completed"
  },
  {
    id: 9,
    tokenURI: "https://ipfs.io/ipfs/QmXJzXjoQM9TTFXF45BQmUwjXYFvKP4p8c9Z63tL9e4B29",
    name: "25 Days Screak"
  },
  {
    id: 10,
    tokenURI: "https://ipfs.io/ipfs/QmbxRXGxrfRmycbB9vrR7eL17kSm3jRDE7d2sr1eSKMXXo",
    name: "25 Task Completed"
  },
  {
    id: 11,
    tokenURI: "https://ipfs.io/ipfs/QmaqCtWr8hwEP7uDffHbAdUEkQHoY8y38x5FP24jCBK56J",
    name: "50 Days Streak"
  },
  {
    id: 12,
    tokenURI: "https://ipfs.io/ipfs/QmUtM68UedirzzFwHcGs9mFMkQMLFG52WzQV3YnvmY1kcz",
    name: "50 Task Completed"
  },
  {
    id: 13,
    tokenURI: "https://ipfs.io/ipfs/QmPqkiRpBrPfqAYfRTuYwEQSfdJBPMRKvcfbRgNV5FwUZA",
    name: "5 Days Streak"
  },
  {
    id: 14,
    tokenURI: "https://ipfs.io/ipfs/QmVb91rc6XAtAC4TamHfwpBrC4GmvGCueC2tt9dPeqT5F4",
    name: "5 Task Completed"
  },
  {
    id: 15,
    tokenURI: "https://ipfs.io/ipfs/QmSsaPwgxTKom1SiBfKRZwKa1DA5gtNNo9x8cW7foamoZ7",
    name: "Best Month Contributor"
  },
  {
    id: 16,
    tokenURI: "https://ipfs.io/ipfs/QmXtkdjm2Hu2Vf5kXiL91n2SMYv7j5zKM8edtLEdijTnF7",
    name: "Hackathon Participated"
  },
  {
    id: 17,
    tokenURI: "https://ipfs.io/ipfs/QmdJh8VLtLSSifD6bpbCa5Vy28Nid1ikxcpx4tfjvwCFHP",
    name: "Pro In Cairo"
  },
  {
    id: 18,
    tokenURI: "https://ipfs.io/ipfs/QmWF3FhgtjKCFfgZyUwfiUoL9TmAjrG3h7pNs7iEfDv79E",
    name: "Pro In JS"
  },
  {
    id: 19,
    tokenURI: "https://ipfs.io/ipfs/QmSg71USzJQUVuQ22u5HhFsvzQMwaKgaYadDGEFpVDGR4a",
    name: "Pro In Python"
  },
  {
    id: 20,
    tokenURI: "https://ipfs.io/ipfs/Qmca9pqEj5762G5nukDs1GY6WqagDyeA2JNQwSqAzTwfPU",
    name: "Pro In Solidity"
  }
];

async function addTokenTypes() {
  try {
    console.log("starting...");
    
    const [signer] = await ethers.getSigners();
    console.log("account:", signer.address);
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    console.log("connected to contract:", CONTRACT_ADDRESS);
    
    // test contract existence
    const code = await ethers.provider.getCode(CONTRACT_ADDRESS);
    if (code === "0x") {
      throw new Error("no contract deployed at this address!");
    }
    console.log("contract confirmed at address");
    
    // check for owner
    try {
      const owner = await contract.owner();
      console.log("owner:", owner);
      console.log("you are the owner:", owner.toLowerCase() === signer.address.toLowerCase());
    } catch (error) {
      console.log("could not check owner");
    }
     
    const balance = await ethers.provider.getBalance(signer.address);
    console.log("balance:", ethers.formatEther(balance), "ETH");
    
    // add each token type
    for (const tokenType of TOKEN_TYPES) {
      console.log(`\nprocessing token ID ${tokenType.id}: ${tokenType.name}`);
      
      const exists = await contract.exists(tokenType.id);
      if (exists) {
        console.log(`token ID ${tokenType.id} already exists...`);
        continue;
      }
      
      console.log(`adding token ${tokenType.id}...`);
      const tx = await contract.addTokenType(tokenType.id, tokenType.tokenURI);
      console.log(`transaction sent: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`token ${tokenType.id} added! gas: ${receipt.gasUsed.toString()}`);
      
      const nowExists = await contract.exists(tokenType.id);
      console.log(`verification: ${tokenType.id} exists = ${nowExists}`);
    }
    
    console.log("\nall tokens have been processed!");
    
  } catch (error) {
    console.error("error:", error.message);
    if (error.data) {
      console.error("error in data:", error.data);
    }
  }
}

if (require.main === module) {
  addTokenTypes()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { addTokenTypes, TOKEN_TYPES, CONTRACT_ADDRESS, CONTRACT_ABI };
