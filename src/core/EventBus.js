// ─────────────────────────────────────────────────────────────────────────────
// EventBus.js — Singleton pub/sub. All cross-module communication goes here.
// ─────────────────────────────────────────────────────────────────────────────

export const Events = {
  // Lifecycle
  GAME_START:       'game:start',
  GAME_RESTART:     'game:restart',
  GAME_OVER:        'game:over',
  PHASE_CHANGE:     'phase:change',

  // Players
  PLAYER_VOTE:      'player:vote',
  PLAYER_ELIMINATED:'player:eliminated',
  PLAYER_CHAT:      'player:chat',
  PLAYER_MOVE:      'player:move',

  // AI Referee
  AI_ANALYSIS_START:'ai:analysis:start',
  AI_ANALYSIS_DONE: 'ai:analysis:done',
  AI_SUSPICION:     'ai:suspicion',

  // ZK
  ZK_PROOF_START:   'zk:proof:start',
  ZK_PROOF_DONE:    'zk:proof:done',
  ZK_PROOF_TICKER:  'zk:proof:ticker',

  // Verdict
  VERDICT_READY:    'verdict:ready',
  VERDICT_ACCEPTED: 'verdict:accepted',
  VERDICT_DISPUTED: 'verdict:disputed',

  // Score
  SCORE_CHANGED:    'score:changed',
};

class EventBus {
  constructor() { this.listeners = {}; }

  on(event, cb) {
    (this.listeners[event] = this.listeners[event] || []).push(cb);
    return this;
  }
  off(event, cb) {
    if (this.listeners[event])
      this.listeners[event] = this.listeners[event].filter(f => f !== cb);
    return this;
  }
  emit(event, data) {
    (this.listeners[event] || []).forEach(cb => {
      try { cb(data); } catch(e) { console.error(`EventBus[${event}]:`, e); }
    });
    return this;
  }
  removeAll() { this.listeners = {}; return this; }
}

export const eventBus = new EventBus();
