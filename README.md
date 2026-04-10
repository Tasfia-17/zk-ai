# ZK-AI Tribunal

<p align="center">
<svg width="320" height="80" viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00ffcc"/>
      <stop offset="50%" style="stop-color:#0088ff"/>
      <stop offset="100%" style="stop-color:#aa00ff"/>
    </linearGradient>
  </defs>
  <rect width="320" height="80" rx="12" fill="#010208"/>
  <!-- Hex icon -->
  <polygon points="30,14 50,14 60,30 50,46 30,46 20,30" fill="none" stroke="#00ffcc" stroke-width="1.5"/>
  <polygon points="34,20 46,20 52,30 46,40 34,40 28,30" fill="none" stroke="#0088ff" stroke-width="1"/>
  <circle cx="40" cy="30" r="5" fill="#00ffcc" opacity="0.8"/>
  <!-- Title text -->
  <text x="72" y="34" font-family="Courier New, monospace" font-size="22" font-weight="900" fill="url(#lg)" letter-spacing="2">ZK-AI TRIBUNAL</text>
  <text x="72" y="54" font-family="Courier New, monospace" font-size="10" fill="#556" letter-spacing="4">VERIFIABLE FAIR PLAY REFEREE</text>
  <!-- Chain badge -->
  <rect x="72" y="60" width="130" height="14" rx="7" fill="rgba(0,255,204,0.08)" stroke="#00ffcc" stroke-width="0.5" opacity="0.6"/>
  <text x="137" y="71" font-family="Courier New, monospace" font-size="8" fill="#00ffcc" text-anchor="middle" letter-spacing="1">TEZOS EVM (ETHERLINK)</text>
</svg>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chain-Etherlink%20Testnet-00ffcc?style=flat-square&labelColor=010208" alt="chain"/>
  <img src="https://img.shields.io/badge/Track-Wild%20Card-aa00ff?style=flat-square&labelColor=010208" alt="track"/>
  <img src="https://img.shields.io/badge/Stack-Three.js%20%2B%20Solidity-0088ff?style=flat-square&labelColor=010208" alt="stack"/>
  <img src="https://img.shields.io/badge/License-MIT-555?style=flat-square&labelColor=010208" alt="license"/>
</p>

---

## What It Is

ZK-AI Tribunal is a social deduction game where an AI referee analyzes player behavior, generates zero-knowledge proofs of its decisions, and settles verdicts on the Tezos EVM (Etherlink) blockchain. Players cannot see the AI model weights or raw behavioral scores -- only the cryptographic commitment and the final verdict are revealed on-chain.

The core problem it solves: AI referees in games are black boxes. Players have no way to verify that a ban, elimination, or penalty was computed fairly. ZK-AI Tribunal makes the AI's decision process verifiable without making it interpretable -- the proof confirms the circuit ran correctly on committed inputs, without leaking the model or the data.

---

## Architecture

