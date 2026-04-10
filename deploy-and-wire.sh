#!/bin/bash
# deploy-and-wire.sh — Deploy TribunalVerifier to Etherlink testnet and wire address into game

set -e

if [ -z "$PRIVATE_KEY" ]; then
  echo "❌ Set your private key first:"
  echo "   export PRIVATE_KEY=0x..."
  echo ""
  echo "Get testnet XTZ: https://faucet.etherlink.com"
  exit 1
fi

echo "🚀 Deploying TribunalVerifier to Etherlink testnet..."
cd "$(dirname "$0")/deploy"

OUTPUT=$(npx hardhat run scripts/deploy.js --network etherlink_testnet 2>&1)
echo "$OUTPUT"

# Extract deployed address
ADDRESS=$(echo "$OUTPUT" | grep "deployed to:" | awk '{print $NF}')

if [ -z "$ADDRESS" ]; then
  echo "❌ Deployment failed — no address found"
  exit 1
fi

echo ""
echo "✅ Contract deployed: $ADDRESS"

# Write .env for the game
cd ..
echo "VITE_CONTRACT_ADDRESS=$ADDRESS" > .env
echo "📝 Written to .env"

# Rebuild game with contract address
npm run build
echo ""
echo "🎮 Game rebuilt with on-chain contract wired in."
echo "🔗 Explorer: https://testnet.explorer.etherlink.com/address/$ADDRESS"
echo ""
echo "Run: npm run dev"
