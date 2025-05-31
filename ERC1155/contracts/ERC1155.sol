// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MultiTypeNFT
 * @notice ERC‑1155 contract that lets the owner register new token types and mint them.
 * @dev     Written for OpenZeppelin Contracts v5, where {Ownable} expects the initial owner
 *          as a constructor argument. If you are on OZ v4, just remove `Ownable(msg.sender)`
 *          from the constructor and it will compile.
 */
contract MultiTypeNFT is ERC1155, Ownable {
    // ─────────────────────────────────────────────
    //  State
    // ─────────────────────────────────────────────
    mapping(uint256 => bool) private _exists;      // token ID → defined?
    mapping(uint256 => string) private _tokenURIs; // token ID → metadata URI

    // ─────────────────────────────────────────────
    //  Constructor
    // ─────────────────────────────────────────────

    /**
     * @param baseURI_  Fallback URI used for any token type that has not been
     *                  given its own specific URI via {addTokenType}.
     */
    constructor(string memory baseURI_)
        ERC1155(baseURI_)
        Ownable(msg.sender) 
    {}

    // ─────────────────────────────────────────────
    //  Owner‑only Admin
    // ─────────────────────────────────────────────

    /**
     * @notice Define a brand‑new token type.
     * @param id        New token ID to register.
     * @param tokenURI  Metadata URI for this ID.
     */
    function addTokenType(uint256 id, string calldata tokenURI) external onlyOwner {
        require(!_exists[id], "MultiTypeNFT: type already exists");
        require(bytes(tokenURI).length != 0, "MultiTypeNFT: URI empty");

        _exists[id] = true;
        _tokenURIs[id] = tokenURI;
        emit URI(tokenURI, id); // ERC‑1155 event that signals metadata change
    }

    /**
     * @notice Mint `amount` tokens of ID `id` to `to`.
     */
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external onlyOwner {
        require(_exists[id], "MultiTypeNFT: unknown token type");
        _mint(to, id, amount, data);
    }

    /**
     * @notice Batch variant of {mint}.
     */
    function mintBatch(
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external onlyOwner {
        for (uint256 i; i < ids.length; ++i) {
            require(_exists[ids[i]], "MultiTypeNFT: unknown token type");
        }
        _mintBatch(to, ids, amounts, data);
    }

    // ─────────────────────────────────────────────
    //  Views & Overrides
    // ─────────────────────────────────────────────

    /**
     * @dev Returns the metadata URI for token ID `id`.
     */
    function uri(uint256 id) public view override returns (string memory) {
        string memory tURI = _tokenURIs[id];
        return bytes(tURI).length != 0 ? tURI : super.uri(id);
    }

    /**
     * @dev Does token ID `id` exist?
     */
    function exists(uint256 id) external view returns (bool) {
        return _exists[id];
    }
}