<p align="center">
<svg width="700" height="340" viewBox="0 0 700 340" xmlns="http://www.w3.org/2000/svg" font-family="Courier New, monospace">
  <rect width="700" height="340" rx="16" fill="#010208"/>

  <!-- Player Behavior Box -->
  <rect x="20" y="40" width="140" height="80" rx="8" fill="none" stroke="#00ffcc" stroke-width="1" opacity="0.6"/>
  <text x="90" y="68" text-anchor="middle" font-size="10" fill="#00ffcc" letter-spacing="1">PLAYER BEHAVIOR</text>
  <text x="90" y="84" text-anchor="middle" font-size="9" fill="#556">vote patterns</text>
  <text x="90" y="97" text-anchor="middle" font-size="9" fill="#556">timing regularity</text>
  <text x="90" y="110" text-anchor="middle" font-size="9" fill="#556">move variance</text>

  <!-- Arrow 1 -->
  <line x1="160" y1="80" x2="200" y2="80" stroke="#00ffcc" stroke-width="1" opacity="0.5"/>
  <polygon points="200,76 208,80 200,84" fill="#00ffcc" opacity="0.5"/>

  <!-- Feature Extraction -->
  <rect x="208" y="40" width="140" height="80" rx="8" fill="none" stroke="#0088ff" stroke-width="1" opacity="0.6"/>
  <text x="278" y="68" text-anchor="middle" font-size="10" fill="#0088ff" letter-spacing="1">AI INFERENCE</text>
  <text x="278" y="84" text-anchor="middle" font-size="9" fill="#556">4-feature model</text>
  <text x="278" y="97" text-anchor="middle" font-size="9" fill="#556">suspicion score</text>
  <text x="278" y="110" text-anchor="middle" font-size="9" fill="#556">0.0 -- 1.0</text>

  <!-- Arrow 2 -->
  <line x1="348" y1="80" x2="388" y2="80" stroke="#0088ff" stroke-width="1" opacity="0.5"/>
  <polygon points="388,76 396,80 388,84" fill="#0088ff" opacity="0.5"/>

  <!-- ZK Prover -->
  <rect x="396" y="40" width="140" height="80" rx="8" fill="none" stroke="#aa00ff" stroke-width="1" opacity="0.6"/>
  <text x="466" y="68" text-anchor="middle" font-size="10" fill="#aa00ff" letter-spacing="1">ZK PROVER</text>
  <text x="466" y="84" text-anchor="middle" font-size="9" fill="#556">Groth16 circuit</text>
  <text x="466" y="97" text-anchor="middle" font-size="9" fill="#556">commitment pi</text>
  <text x="466" y="110" text-anchor="middle" font-size="9" fill="#556">vk hash</text>

  <!-- Arrow 3 -->
  <line x1="536" y1="80" x2="576" y2="80" stroke="#aa00ff" stroke-width="1" opacity="0.5"/>
  <polygon points="576,76 584,80 576,84" fill="#aa00ff" opacity="0.5"/>

  <!-- On-Chain -->
  <rect x="584" y="40" width="100" height="80" rx="8" fill="none" stroke="#00ffcc" stroke-width="1" opacity="0.6"/>
  <text x="634" y="68" text-anchor="middle" font-size="10" fill="#00ffcc" letter-spacing="1">ETHERLINK</text>
  <text x="634" y="84" text-anchor="middle" font-size="9" fill="#556">recordVerdict()</text>
  <text x="634" y="97" text-anchor="middle" font-size="9" fill="#556">tx confirmed</text>
  <text x="634" y="110" text-anchor="middle" font-size="9" fill="#556">explorer link</text>

  <!-- What is hidden label -->
  <rect x="20" y="155" width="300" height="70" rx="8" fill="rgba(255,50,50,0.04)" stroke="rgba(255,50,50,0.3)" stroke-width="1"/>
  <text x="170" y="175" text-anchor="middle" font-size="10" fill="#ff4444" letter-spacing="2">HIDDEN (private witness)</text>
  <text x="170" y="193" text-anchor="middle" font-size="9" fill="#556">model weights</text>
  <text x="170" y="207" text-anchor="middle" font-size="9" fill="#556">raw behavioral scores per player</text>
  <text x="170" y="221" text-anchor="middle" font-size="9" fill="#556">individual vote targets</text>

  <!-- What is revealed label -->
  <rect x="340" y="155" width="340" height="70" rx="8" fill="rgba(0,255,204,0.04)" stroke="rgba(0,255,204,0.2)" stroke-width="1"/>
  <text x="510" y="175" text-anchor="middle" font-size="10" fill="#00ffcc" letter-spacing="2">REVEALED (public inputs)</text>
  <text x="510" y="193" text-anchor="middle" font-size="9" fill="#556">Pedersen commitment to score</text>
  <text x="510" y="207" text-anchor="middle" font-size="9" fill="#556">analysis hash (behavioral data hash)</text>
  <text x="510" y="221" text-anchor="middle" font-size="9" fill="#556">verdict + confidence + block number</text>

  <!-- Game loop -->
  <rect x="20" y="255" width="660" height="65" rx="8" fill="rgba(0,136,255,0.04)" stroke="rgba(0,136,255,0.2)" stroke-width="1"/>
  <text x="350" y="275" text-anchor="middle" font-size="10" fill="#0088ff" letter-spacing="2">GAME LOOP</text>
  <text x="100" y="295" text-anchor="middle" font-size="9" fill="#556">Discussion</text>
  <text x="100" y="308" text-anchor="middle" font-size="9" fill="#00ffcc">60s</text>
  <line x1="150" y1="300" x2="200" y2="300" stroke="#0088ff" stroke-width="1" opacity="0.4"/>
  <polygon points="200,297 206,300 200,303" fill="#0088ff" opacity="0.4"/>
  <text x="260" y="295" text-anchor="middle" font-size="9" fill="#556">Voting + AI Analysis</text>
  <text x="260" y="308" text-anchor="middle" font-size="9" fill="#00ffcc">30s</text>
  <line x1="320" y1="300" x2="370" y2="300" stroke="#0088ff" stroke-width="1" opacity="0.4"/>
  <polygon points="370,297 376,300 370,303" fill="#0088ff" opacity="0.4"/>
  <text x="430" y="295" text-anchor="middle" font-size="9" fill="#556">ZK Proof + Tribunal</text>
  <text x="430" y="308" text-anchor="middle" font-size="9" fill="#00ffcc">~2s</text>
  <line x1="490" y1="300" x2="540" y2="300" stroke="#0088ff" stroke-width="1" opacity="0.4"/>
  <polygon points="540,297 546,300 540,303" fill="#0088ff" opacity="0.4"/>
  <text x="600" y="295" text-anchor="middle" font-size="9" fill="#556">On-Chain Verdict</text>
  <text x="600" y="308" text-anchor="middle" font-size="9" fill="#00ffcc">Etherlink tx</text>
