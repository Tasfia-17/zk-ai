import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "XTZ");

  if (balance === 0n) {
    console.error("\n❌ No balance. Get testnet XTZ from: https://faucet.etherlink.com");
    process.exit(1);
  }

  const Factory = await ethers.getContractFactory("TribunalVerifier");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\n✅ TribunalVerifier deployed to:", address);
  console.log("🔗 Explorer: https://testnet.explorer.etherlink.com/address/" + address);
  console.log("\nAdd to your .env:");
  console.log("VITE_CONTRACT_ADDRESS=" + address);
}

main().catch((e) => { console.error(e); process.exit(1); });
