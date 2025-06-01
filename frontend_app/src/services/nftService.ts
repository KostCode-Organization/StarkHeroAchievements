// NFT Service for interacting with the backend NFT endpoints
const BACKEND_URL = 'http://64.226.116.114:8000';

export interface MintRequest {
  wallet_address: string;
  achievement_id: number;
  amount?: number;
}

export interface BatchMintRequest {
  wallet_address: string;
  achievement_ids: number[];
  amounts: number[];
}

export interface MintResponse {
  success: boolean;
  transaction_hash: string;
  achievement_id: number;
  recipient: string;
  amount: number;
  output: string;
}

export interface BatchMintResponse {
  success: boolean;
  transaction_hash: string;
  achievement_ids: number[];
  recipient: string;
  amounts: number[];
  output: string;
}

export interface BlockscoutNFT {
  animation_url: string | null;
  external_app_url: string | null;
  id: string;
  image_url: string;
  is_unique: boolean | null;
  media_type: string | null;
  media_url: string;
  metadata: {
    description: string;
    image: string;
    name: string;
  };
  owner: string | null;
  thumbnails: any;
  token: {
    address: string;
    address_hash: string;
    circulating_market_cap: string | null;
    decimals: string | null;
    exchange_rate: string | null;
    holders: string;
    holders_count: string;
    icon_url: string | null;
    name: string | null;
    symbol: string | null;
    total_supply: string | null;
    type: string;
    volume_24h: string | null;
  };
  token_type: string;
  value: string;
}

export interface BlockscoutNFTResponse {
  items: BlockscoutNFT[];
  next_page_params: any;
}

export class NFTService {
  
  /**
   * Mint a single achievement NFT to a wallet address
   */
  static async mintAchievement(request: MintRequest): Promise<MintResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/nft/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to mint NFT');
      }

      return await response.json();
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  }

  /**
   * Mint multiple achievement NFTs in a single transaction
   */
  static async mintBatchAchievements(request: BatchMintRequest): Promise<BatchMintResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/nft/mint-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to mint NFTs');
      }

      return await response.json();
    } catch (error) {
      console.error('Error batch minting NFTs:', error);
      throw error;
    }
  }

  static getAchievementId(achievementName: string): number | null {
    const achievementMap: Record<string, number> = {
      "100 Code Reviewed": 1,
      "100 Issues Created": 2,
      "10 Code Reviewed": 3,
      "10 Days Streak": 4,
      "10 Issues Created": 5,
      "1 Code Reviewed": 6,
      "1 Issue Created": 7,
      "1 Task Completed": 8,
      "25 Days Screak": 9,
      "25 Task Completed": 10,
      "50 Days Streak": 11,
      "50 Task Completed": 12,
      "5 Days Streak": 13,
      "5 Task Completed": 14,
      "Best Month Contributor": 15,
      "Hackathon Participated": 16,
      "Pro In Cairo": 17,
      "Pro In JS": 18,
      "Pro In Python": 19,
      "Pro In Solidity": 20
    };

    return achievementMap[achievementName] || null;
  }

  static async fetchMintedNFTs(walletAddress: string): Promise<number[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/nft/minted/${walletAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch minted NFTs');
      }

      const data = await response.json();
      return data.minted_achievement_ids || [];
    } catch (error) {
      console.error('Error fetching minted NFTs:', error);
      return [];
    }
  }

  static isValidWalletAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}
