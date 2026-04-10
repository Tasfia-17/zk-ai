// ─────────────────────────────────────────────────────────────────────────────
// Constants.js — All magic numbers, colors, and config in one place
// ─────────────────────────────────────────────────────────────────────────────

export const GAME = {
  FOV: 55,
  NEAR: 0.1,
  FAR: 500,
  MAX_DELTA: 0.05,
  MAX_DPR: 2,
  DISCUSSION_TIME: 60,   // seconds per discussion phase
  VOTING_TIME: 30,       // seconds for voting
  ROUNDS: 3,
};

export const ARENA = {
  RADIUS: 18,
  FLOOR_RADIUS: 22,
  WALL_HEIGHT: 6,
  PILLAR_COUNT: 8,
  PILLAR_RADIUS: 0.5,
  PILLAR_HEIGHT: 5,
};

export const PLAYER_COUNT = 6;

export const ROLES = {
  INNOCENT: 'innocent',
  TRAITOR:  'traitor',
  BOT:      'bot',       // AI-controlled colluder — what the AI referee detects
};

export const PHASES = {
  TITLE:      'title',
  DISCUSSION: 'discussion',
  VOTING:     'voting',
  TRIBUNAL:   'tribunal',
  RESULT:     'result',
  GAMEOVER:   'gameover',
};

export const COLORS = {
  SKY:          0x020412,
  FLOOR:        0x0a0a1a,
  FLOOR_GRID:   0x00ffcc,
  WALL:         0x050520,
  PILLAR:       0x0d0d2e,
  PILLAR_GLOW:  0x00ffcc,
  AMBIENT:      0x112244,
  DIR_LIGHT:    0xffffff,
  PLAYER_BASE:  [0x00ffcc, 0x0088ff, 0xaa00ff, 0xff6600, 0xff0066, 0xffcc00],
  TRAITOR:      0xff2200,
  SUSPECT_RING: 0xff6600,
  INNOCENT_RING:0x00ff88,
  HOLOGRAM:     0x00ffcc,
  PROOF_BEAM:   0x0088ff,
};

export const CAMERA = {
  HEIGHT: 14,
  DISTANCE: 22,
  FOV_GAME: 55,
  ORBIT_MIN: 10,
  ORBIT_MAX: 35,
};

export const AI = {
  SUSPICION_THRESHOLD: 0.65,   // above this → flagged as suspect
  COLLUSION_WINDOW: 8,          // seconds of correlated behavior = collusion signal
  BOT_PATTERN_VARIANCE: 0.12,   // bots have low behavioral variance
  HUMAN_PATTERN_VARIANCE: 0.45,
};

export const ZK = {
  PROOF_DELAY_MS: 1800,         // simulated ZK proof generation time
  HASH_ROUNDS: 4,               // simulated hashing rounds shown in UI
  COMMITMENT_BITS: 256,
};
