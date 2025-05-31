/**
 * @file MultiTypeNFT.test.js
 * @notice Hardhat tests for the MultiTypeNFT ERC‑1155 contract.
 *
 *  ⚠️  Note: This version uses **CommonJS require()** (the same style as the default
 *            Hardhat sample tests). Destructuring `ethers` at require‑time avoids the
 *            timing issue that made `ethers` undefined in TypeScript/Esm‑style imports.
 *
 *  To run:
 *     1. Ensure your hardhat.config.js contains `require("@nomicfoundation/hardhat-toolbox");`
 *     2. `npx hardhat test`
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

async function deployFixture() {
  const [owner, alice, bob] = await ethers.getSigners();
  const MultiTypeNFT = await ethers.getContractFactory("MultiTypeNFT");
  const nft = await MultiTypeNFT.deploy("ipfs://base/");
  await nft.waitForDeployment();
  return { owner, alice, bob, nft };
}

const TOKEN_ID = 1;
const TOKEN_URI = "ipfs://token/metadata.json";

// ─────────────────────────────────────────────────────────────────────────────
//  Test Suite
// ─────────────────────────────────────────────────────────────────────────────

describe("MultiTypeNFT", function () {
  // ───────────── Deployment ─────────────
  describe("Deployment", function () {
    it("sets the deployer as owner", async function () {
      const { owner, nft } = await loadFixture(deployFixture);
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("stores the base URI", async function () {
      const { nft } = await loadFixture(deployFixture);
      expect(await nft.uri(9999)).to.equal("ipfs://base/");
    });
  });

  // ───────────── addTokenType ─────────────
  describe("addTokenType", function () {
    it("allows the owner to register a new token type and emits URI", async function () {
      const { nft } = await loadFixture(deployFixture);
      await expect(nft.addTokenType(TOKEN_ID, TOKEN_URI))
        .to.emit(nft, "URI")
        .withArgs(TOKEN_URI, TOKEN_ID);
      expect(await nft.exists(TOKEN_ID)).to.equal(true);
    });

    it("reverts when a non-owner calls it", async function () {
      const { alice, nft } = await loadFixture(deployFixture);
      await expect(
        nft.connect(alice).addTokenType(TOKEN_ID, TOKEN_URI)
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });

    it("reverts if the token ID is already registered", async function () {
      const { nft } = await loadFixture(deployFixture);
      await nft.addTokenType(TOKEN_ID, TOKEN_URI);
      await expect(nft.addTokenType(TOKEN_ID, TOKEN_URI)).to.be.revertedWith(
        "MultiTypeNFT: type already exists"
      );
    });

    it("reverts on empty URI", async function () {
      const { nft } = await loadFixture(deployFixture);
      await expect(nft.addTokenType(TOKEN_ID, "")).to.be.revertedWith(
        "MultiTypeNFT: URI empty"
      );
    });
  });

  // ───────────── mint ─────────────
  describe("mint", function () {
    it("mints tokens for owner once type registered", async function () {
      const { nft, alice } = await loadFixture(deployFixture);
      await nft.addTokenType(TOKEN_ID, TOKEN_URI);
      await nft.mint(alice.address, TOKEN_ID, 5n, "0x");
      expect(await nft.balanceOf(alice.address, TOKEN_ID)).to.equal(5n);
    });

    it("reverts if called by non-owner", async function () {
      const { nft, alice } = await loadFixture(deployFixture);
      await nft.addTokenType(TOKEN_ID, TOKEN_URI);
      await expect(
        nft.connect(alice).mint(alice.address, TOKEN_ID, 1n, "0x")
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });

    it("reverts if token type not registered", async function () {
      const { nft, alice } = await loadFixture(deployFixture);
      await expect(
        nft.mint(alice.address, TOKEN_ID, 1n, "0x")
      ).to.be.revertedWith("MultiTypeNFT: unknown token type");
    });
  });

  // ───────────── mintBatch ─────────────
  describe("mintBatch", function () {
    it("mints batch of tokens correctly", async function () {
      const { nft, alice } = await loadFixture(deployFixture);
      const ids = [1, 2, 3];
      const amounts = [2n, 4n, 6n];

      // Register each type first
      for (const id of ids) {
        await nft.addTokenType(id, `${TOKEN_URI}?id=${id}`);
      }

      await nft.mintBatch(alice.address, ids, amounts, "0x");

      for (let i = 0; i < ids.length; ++i) {
        expect(await nft.balanceOf(alice.address, ids[i])).to.equal(amounts[i]);
      }
    });

    it("reverts if any ID is unknown", async function () {
      const { nft, alice } = await loadFixture(deployFixture);
      await nft.addTokenType(1, TOKEN_URI);
      await expect(
        nft.mintBatch(alice.address, [1, 2], [1n, 1n], "0x")
      ).to.be.revertedWith("MultiTypeNFT: unknown token type");
    });

    it("reverts if called by non-owner", async function () {
      const { nft, alice } = await loadFixture(deployFixture);
      await nft.addTokenType(TOKEN_ID, TOKEN_URI);
      await expect(
        nft.connect(alice).mintBatch(alice.address, [TOKEN_ID], [1n], "0x")
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });
  });

  // ───────────── uri() ─────────────
  describe("uri", function () {
    it("returns per-token URI if set, otherwise base URI", async function () {
      const { nft } = await loadFixture(deployFixture);
      await nft.addTokenType(TOKEN_ID, TOKEN_URI);
      expect(await nft.uri(TOKEN_ID)).to.equal(TOKEN_URI);
      expect(await nft.uri(9999)).to.equal("ipfs://base/");
    });
  });
});