</svg>
</p>

---

## Players

<p align="center">
<svg width="560" height="120" viewBox="0 0 560 120" xmlns="http://www.w3.org/2000/svg" font-family="Courier New, monospace">
  <rect width="560" height="120" rx="12" fill="#010208"/>

  <!-- Innocent player -->
  <g transform="translate(50,20)">
    <circle cx="0" cy="0" r="18" fill="none" stroke="#00ffcc" stroke-width="1.5"/>
    <polygon points="0,-10 8,5 -8,5" fill="#00ffcc" opacity="0.7"/>
    <circle cx="0" cy="-14" r="5" fill="#00ffcc" opacity="0.7"/>
    <text x="0" y="32" text-anchor="middle" font-size="9" fill="#00ffcc" letter-spacing="1">INNOCENT</text>
    <text x="0" y="44" text-anchor="middle" font-size="8" fill="#556">normal variance</text>
    <text x="0" y="55" text-anchor="middle" font-size="8" fill="#556">random votes</text>
  </g>

  <!-- Traitor player -->
  <g transform="translate(180,20)">
    <circle cx="0" cy="0" r="18" fill="none" stroke="#ff4444" stroke-width="1.5"/>
    <polygon points="0,-10 8,5 -8,5" fill="#ff4444" opacity="0.7"/>
    <circle cx="0" cy="-14" r="5" fill="#ff4444" opacity="0.7"/>
    <text x="0" y="32" text-anchor="middle" font-size="9" fill="#ff4444" letter-spacing="1">TRAITOR</text>
    <text x="0" y="44" text-anchor="middle" font-size="8" fill="#556">colludes with bot</text>
    <text x="0" y="55" text-anchor="middle" font-size="8" fill="#556">targets innocents</text>
  </g>

  <!-- Bot player -->
  <g transform="translate(310,20)">
    <circle cx="0" cy="0" r="18" fill="none" stroke="#ff6600" stroke-width="1.5"/>
    <rect x="-8" y="-12" width="16" height="14" rx="2" fill="#ff6600" opacity="0.6"/>
    <circle cx="-4" cy="-7" r="2" fill="#010208"/>
    <circle cx="4" cy="-7" r="2" fill="#010208"/>
    <rect x="-5" y="-2" width="10" height="2" rx="1" fill="#010208"/>
    <text x="0" y="32" text-anchor="middle" font-size="9" fill="#ff6600" letter-spacing="1">BOT</text>
    <text x="0" y="44" text-anchor="middle" font-size="8" fill="#556">low variance</text>
    <text x="0" y="55" text-anchor="middle" font-size="8" fill="#556">regular timing</text>
  </g>

  <!-- AI Referee -->
  <g transform="translate(450,20)">
    <polygon points="0,-20 17,10 -17,10" fill="none" stroke="#aa00ff" stroke-width="1.5"/>
    <circle cx="0" cy="-4" r="7" fill="#aa00ff" opacity="0.3"/>
    <circle cx="0" cy="-4" r="3" fill="#aa00ff" opacity="0.8"/>
    <text x="0" y="32" text-anchor="middle" font-size="9" fill="#aa00ff" letter-spacing="1">AI REFEREE</text>
    <text x="0" y="44" text-anchor="middle" font-size="8" fill="#556">analyzes all</text>
    <text x="0" y="55" text-anchor="middle" font-size="8" fill="#556">generates proof</text>
  </g>

  <!-- Arrows between roles -->
  <line x1="72" y1="20" x2="158" y2="20" stroke="#555" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="202" y1="20" x2="288" y2="20" stroke="#555" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="332" y1="20" x2="428" y2="20" stroke="#aa00ff" stroke-width="0.5" stroke-dasharray="3,3"/>

  <!-- Bottom label -->
  <text x="280" y="108" text-anchor="middle" font-size="9" fill="#333" letter-spacing="2">6 PLAYERS PER ROUND -- 1 TRAITOR -- 1 BOT -- 4 INNOCENTS</text>
