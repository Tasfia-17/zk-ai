<p align="center">
<svg width="480" height="100" viewBox="0 0 480 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00ffcc"/>
      <stop offset="50%" stop-color="#0088ff"/>
      <stop offset="100%" stop-color="#aa00ff"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="480" height="100" rx="16" fill="#010208"/>
  <polygon points="44,18 60,18 68,32 60,46 44,46 36,32" fill="none" stroke="#00ffcc" stroke-width="2" filter="url(#glow)"/>
  <polygon points="47,24 57,24 62,32 57,40 47,40 42,32" fill="none" stroke="#0088ff" stroke-width="1.2"/>
  <circle cx="52" cy="32" r="4" fill="#00ffcc" filter="url(#glow)"/>
  <circle cx="52" cy="32" r="2" fill="#fff"/>
  <text x="84" y="40" font-family="Courier New,monospace" font-size="26" font-weight="900" fill="url(#g1)" letter-spacing="2">ZK-AI TRIBUNAL</text>
  <text x="84" y="58" font-family="Courier New,monospace" font-size="11" fill="#445" letter-spacing="4">VERIFIABLE FAIR PLAY REFEREE</text>
  <rect x="84" y="66" width="160" height="18" rx="9" fill="rgba(0,255,204,0.07)" stroke="#00ffcc" stroke-width="0.8"/>
  <text x="164" y="79" font-family="Courier New,monospace" font-size="9" fill="#00ffcc" text-anchor="middle" letter-spacing="2">TEZOS EVM  ETHERLINK</text>
</svg>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chain-Etherlink%20Testnet-00ffcc?style=flat-square&labelColor=010208"/>
  <img src="https://img.shields.io/badge/Track-Wild%20Card-aa00ff?style=flat-square&labelColor=010208"/>
  <img src="https://img.shields.io/badge/AI-Behavioral%20Classifier-0088ff?style=flat-square&labelColor=010208"/>
  <img src="https://img.shields.io/badge/ZK-Groth16%20Proof-ff6600?style=flat-square&labelColor=010208"/>
  <img src="https://img.shields.io/badge/License-MIT-555?style=flat-square&labelColor=010208"/>
</p>

---

## What It Is

ZK-AI Tribunal is a 3D social deduction game where an AI referee watches every player, scores their behavior, and generates a zero-knowledge proof of its verdict -- then settles it on the Tezos EVM (Etherlink) blockchain. Players can verify the AI was fair without ever seeing the model weights or raw scores.

<p align="center">
<svg width="560" height="80" viewBox="0 0 560 80" xmlns="http://www.w3.org/2000/svg" font-family="Courier New,monospace">
  <rect width="560" height="80" rx="12" fill="#010208"/>
  <rect x="10" y="14" width="120" height="52" rx="8" fill="rgba(0,255,204,0.06)" stroke="#00ffcc" stroke-width="1"/>
  <text x="70" y="36" text-anchor="middle" font-size="11" fill="#00ffcc">AI watches</text>
  <text x="70" y="52" text-anchor="middle" font-size="9" fill="#445">behavior patterns</text>
  <text x="70" y="63" text-anchor="middle" font-size="9" fill="#445">vote timing</text>
  <polygon points="134,40 148,36 148,44" fill="#00ffcc" opacity="0.6"/>
  <rect x="152" y="14" width="120" height="52" rx="8" fill="rgba(0,136,255,0.06)" stroke="#0088ff" stroke-width="1"/>
  <text x="212" y="36" text-anchor="middle" font-size="11" fill="#0088ff">ZK proof</text>
  <text x="212" y="52" text-anchor="middle" font-size="9" fill="#445">Groth16 circuit</text>
  <text x="212" y="63" text-anchor="middle" font-size="9" fill="#445">commitment</text>
  <polygon points="276,40 290,36 290,44" fill="#0088ff" opacity="0.6"/>
  <rect x="294" y="14" width="120" height="52" rx="8" fill="rgba(170,0,255,0.06)" stroke="#aa00ff" stroke-width="1"/>
  <text x="354" y="36" text-anchor="middle" font-size="11" fill="#aa00ff">On-chain</text>
  <text x="354" y="52" text-anchor="middle" font-size="9" fill="#445">Etherlink tx</text>
  <text x="354" y="63" text-anchor="middle" font-size="9" fill="#445">explorer link</text>
  <polygon points="418,40 432,36 432,44" fill="#aa00ff" opacity="0.6"/>
  <rect x="436" y="14" width="114" height="52" rx="8" fill="rgba(0,255,136,0.06)" stroke="#00ff88" stroke-width="1"/>
  <text x="493" y="36" text-anchor="middle" font-size="11" fill="#00ff88">Verdict</text>
  <text x="493" y="52" text-anchor="middle" font-size="9" fill="#445">accept or</text>
  <text x="493" y="63" text-anchor="middle" font-size="9" fill="#445">dispute</text>
