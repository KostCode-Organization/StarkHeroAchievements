from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.nft import nft_service

router = APIRouter()


class MintRequest(BaseModel):
    wallet_address: str
    achievement_id: int
    amount: int = 1


class BatchMintRequest(BaseModel):
    wallet_address: str
    achievement_ids: List[int]
    amounts: List[int]


@router.post("/nft/mint")
async def mint_achievement(request: MintRequest):
    """
    Mint a single achievement NFT to a wallet address
    """
    try:
        result = await nft_service.mint_achievement(
            wallet_address=request.wallet_address,
            achievement_id=request.achievement_id,
            amount=request.amount
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/nft/mint-batch")
async def mint_batch_achievements(request: BatchMintRequest):
    """
    Mint multiple achievement NFTs in a single transaction
    """
    try:
        result = await nft_service.mint_batch_achievements(
            wallet_address=request.wallet_address,
            achievement_ids=request.achievement_ids,
            amounts=request.amounts
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/nft/minted/{wallet_address}")
async def get_minted_nfts(wallet_address: str):
    """
    Get list of minted achievement IDs for a wallet address
    """
    try:
        minted_ids = await nft_service.fetch_minted_nfts(wallet_address)
        return {"minted_achievement_ids": minted_ids}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))