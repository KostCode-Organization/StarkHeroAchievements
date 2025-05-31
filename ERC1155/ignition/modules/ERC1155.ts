const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("NFTModule", (m) => {
  const token = m.contract("ERC1155");

  return { token };
});

module.exports = TokenModule;

export default TokenModule;
