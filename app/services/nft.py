import os
import subprocess
import json
import aiohttp
from typing import Dict, Any, List
from app.core.config import settings


class NFTService:
    """Service for interacting with NFT smart contracts"""
    
    CONTRACT_ADDRESS = "0x415d9A74a280E93FAA1Eb49AE9a177a2BD2b8B15"
    
    @classmethod
    def get_erc1155_path(cls) -> str:
        """Get the correct path to ERC1155 directory for both Docker and local environments"""
        # Try Docker container path first
        docker_path = "/app/ERC1155"
        if os.path.exists(docker_path):
            return docker_path
        
        # Fall back to local development path
        local_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "ERC1155")
        if os.path.exists(local_path):
            return local_path
        
        # Try relative path from current working directory
        cwd_path = os.path.join(os.getcwd(), "ERC1155")
        if os.path.exists(cwd_path):
            return cwd_path
        
        raise FileNotFoundError(f"ERC1155 directory not found. Tried: {docker_path}, {local_path}, {cwd_path}")
    
    ACHIEVEMENT_IDS = {
        "100_CODE_REVIEWED": 1,
        "100_ISSUES_CREATED": 2,
        "10_CODE_REVIEWED": 3,
        "10_DAYS_STREAK": 4,
        "10_ISSUES_CREATED": 5,
        "1_CODE_REVIEWED": 6,
        "1_ISSUE_CREATED": 7,
        "1_TASK_COMPLETED": 8,
        "25_DAYS_STREAK": 9,
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
    }
    
    @classmethod
    async def mint_achievement(cls, wallet_address: str, achievement_id: int, amount: int = 1) -> Dict[str, Any]:
        """
        Mint an achievement NFT to a wallet address
        
        Args:
            wallet_address: The recipient wallet address
            achievement_id: The achievement ID (1-20)
            amount: Number of tokens to mint (default: 1)
            
        Returns:
            Dict containing transaction hash and minting details
        """
        try:
            if achievement_id < 1 or achievement_id > 20:
                raise ValueError(f"Invalid achievement ID: {achievement_id}. Must be between 1-20")
            
            # Change to ERC1155 directory and run the minting script
            # Set environment variables for the script
            env = os.environ.copy()
            env["MINT_RECIPIENT"] = wallet_address
            env["MINT_ACHIEVEMENT_ID"] = str(achievement_id)
            env["MINT_AMOUNT"] = str(amount)
            
            mint_command = [
                "npx", "hardhat", "run", "scripts/mintAchievement.js", "--network", "sepolia"
            ]
            
            result = subprocess.run(
                mint_command,
                cwd=cls.get_erc1155_path(),
                capture_output=True,
                text=True,
                timeout=120,  # 2 minute timeout
                env=env
            )
            
            if result.returncode != 0:
                raise Exception(f"Minting failed: {result.stderr}")
            
            # Parse the output for transaction hash
            output_lines = result.stdout.split('\n')
            txn_hash = None
            
            for line in output_lines:
                if "txn hash:" in line:
                    txn_hash = line.split("txn hash:")[-1].strip()
                    break
            
            return {
                "success": True,
                "transaction_hash": txn_hash,
                "achievement_id": achievement_id,
                "recipient": wallet_address,
                "amount": amount,
                "output": result.stdout
            }
            
        except subprocess.TimeoutExpired:
            raise Exception("Minting operation timed out")
        except Exception as e:
            raise Exception(f"Error minting NFT: {str(e)}")
    
    @classmethod
    async def mint_batch_achievements(cls, wallet_address: str, achievement_ids: list[int], amounts: list[int]) -> Dict[str, Any]:
        """
        Mint multiple achievement NFTs in a single transaction
        
        Args:
            wallet_address: The recipient wallet address
            achievement_ids: List of achievement IDs (1-20)
            amounts: List of amounts corresponding to each achievement
            
        Returns:
            Dict containing transaction hash and minting details
        """
        try:
            if len(achievement_ids) != len(amounts):
                raise ValueError("Achievement IDs and amounts arrays must have the same length")
            
            for aid in achievement_ids:
                if aid < 1 or aid > 20:
                    raise ValueError(f"Invalid achievement ID: {aid}. Must be between 1-20")
            
            # Format arrays for command line
            ids_str = ",".join(map(str, achievement_ids))
            amounts_str = ",".join(map(str, amounts))
            
            # Set environment variables for the script
            env = os.environ.copy()
            env["MINT_BATCH"] = "true"
            env["MINT_RECIPIENT"] = wallet_address
            env["MINT_ACHIEVEMENT_IDS"] = ids_str
            env["MINT_AMOUNTS"] = amounts_str
            
            mint_command = [
                "npx", "hardhat", "run", "scripts/mintAchievement.js", "--network", "sepolia"
            ]
            
            result = subprocess.run(
                mint_command,
                cwd=cls.get_erc1155_path(),
                capture_output=True,
                text=True,
                timeout=120,  # 2 minute timeout
                env=env
            )
            
            if result.returncode != 0:
                raise Exception(f"Batch minting failed: {result.stderr}")
            
            # Parse the output for transaction hash
            output_lines = result.stdout.split('\n')
            txn_hash = None
            
            for line in output_lines:
                if "txn hash:" in line:
                    txn_hash = line.split("txn hash:")[-1].strip()
                    break
            
            return {
                "success": True,
                "transaction_hash": txn_hash,
                "achievement_ids": achievement_ids,
                "recipient": wallet_address,
                "amounts": amounts,
                "output": result.stdout
            }
            
        except subprocess.TimeoutExpired:
            raise Exception("Batch minting operation timed out")
        except Exception as e:
            raise Exception(f"Error batch minting NFTs: {str(e)}")
    
    @classmethod
    async def fetch_minted_nfts(cls, wallet_address: str) -> List[int]:
        """
        Fetch minted NFT achievement IDs for a wallet address from Blockscout API
        
        Args:
            wallet_address: The wallet address to check for NFTs
            
        Returns:
            List of achievement IDs that have been minted to this address
        """
        try:
            url = f"https://eth-sepolia.blockscout.com/api?module=account&action=tokentx&address={wallet_address}&page=1&offset=100"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status != 200:
                        return []
                    
                    data = await response.json()
                    
                    if data.get("status") != "1" or data.get("message") != "OK":
                        return []
                    
                    # Filter for our contract address and extract achievement IDs
                    achievement_ids = []
                    for transaction in data.get("result", []):
                        contract_address = transaction.get("contractAddress", "").lower()
                        
                        # Check if this transaction belongs to our contract and is a mint (from zero address)
                        if (contract_address == cls.CONTRACT_ADDRESS.lower() and 
                            transaction.get("from", "").lower() == "0x0000000000000000000000000000000000000000"):
                            
                            # Extract token ID from the transaction
                            token_id_str = transaction.get("tokenID")
                            if token_id_str:
                                try:
                                    achievement_id = int(token_id_str)
                                    if 1 <= achievement_id <= 20:  # Valid achievement ID range
                                        achievement_ids.append(achievement_id)
                                except ValueError:
                                    continue
                    
                    return list(set(achievement_ids))  # Remove duplicates
                    
        except Exception as e:
            print(f"Error fetching minted NFTs: {str(e)}")
            return []


# Create instance for easy importing
nft_service = NFTService()