</svg>
</p>

---

## The Players

<p align="center">
<svg width="520" height="140" viewBox="0 0 520 140" xmlns="http://www.w3.org/2000/svg" font-family="Courier New,monospace">
  <rect width="520" height="140" rx="12" fill="#010208"/>

  <!-- Innocent -->
  <g transform="translate(70,30)">
    <circle cx="0" cy="0" r="22" fill="rgba(0,255,204,0.08)" stroke="#00ffcc" stroke-width="1.5"/>
    <circle cx="0" cy="-7" r="7" fill="#00ffcc" opacity="0.7"/>
    <rect x="-7" y="2" width="14" height="10" rx="3" fill="#00ffcc" opacity="0.5"/>
    <line x1="-7" y1="7" x2="-13" y2="14" stroke="#00ffcc" stroke-width="2" opacity="0.5"/>
    <line x1="7" y1="7" x2="13" y2="14" stroke="#00ffcc" stroke-width="2" opacity="0.5"/>
    <line x1="-4" y1="12" x2="-4" y2="20" stroke="#00ffcc" stroke-width="2" opacity="0.5"/>
    <line x1="4" y1="12" x2="4" y2="20" stroke="#00ffcc" stroke-width="2" opacity="0.5"/>
    <circle cx="8" cy="-10" r="3" fill="#00ffcc" opacity="0.4"/>
    <text x="0" y="42" text-anchor="middle" font-size="10" fill="#00ffcc" letter-spacing="1">INNOCENT</text>
    <text x="0" y="55" text-anchor="middle" font-size="8" fill="#445">normal behavior</text>
    <text x="0" y="66" text-anchor="middle" font-size="8" fill="#445">random votes</text>
  </g>

  <!-- Traitor -->
  <g transform="translate(200,30)">
    <circle cx="0" cy="0" r="22" fill="rgba(255,50,50,0.08)" stroke="#ff4444" stroke-width="1.5"/>
    <circle cx="0" cy="-7" r="7" fill="#ff4444" opacity="0.7"/>
    <rect x="-7" y="2" width="14" height="10" rx="3" fill="#ff4444" opacity="0.5"/>
    <line x1="-7" y1="7" x2="-13" y2="14" stroke="#ff4444" stroke-width="2" opacity="0.5"/>
    <line x1="7" y1="7" x2="13" y2="14" stroke="#ff4444" stroke-width="2" opacity="0.5"/>
    <line x1="-4" y1="12" x2="-4" y2="20" stroke="#ff4444" stroke-width="2" opacity="0.5"/>
    <line x1="4" y1="12" x2="4" y2="20" stroke="#ff4444" stroke-width="2" opacity="0.5"/>
    <path d="M-6,-14 Q0,-20 6,-14" fill="none" stroke="#ff4444" stroke-width="1.5" opacity="0.6"/>
    <text x="0" y="42" text-anchor="middle" font-size="10" fill="#ff4444" letter-spacing="1">TRAITOR</text>
    <text x="0" y="55" text-anchor="middle" font-size="8" fill="#445">colludes secretly</text>
    <text x="0" y="66" text-anchor="middle" font-size="8" fill="#445">targets innocents</text>
  </g>

  <!-- Bot -->
  <g transform="translate(330,30)">
    <circle cx="0" cy="0" r="22" fill="rgba(255,102,0,0.08)" stroke="#ff6600" stroke-width="1.5"/>
    <rect x="-9" y="-16" width="18" height="14" rx="3" fill="#ff6600" opacity="0.6"/>
    <circle cx="-4" cy="-11" r="2.5" fill="#010208"/>
    <circle cx="4" cy="-11" r="2.5" fill="#010208"/>
    <rect x="-5" y="-5" width="10" height="2" rx="1" fill="#010208"/>
    <rect x="-7" y="2" width="14" height="10" rx="3" fill="#ff6600" opacity="0.4"/>
    <line x1="-7" y1="7" x2="-13" y2="14" stroke="#ff6600" stroke-width="2" opacity="0.5"/>
    <line x1="7" y1="7" x2="13" y2="14" stroke="#ff6600" stroke-width="2" opacity="0.5"/>
    <text x="0" y="42" text-anchor="middle" font-size="10" fill="#ff6600" letter-spacing="1">BOT</text>
    <text x="0" y="55" text-anchor="middle" font-size="8" fill="#445">low variance</text>
    <text x="0" y="66" text-anchor="middle" font-size="8" fill="#445">regular timing</text>
  </g>

  <!-- AI Referee -->
  <g transform="translate(460,30)">
    <circle cx="0" cy="0" r="22" fill="rgba(170,0,255,0.08)" stroke="#aa00ff" stroke-width="1.5"/>
    <polygon points="0,-16 10,4 -10,4" fill="none" stroke="#aa00ff" stroke-width="1.5" opacity="0.8"/>
    <circle cx="0" cy="-4" r="5" fill="#aa00ff" opacity="0.4"/>
    <circle cx="0" cy="-4" r="2" fill="#aa00ff" opacity="0.9"/>
    <line x1="-14" y1="0" x2="-22" y2="-6" stroke="#aa00ff" stroke-width="1" opacity="0.4"/>
    <line x1="14" y1="0" x2="22" y2="-6" stroke="#aa00ff" stroke-width="1" opacity="0.4"/>
    <text x="0" y="42" text-anchor="middle" font-size="10" fill="#aa00ff" letter-spacing="1">AI REFEREE</text>
    <text x="0" y="55" text-anchor="middle" font-size="8" fill="#445">watches all</text>
    <text x="0" y="66" text-anchor="middle" font-size="8" fill="#445">proves verdict</text>
  </g>

  <text x="260" y="128" text-anchor="middle" font-size="9" fill="#333" letter-spacing="3">6 PLAYERS PER ROUND  --  1 TRAITOR  --  1 BOT  --  4 INNOCENTS</text>