</svg>
</p>

---

## AI Model -- Behavioral Classifier

The AI referee scores each active player on four features every voting phase. The weighted sum produces a suspicion score from 0.0 to 1.0. Players above 0.65 are flagged as suspects.

```
suspicion = (behavioral_variance   * 0.35)
          + (vote_correlation       * 0.30)
          + (timing_regularity      * 0.20)
          + (role_signal            * 0.15)
          + noise(0.08)
```

| Feature | Description | Bot signal |
|---------|-------------|-----------|
| Behavioral variance | Standard deviation of action values | Low variance = automated |
| Vote correlation | Alignment with known colluder votes | High correlation = collusion |
| Timing regularity | Coefficient of variation of action intervals | Low CV = scripted timing |
| Role signal | Ground truth from game state (hidden from players) | Used only inside the ZK circuit |

The role signal is the only feature that touches ground truth. In a production ZKML deployment (EZKL + Groth16), this would be a committed model weight -- players can verify the circuit ran correctly without learning which feature drove the verdict.

---

## ZK Proof System

The proof flow simulates a Groth16 ZKML pipeline:

```
1. Witness commitment    -- player behavior logs hashed into a witness
2. Constraint system     -- inference circuit encoded as R1CS constraints
3. Groth16 prover        -- generates proof pi from witness + proving key
4. Verification key      -- vk_hash committed on-chain
5. Public inputs         -- score_commit, analysis_hash, round, player_count
6. On-chain settlement   -- TribunalVerifier.recordVerdict() called on Etherlink
```

What the proof guarantees:
- The AI ran a specific circuit (identified by vk_hash) on specific inputs (identified by analysis_hash)
- The output (guilty/innocent) is consistent with those inputs
- The model weights and raw scores are not revealed

What it does not guarantee (simulation scope):
- The circuit is not yet compiled from a real neural network via EZKL
- The Groth16 proof is simulated, not cryptographically sound
- Production deployment would use EZKL to compile the model and generate real proofs

---

## Smart Contract

**TribunalVerifier.sol** -- deployed on Etherlink Testnet (chainId 128123)

```solidity
function recordVerdict(
    uint256 proofId,
    uint256 round,
    bytes32 commitment,      // Pedersen commitment to suspicion score
    bytes32 analysisHash,    // Hash of behavioral analysis (public)
    bytes32 proofPi,         // Groth16 proof pi (first 32 bytes)
    bytes32 vkHash,          // Verification key hash
    bool guilty,
    uint256 confidence
) external

function disputeVerdict(uint256 proofId) external   // 1-hour dispute window
function verifyCommitment(bytes32 commitment, uint256 score, uint256 blindingFactor) external pure returns (bool)
```

