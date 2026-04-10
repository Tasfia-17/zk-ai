// ─────────────────────────────────────────────────────────────────────────────
// AIReferee.js — Behavioral analysis engine that detects collusion/botting
// Simulates ZKML: runs inference, then generates a ZK commitment
// ─────────────────────────────────────────────────────────────────────────────
import { AI, ZK, ROLES } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { ZKProver } from '../zk/ZKProver.js';

export class AIReferee {
  constructor() {
    this.prover = new ZKProver();
    this.analysisHistory = [];
  }

  // ── Main analysis entry point ──────────────────────────────────────────────
  async analyzeRound() {
    eventBus.emit(Events.AI_ANALYSIS_START);

    const players = gameState.activePlayers;
    const results = [];

    for (const p of players) {
      const score = this._computeSuspicionScore(p, players);
      p.suspicion = score;
      results.push({ id: p.id, name: p.name, suspicion: score });

      if (score > AI.SUSPICION_THRESHOLD) {
        eventBus.emit(Events.AI_SUSPICION, { player: p, score });
      }
    }

    // Sort by suspicion descending
    results.sort((a, b) => b.suspicion - a.suspicion);
    const topSuspect = results[0];

    // Generate ZK proof for the verdict
    const proof = await this.prover.generateProof({
      suspectId:   topSuspect.id,
      suspectName: topSuspect.name,
      score:       topSuspect.suspicion,
      round:       gameState.round,
      playerCount: players.length,
      analysisHash: this._hashAnalysis(results),
    });

    gameState.zkProofs.push(proof);
    this.analysisHistory.push({ round: gameState.round, results, proof });

    eventBus.emit(Events.AI_ANALYSIS_DONE, { results, proof, topSuspect });
    return { results, proof, topSuspect };
  }

  // ── Suspicion scoring model ────────────────────────────────────────────────
  // Simulates a lightweight neural network inference:
  // Features: behavioral variance, vote correlation, timing patterns, collusion signal
  _computeSuspicionScore(player, allPlayers) {
    let score = 0;

    // Feature 1: Low behavioral variance → bot-like
    const variance = player.behaviorVariance;
    const varianceScore = Math.max(0, 1 - variance / AI.HUMAN_PATTERN_VARIANCE);
    score += varianceScore * 0.35;

    // Feature 2: Voting correlation with known suspects
    const voteCorrelation = this._computeVoteCorrelation(player, allPlayers);
    score += voteCorrelation * 0.30;

    // Feature 3: Timing regularity (bots act at regular intervals)
    const timingScore = this._computeTimingRegularity(player);
    score += timingScore * 0.20;

    // Feature 4: Role-based ground truth (hidden from players, used for proof)
    // In real ZKML this would be the model weights — here we simulate the output
    if (player.role === ROLES.TRAITOR || player.role === ROLES.BOT) {
      score += 0.15 * (0.8 + Math.random() * 0.2);
    } else {
      score += 0.15 * (Math.random() * 0.3);
    }

    // Add noise to simulate model uncertainty
    score += (Math.random() - 0.5) * 0.08;

    return Math.max(0, Math.min(1, score));
  }

  _computeVoteCorrelation(player, allPlayers) {
    // Check if this player's votes align suspiciously with another player
    if (!player.behaviorLog.length) return Math.random() * 0.2;
    const voteEvents = player.behaviorLog.filter(b => b.type === 'vote');
    if (voteEvents.length < 2) return Math.random() * 0.15;

    // Simulate correlation check
    return player.role !== ROLES.INNOCENT
      ? 0.5 + Math.random() * 0.4
      : Math.random() * 0.25;
  }

  _computeTimingRegularity(player) {
    const events = player.behaviorLog;
    if (events.length < 3) return Math.random() * 0.2;

    const intervals = [];
    for (let i = 1; i < events.length; i++) {
      intervals.push(events[i].timestamp - events[i-1].timestamp);
    }
    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const stdDev = Math.sqrt(
      intervals.reduce((a, b) => a + (b - mean) ** 2, 0) / intervals.length
    );
    // Low stdDev relative to mean = regular timing = bot-like
    const cv = mean > 0 ? stdDev / mean : 1;
    return Math.max(0, 1 - cv);
  }

  // ── Deterministic hash of analysis results (for ZK commitment) ────────────
  _hashAnalysis(results) {
    const str = JSON.stringify(results.map(r => ({
      id: r.id,
      score: Math.round(r.suspicion * 1000)
    })));
    // Simple deterministic hash simulation
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  }

  // ── Simulate AI NPC behavior logging ──────────────────────────────────────
  simulateNPCBehavior(player, timestamp) {
    const isBot = player.role !== ROLES.INNOCENT;
    const variance = isBot ? AI.BOT_PATTERN_VARIANCE : AI.HUMAN_PATTERN_VARIANCE;
    const value = 0.5 + (Math.random() - 0.5) * variance * 2;
    player.logBehavior('move', value, timestamp);
  }
}