</svg>
</p>

---

## AI Model

<p align="center">
<svg width="500" height="200" viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" font-family="Courier New,monospace">
  <rect width="500" height="200" rx="12" fill="#010208"/>
  <text x="250" y="24" text-anchor="middle" font-size="11" fill="#0088ff" letter-spacing="3">SUSPICION SCORE BREAKDOWN</text>

  <!-- Bar 1: behavioral variance 35% -->
  <text x="14" y="50" font-size="9" fill="#00ffcc">behavioral variance</text>
  <rect x="160" y="38" width="175" height="14" rx="7" fill="rgba(0,255,204,0.08)" stroke="#00ffcc" stroke-width="0.5"/>
  <rect x="160" y="38" width="175" height="14" rx="7" fill="#00ffcc" opacity="0.5"/>
  <text x="344" y="50" font-size="9" fill="#00ffcc">35%</text>
  <text x="420" y="50" font-size="8" fill="#445">low = bot-like</text>

  <!-- Bar 2: vote correlation 30% -->
  <text x="14" y="80" font-size="9" fill="#0088ff">vote correlation</text>
  <rect x="160" y="68" width="150" height="14" rx="7" fill="rgba(0,136,255,0.08)" stroke="#0088ff" stroke-width="0.5"/>
  <rect x="160" y="68" width="150" height="14" rx="7" fill="#0088ff" opacity="0.5"/>
  <text x="318" y="80" font-size="9" fill="#0088ff">30%</text>
  <text x="420" y="80" font-size="8" fill="#445">high = collusion</text>

  <!-- Bar 3: timing regularity 20% -->
  <text x="14" y="110" font-size="9" fill="#aa00ff">timing regularity</text>
  <rect x="160" y="98" width="100" height="14" rx="7" fill="rgba(170,0,255,0.08)" stroke="#aa00ff" stroke-width="0.5"/>
  <rect x="160" y="98" width="100" height="14" rx="7" fill="#aa00ff" opacity="0.5"/>
  <text x="268" y="110" font-size="9" fill="#aa00ff">20%</text>
  <text x="420" y="110" font-size="8" fill="#445">regular = scripted</text>

  <!-- Bar 4: role signal 15% -->
  <text x="14" y="140" font-size="9" fill="#ff6600">role signal</text>
  <rect x="160" y="128" width="75" height="14" rx="7" fill="rgba(255,102,0,0.08)" stroke="#ff6600" stroke-width="0.5"/>
  <rect x="160" y="128" width="75" height="14" rx="7" fill="#ff6600" opacity="0.5"/>
  <text x="243" y="140" font-size="9" fill="#ff6600">15%</text>
  <text x="420" y="140" font-size="8" fill="#445">hidden in ZK</text>

  <!-- Threshold line -->
  <line x1="160" y1="158" x2="490" y2="158" stroke="#333" stroke-width="0.5"/>
  <rect x="160" y="162" width="325" height="28" rx="6" fill="rgba(255,50,50,0.06)" stroke="rgba(255,50,50,0.3)" stroke-width="0.8"/>
  <text x="322" y="178" text-anchor="middle" font-size="9" fill="#ff4444" letter-spacing="1">score above 0.65  =  flagged as suspect</text>