Every verdict emits a `VerdictRecorded` event with the commitment, analysis hash, and verdict. Players can independently verify the commitment opening using `verifyCommitment()`.

---

## Project Structure

```
zk-ai-tribunal/
|-- index.html                    # Game shell + all CSS
|-- vite.config.js
|-- package.json
|-- src/
|   |-- main.js                   # Three.js renderer + entry point
|   |-- core/
|   |   |-- Constants.js          # All config values
|   |   |-- EventBus.js           # Pub/sub communication
|   |   `-- GameState.js          # Single source of truth
|   |-- game/
|   |   |-- Arena.js              # 3D tribunal arena (Three.js)
|   |   |-- PlayerData.js         # Player data model + behavior logging
|   |   |-- PlayerMesh.js         # 3D player avatars with suspicion rings
|   |   |-- NPCController.js      # AI-driven NPC movement and chat
|   |   `-- GameLoop.js           # Phase management and round logic
|   |-- ai/
|   |   `-- AIReferee.js          # 4-feature behavioral classifier
|   |-- zk/
|   |   `-- ZKProver.js           # Groth16 proof simulation
|   |-- contracts/
|   |   |-- OnChainSettler.js     # Ethers.js v6 Etherlink client
|   |   `-- TribunalVerifier.abi.json
|   |-- systems/
|   |   `-- ParticleSystem.js     # Ambient particles + ZK beam
|   `-- ui/
|       |-- GameUI.js             # All DOM UI management
|       `-- TitleScene.js         # 3D animated title screen
`-- contracts/
    `-- TribunalVerifier.sol      # On-chain verifier contract
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| 3D Engine | Three.js 0.183 |
| Build | Vite 7 |
| Smart Contract | Solidity 0.8.20 |
| Chain | Tezos EVM -- Etherlink (chainId 128123) |
| Wallet | ethers.js v6 + MetaMask |
| ZK Proof | Groth16 simulation (EZKL pattern) |
| AI Model | Multi-feature behavioral classifier |
| Deploy | Hardhat 3 |

---

## Setup and Run

```bash
# Install and run locally
npm install
npm run dev
# Open http://localhost:3000
```

### Deploy contract to Etherlink testnet

```bash
# Get testnet XTZ from https://faucet.etherlink.com

export PRIVATE_KEY=0xYOUR_PRIVATE_KEY
./deploy-and-wire.sh
```

This deploys `TribunalVerifier.sol` to Etherlink Ghostnet, writes the address to `.env`, and rebuilds the game. After that, every in-game verdict calls `recordVerdict()` on-chain and shows a live explorer link.

### Connect wallet in-game

Click the wallet status indicator (top-right HUD). MetaMask will prompt to switch to Etherlink Testnet. Once connected, verdicts are submitted as real transactions.

---

## Etherlink Integration

- **Network**: Etherlink Testnet (Ghostnet), chainId 128123
- **RPC**: https://etherlink-testnet.rpc.thirdweb.com
- **Explorer**: https://testnet.explorer.etherlink.com
- **Contract**: TribunalVerifier.sol
- **Wallet auto-switch**: The game calls `wallet_addEthereumChain` to add Etherlink to MetaMask automatically

The game runs fully without a wallet (offline mode). When a wallet is connected and the contract is deployed, every verdict is a real on-chain transaction.

---

## Hackathon Submission

- **Event**: Tezos EVM Hackathon 2026
- **Track**: Wild Card
- **Presented by**: Now Media + Trilitech
- **Build period**: March 23 -- April 9, 2026

### Judging criteria addressed

| Criterion | How |
|-----------|-----|
| AI agents interacting with smart contracts | AI referee generates verdicts submitted to TribunalVerifier.sol |
| On-chain AI governance | Players can dispute verdicts on-chain within a 1-hour window |
| Creative applications | First social deduction game with ZK-verifiable AI referee |
| Reach and ecosystem impact | Browser game, no install, playable by anyone |
| Technical execution | Full Three.js 3D game, real Solidity contract, ethers.js integration |

---

## Team

**Tasfia-17**

---

## License

MIT
