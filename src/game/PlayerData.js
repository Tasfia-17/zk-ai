// ─────────────────────────────────────────────────────────────────────────────
// PlayerData.js — Data model for each player (not the 3D mesh)
// ─────────────────────────────────────────────────────────────────────────────
import { ROLES, AI } from '../core/Constants.js';

const NAMES = ['AXIOM', 'CIPHER', 'DELTA', 'ECHO', 'FLUX', 'GHOST'];
const EMOJIS = ['🔵', '🟣', '🟠', '🔴', '🟡', '⚪'];

export class PlayerData {
  constructor(id, role) {
    this.id       = id;
    this.name     = NAMES[id];
    this.emoji    = EMOJIS[id];
    this.role     = role;
    this.isHuman  = (id === 0);   // player 0 is the human
    this.alive    = true;
    this.trust    = 100;          // 0–100 trust score
    this.suspicion= 0;            // 0–1 AI suspicion score
    this.votes    = 0;            // votes received this round
    this.behaviorLog = [];        // timestamped behavior events
    this.collusionPartner = null; // for bots/traitors
  }

  // Record a behavior event for AI analysis
  logBehavior(type, value, timestamp) {
    this.behaviorLog.push({ type, value, timestamp });
    if (this.behaviorLog.length > 50) this.behaviorLog.shift();
  }

  // Compute behavioral variance (low = bot-like)
  get behaviorVariance() {
    if (this.behaviorLog.length < 3) return 0.5;
    const vals = this.behaviorLog.map(b => b.value);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length;
    return Math.min(1, Math.sqrt(variance));
  }

  // Simulate AI-generated chat messages based on role
  generateMessage(phase, suspectedId) {
    const innocent = [
      `I've been watching ${NAMES[suspectedId] || 'everyone'} closely...`,
      `Something feels off about the voting patterns.`,
      `We need to analyze the behavior logs before deciding.`,
      `The AI referee will expose any collusion. Trust the proof.`,
      `I vote we wait for the ZK verification.`,
    ];
    const traitor = [
      `${NAMES[suspectedId] || 'That player'} is clearly suspicious.`,
      `Don't trust the AI — it can be manipulated.`,
      `We should vote quickly before the proof is generated.`,
      `I've seen ${NAMES[suspectedId] || 'them'} acting strange all round.`,
      `The tribunal is biased. Vote with your gut.`,
    ];
    const msgs = this.role === ROLES.INNOCENT ? innocent : traitor;
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
}
