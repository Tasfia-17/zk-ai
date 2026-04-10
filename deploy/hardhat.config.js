import "@nomicfoundation/hardhat-ethers";

export default {
  solidity: "0.8.20",
  networks: {
    etherlink_testnet: {
      type: "http",
      url: "https://etherlink-testnet.rpc.thirdweb.com",
      chainId: 128123,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    etherlink_mainnet: {
      type: "http",
      url: "https://etherlink.rpc.thirdweb.com",
      chainId: 42793,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