</svg>
</p>

---

## ZK Proof Flow

<p align="center">
<svg width="500" height="260" viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg" font-family="Courier New,monospace">
  <rect width="500" height="260" rx="12" fill="#010208"/>

  <!-- Step bubbles -->
  <!-- 1 -->
  <circle cx="50" cy="50" r="18" fill="rgba(0,255,204,0.1)" stroke="#00ffcc" stroke-width="1.5"/>
  <text x="50" y="54" text-anchor="middle" font-size="13" fill="#00ffcc" font-weight="bold">1</text>
  <text x="80" y="46" font-size="10" fill="#ccc">Witness Commitment</text>
  <text x="80" y="60" font-size="9" fill="#445">behavior logs hashed into witness</text>

  <!-- 2 -->
  <circle cx="50" cy="100" r="18" fill="rgba(0,136,255,0.1)" stroke="#0088ff" stroke-width="1.5"/>
  <text x="50" y="104" text-anchor="middle" font-size="13" fill="#0088ff" font-weight="bold">2</text>
  <text x="80" y="96" font-size="10" fill="#ccc">Constraint System</text>
  <text x="80" y="110" font-size="9" fill="#445">inference encoded as R1CS constraints</text>

  <!-- 3 -->
  <circle cx="50" cy="150" r="18" fill="rgba(170,0,255,0.1)" stroke="#aa00ff" stroke-width="1.5"/>
  <text x="50" y="154" text-anchor="middle" font-size="13" fill="#aa00ff" font-weight="bold">3</text>
  <text x="80" y="146" font-size="10" fill="#ccc">Groth16 Prover</text>
  <text x="80" y="160" font-size="9" fill="#445">proof pi generated from witness + proving key</text>

  <!-- 4 -->
  <circle cx="50" cy="200" r="18" fill="rgba(255,102,0,0.1)" stroke="#ff6600" stroke-width="1.5"/>
  <text x="50" y="204" text-anchor="middle" font-size="13" fill="#ff6600" font-weight="bold">4</text>
  <text x="80" y="196" font-size="10" fill="#ccc">On-Chain Settlement</text>
  <text x="80" y="210" font-size="9" fill="#445">TribunalVerifier.recordVerdict() on Etherlink</text>

  <!-- Connector lines -->
  <line x1="50" y1="68" x2="50" y2="82" stroke="#333" stroke-width="1" stroke-dasharray="3,2"/>
  <line x1="50" y1="118" x2="50" y2="132" stroke="#333" stroke-width="1" stroke-dasharray="3,2"/>
  <line x1="50" y1="168" x2="50" y2="182" stroke="#333" stroke-width="1" stroke-dasharray="3,2"/>

  <!-- Hidden vs revealed box -->
  <rect x="14" y="228" width="220" height="24" rx="6" fill="rgba(255,50,50,0.05)" stroke="rgba(255,50,50,0.25)" stroke-width="0.8"/>
  <text x="124" y="244" text-anchor="middle" font-size="9" fill="#ff4444" letter-spacing="1">HIDDEN: weights  scores  raw data</text>

  <rect x="244" y="228" width="242" height="24" rx="6" fill="rgba(0,255,204,0.05)" stroke="rgba(0,255,204,0.2)" stroke-width="0.8"/>
  <text x="365" y="244" text-anchor="middle" font-size="9" fill="#00ffcc" letter-spacing="1">PUBLIC: commitment  hash  verdict</text>
