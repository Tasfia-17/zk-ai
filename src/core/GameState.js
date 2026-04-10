// ─────────────────────────────────────────────────────────────────────────────
// GameState.js — Single source of truth for all mutable game state
// ─────────────────────────────────────────────────────────────────────────────
import { GAME, PHASES } from './Constants.js';

class GameState {
  constructor() { this.reset(); }

  reset() {
    this.phase        = PHASES.TITLE;
    this.round        = 1;
    this.score        = 0;
    this.bestScore    = this.bestScore || 0;
    this.started      = false;
    this.gameOver     = false;
    this.timer        = GAME.DISCUSSION_TIME;
    this.players      = [];          // PlayerData objects
    this.votes        = {};          // voterId → targetId
    this.currentVote  = null;        // player id being voted on
    this.eliminated   = [];          // ids of eliminated players
    this.traitorWins  = 0;
    this.innocentWins = 0;
    this.zkProofs     = [];          // stored proof objects
    this.lastVerdict  = null;
    this.disputeCount = 0;
  }

  addScore(pts = 1) {
    this.score += pts;
    if (this.score > this.bestScore) this.bestScore = this.score;
  }

  get activePlayers() {
    return this.players.filter(p => !this.eliminated.includes(p.id));
  }
}

export const gameState = new GameState();
