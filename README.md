# ZK-AI Tribunal

<p align="center">
  <img src="assets/logo.svg" alt="ZK-AI Tribunal" width="480"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chain-Etherlink%20Testnet-00ffcc?style=flat-square&labelColor=010208" alt="chain"/>
  <img src="https://img.shields.io/badge/Track-Wild%20Card-aa00ff?style=flat-square&labelColor=010208" alt="track"/>
  <img src="https://img.shields.io/badge/AI-Behavioral%20Classifier-0088ff?style=flat-square&labelColor=010208" alt="ai"/>
  <img src="https://img.shields.io/badge/ZK-Groth16%20Proof-ff6600?style=flat-square&labelColor=010208" alt="zk"/>
  <img src="https://img.shields.io/badge/License-MIT-555?style=flat-square&labelColor=010208" alt="license"/>
</p>

---

## What It Is

ZK-AI Tribunal is a 3D social deduction game where an AI referee watches every player, scores their behavior, and generates a zero-knowledge proof of its verdict — then settles it on the Tezos EVM (Etherlink) blockchain. Players can verify the AI was fair without ever seeing the model weights or raw scores.

<p align="center">
  <img src="assets/architecture.svg" alt="Architecture" width="560"/>
</p>

---

## The Players

<p align="center">
  <img src="assets/players.svg" alt="Players" width="520"/>
</p>

---

## AI Model

<p align="center">
  <img src="assets/ai-model.svg" alt="AI Model" width="500"/>
</p>

---

## ZK Proof Flow

<p align="center">
  <img src="assets/zk-flow.svg" alt="ZK Proof Flow" width="500"/>
</p>

---

## Game Loop

<p align="center">
  <img src="assets/game-loop.svg" alt="Game Loop" width="500"/>
</p>

---

## Smart Contract

<p align="center">
  <img src="assets/contract.svg" alt="Smart Contract" width="500"/>
</p>

---

## Tech Stack

<p align="center">
  <img src="assets/tech-stack.svg" alt="Tech Stack" width="500"/>
</p>

---

## Setup

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Deploy to Etherlink testnet

```bash
# get testnet XTZ from https://faucet.etherlink.com
export PRIVATE_KEY=0xYOUR_KEY
./deploy-and-wire.sh
```

### Project structure

```
src/
  core/        EventBus  GameState  Constants
  game/        Arena  PlayerData  PlayerMesh  NPCController  GameLoop
  ai/          AIReferee (4-feature behavioral classifier)
  zk/          ZKProver (Groth16 simulation)
  contracts/   OnChainSettler  TribunalVerifier.abi.json
  systems/     ParticleSystem
  ui/          GameUI  TitleScene
contracts/
  TribunalVerifier.sol
deploy/
  hardhat.config.js  scripts/deploy.js
```

---

## Hackathon

- Event: Tezos EVM Hackathon 2026
- Track: Wild Card
- Presented by: Now Media + Trilitech
- Build period: March 23 to April 9, 2026

| Criterion | How addressed |
|-----------|--------------|
| AI agents interacting with smart contracts | AI referee submits verdicts to TribunalVerifier.sol |
| On-chain AI governance | 1-hour dispute window, disputeVerdict() on-chain |
| Creative applications | First social deduction game with ZK-verifiable AI referee |
| Technical execution | Full 3D game, real Solidity contract, ethers.js v6 |

---

## Team

Tasfia-17

---

## License

MIT