</svg>
</p>

---

## Game Loop

<p align="center">
<svg width="500" height="90" viewBox="0 0 500 90" xmlns="http://www.w3.org/2000/svg" font-family="Courier New,monospace">
  <rect width="500" height="90" rx="12" fill="#010208"/>

  <rect x="10" y="20" width="100" height="50" rx="10" fill="rgba(0,255,204,0.07)" stroke="#00ffcc" stroke-width="1"/>
  <text x="60" y="42" text-anchor="middle" font-size="10" fill="#00ffcc">Discussion</text>
  <text x="60" y="57" text-anchor="middle" font-size="9" fill="#445">60 seconds</text>
  <text x="60" y="68" text-anchor="middle" font-size="8" fill="#333">observe NPCs</text>

  <polygon points="114,45 126,41 126,49" fill="#00ffcc" opacity="0.5"/>

  <rect x="130" y="20" width="100" height="50" rx="10" fill="rgba(0,136,255,0.07)" stroke="#0088ff" stroke-width="1"/>
  <text x="180" y="42" text-anchor="middle" font-size="10" fill="#0088ff">Voting</text>
  <text x="180" y="57" text-anchor="middle" font-size="9" fill="#445">30 seconds</text>
  <text x="180" y="68" text-anchor="middle" font-size="8" fill="#333">AI analyzes</text>

  <polygon points="234,45 246,41 246,49" fill="#0088ff" opacity="0.5"/>

  <rect x="250" y="20" width="100" height="50" rx="10" fill="rgba(170,0,255,0.07)" stroke="#aa00ff" stroke-width="1"/>
  <text x="300" y="42" text-anchor="middle" font-size="10" fill="#aa00ff">Tribunal</text>
  <text x="300" y="57" text-anchor="middle" font-size="9" fill="#445">ZK proof</text>
  <text x="300" y="68" text-anchor="middle" font-size="8" fill="#333">~2 seconds</text>

  <polygon points="354,45 366,41 366,49" fill="#aa00ff" opacity="0.5"/>

  <rect x="370" y="20" width="120" height="50" rx="10" fill="rgba(0,255,136,0.07)" stroke="#00ff88" stroke-width="1"/>
  <text x="430" y="42" text-anchor="middle" font-size="10" fill="#00ff88">Verdict</text>
  <text x="430" y="57" text-anchor="middle" font-size="9" fill="#445">Etherlink tx</text>
  <text x="430" y="68" text-anchor="middle" font-size="8" fill="#333">accept / dispute</text>
</svg>
</p>

---

## Smart Contract

<p align="center">
<svg width="500" height="160" viewBox="0 0 500 160" xmlns="http://www.w3.org/2000/svg" font-family="Courier New,monospace">
  <rect width="500" height="160" rx="12" fill="#010208"/>
  <text x="250" y="22" text-anchor="middle" font-size="11" fill="#aa00ff" letter-spacing="3">TribunalVerifier.sol</text>

  <rect x="14" y="32" width="220" height="36" rx="7" fill="rgba(0,255,204,0.06)" stroke="#00ffcc" stroke-width="0.8"/>
  <text x="124" y="48" text-anchor="middle" font-size="9" fill="#00ffcc">recordVerdict(proofId, round,</text>
  <text x="124" y="62" text-anchor="middle" font-size="9" fill="#445">commitment, analysisHash, guilty)</text>

  <rect x="14" y="76" width="220" height="36" rx="7" fill="rgba(255,102,0,0.06)" stroke="#ff6600" stroke-width="0.8"/>
  <text x="124" y="92" text-anchor="middle" font-size="9" fill="#ff6600">disputeVerdict(proofId)</text>
  <text x="124" y="106" text-anchor="middle" font-size="9" fill="#445">1-hour dispute window</text>

  <rect x="14" y="120" width="220" height="30" rx="7" fill="rgba(0,136,255,0.06)" stroke="#0088ff" stroke-width="0.8"/>
  <text x="124" y="140" text-anchor="middle" font-size="9" fill="#0088ff">verifyCommitment(commitment, score, blind)</text>

  <rect x="260" y="32" width="226" height="118" rx="7" fill="rgba(0,255,204,0.03)" stroke="#333" stroke-width="0.8"/>
  <text x="373" y="52" text-anchor="middle" font-size="10" fill="#ccc">Etherlink Testnet</text>
  <text x="373" y="68" text-anchor="middle" font-size="9" fill="#445">chainId: 128123</text>
  <text x="373" y="84" text-anchor="middle" font-size="9" fill="#445">RPC: thirdweb.com</text>
  <text x="373" y="100" text-anchor="middle" font-size="9" fill="#445">Solidity 0.8.20</text>
  <text x="373" y="116" text-anchor="middle" font-size="9" fill="#445">Hardhat 3 deploy</text>
  <text x="373" y="132" text-anchor="middle" font-size="9" fill="#00ffcc">wallet_addEthereumChain</text>
  <text x="373" y="144" text-anchor="middle" font-size="9" fill="#445">auto-adds to MetaMask</text>
