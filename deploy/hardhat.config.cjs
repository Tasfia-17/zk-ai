require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
  networks: {
    etherlink_testnet: {
      url: "https://node.ghostnet.etherlink.com",
      chainId: 128123,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    etherlink_mainnet: {
      url: "https://node.mainnet.etherlink.com",
      chainId: 42793,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