</svg>
</p>

---

## Tech Stack

<p align="center">
<svg width="500" height="110" viewBox="0 0 500 110" xmlns="http://www.w3.org/2000/svg" font-family="Courier New,monospace">
  <rect width="500" height="110" rx="12" fill="#010208"/>
  <rect x="10" y="14" width="90" height="82" rx="8" fill="rgba(0,255,204,0.05)" stroke="#00ffcc" stroke-width="0.8"/>
  <text x="55" y="34" text-anchor="middle" font-size="9" fill="#00ffcc">Three.js</text>
  <text x="55" y="50" text-anchor="middle" font-size="8" fill="#445">0.183</text>
  <text x="55" y="64" text-anchor="middle" font-size="8" fill="#445">3D engine</text>
  <text x="55" y="78" text-anchor="middle" font-size="8" fill="#445">WebGL</text>

  <rect x="110" y="14" width="90" height="82" rx="8" fill="rgba(0,136,255,0.05)" stroke="#0088ff" stroke-width="0.8"/>
  <text x="155" y="34" text-anchor="middle" font-size="9" fill="#0088ff">Solidity</text>
  <text x="155" y="50" text-anchor="middle" font-size="8" fill="#445">0.8.20</text>
  <text x="155" y="64" text-anchor="middle" font-size="8" fill="#445">contract</text>
  <text x="155" y="78" text-anchor="middle" font-size="8" fill="#445">Hardhat 3</text>

  <rect x="210" y="14" width="90" height="82" rx="8" fill="rgba(170,0,255,0.05)" stroke="#aa00ff" stroke-width="0.8"/>
  <text x="255" y="34" text-anchor="middle" font-size="9" fill="#aa00ff">ethers.js</text>
  <text x="255" y="50" text-anchor="middle" font-size="8" fill="#445">v6</text>
  <text x="255" y="64" text-anchor="middle" font-size="8" fill="#445">wallet</text>
  <text x="255" y="78" text-anchor="middle" font-size="8" fill="#445">MetaMask</text>

  <rect x="310" y="14" width="90" height="82" rx="8" fill="rgba(255,102,0,0.05)" stroke="#ff6600" stroke-width="0.8"/>
  <text x="355" y="34" text-anchor="middle" font-size="9" fill="#ff6600">Vite 7</text>
  <text x="355" y="50" text-anchor="middle" font-size="8" fill="#445">build</text>
  <text x="355" y="64" text-anchor="middle" font-size="8" fill="#445">ES modules</text>
  <text x="355" y="78" text-anchor="middle" font-size="8" fill="#445">HMR</text>

  <rect x="410" y="14" width="80" height="82" rx="8" fill="rgba(0,255,136,0.05)" stroke="#00ff88" stroke-width="0.8"/>
  <text x="450" y="34" text-anchor="middle" font-size="9" fill="#00ff88">Etherlink</text>
  <text x="450" y="50" text-anchor="middle" font-size="8" fill="#445">128123</text>
  <text x="450" y="64" text-anchor="middle" font-size="8" fill="#445">Tezos EVM</text>
  <text x="450" y="78" text-anchor="middle" font-size="8" fill="#445">500ms block</text>
</svg>
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
