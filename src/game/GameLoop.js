// ─────────────────────────────────────────────────────────────────────────────
// GameLoop.js — Core game loop: phase management, timer, round logic
// ─────────────────────────────────────────────────────────────────────────────
import { PHASES, GAME, ROLES, PLAYER_COUNT, ARENA } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { PlayerData } from './PlayerData.js';
import { PlayerMesh } from './PlayerMesh.js';
import { NPCController } from './NPCController.js';
import { AIReferee } from '../ai/AIReferee.js';
import { OnChainSettler } from '../contracts/OnChainSettler.js';
import * as THREE from 'three';

export class GameLoop {
  constructor(scene, ui, arena, particles) {
    this.scene     = scene;
    this.ui        = ui;
    this.arena     = arena;
    this.particles = particles;
    this.referee   = new AIReferee();
    this.settler   = new OnChainSettler();
    this.meshes    = new Map();   // id → PlayerMesh
    this.npc       = null;
    this._phaseTimer = 0;
    this._running    = false;

    this._bindEvents();
  }

  _bindEvents() {
    eventBus.on(Events.GAME_START,       () => this.startGame());
    eventBus.on(Events.GAME_RESTART,     () => this.restartGame());
    eventBus.on(Events.PLAYER_VOTE,      ({ targetId }) => this._handleHumanVote(targetId));
    eventBus.on(Events.VERDICT_ACCEPTED, () => this._onVerdictAccepted());
    eventBus.on(Events.VERDICT_DISPUTED, () => this._onVerdictDisputed());
    eventBus.on('wallet:connect',        () => this._reconnectWallet());
  }

  async _reconnectWallet() {
    await this.settler._connectWallet().catch(() => {});
    this.ui.updateWalletStatus(this.settler);
  }

  // ── Start / Restart ────────────────────────────────────────────────────────
  startGame() {
    gameState.reset();
    gameState.started = true;
    gameState.phase = PHASES.DISCUSSION;

    this.ui.hideTitleScreen();
    this.ui.hideGameOver();

    this._spawnPlayers();
    this._startDiscussionPhase();
    this._running = true;

    // Update wallet status after settler has had time to init
    setTimeout(() => this.ui.updateWalletStatus(this.settler), 1500);
  }

  restartGame() {
    // Clean up meshes
    this.meshes.forEach(m => m.dispose());
    this.meshes.clear();
    if (this.npc) this.npc.stopAll();
    this.startGame();
  }

  // ── Player spawning ────────────────────────────────────────────────────────
  _spawnPlayers() {
    // Assign roles: 1 traitor, 1 bot, rest innocent
    const roles = [ROLES.TRAITOR, ROLES.BOT];
    while (roles.length < PLAYER_COUNT) roles.push(ROLES.INNOCENT);
    // Shuffle roles (player 0 = human, always innocent)
    const shuffled = [ROLES.INNOCENT, ...roles.slice(0, PLAYER_COUNT-1).sort(() => Math.random()-0.5)];

    gameState.players = [];
    for (let i = 0; i < PLAYER_COUNT; i++) {
      const p = new PlayerData(i, shuffled[i]);
      gameState.players.push(p);

      // Position around the arena
      const angle = (i / PLAYER_COUNT) * Math.PI * 2;
      const r = ARENA.RADIUS * 0.55;
      const pos = new THREE.Vector3(
        Math.cos(angle) * r, 0, Math.sin(angle) * r
      );
      const mesh = new PlayerMesh(this.scene, p, pos);
      this.meshes.set(i, mesh);
    }

    this.npc = new NPCController(gameState.players, this.meshes);
    this.ui.buildPlayerCards(gameState.players);
    this.ui.addSystemMessage('Tribunal session initiated. Analyze behavior carefully.');
  }

  // ── Phase: Discussion ──────────────────────────────────────────────────────
  _startDiscussionPhase() {
    gameState.phase = PHASES.DISCUSSION;
    gameState.timer = GAME.DISCUSSION_TIME;
    this._phaseTimer = GAME.DISCUSSION_TIME;

    this.ui.setPhaseBadge(PHASES.DISCUSSION);
    this.ui.showPhaseOverlay('DISCUSSION', `Round ${gameState.round} — Observe and deliberate`);
    this.ui.addSystemMessage(`Round ${gameState.round} begins. Discussion phase.`);

    // Simulate NPC behavior logging
    gameState.activePlayers.forEach(p => {
      for (let i = 0; i < 5; i++) {
        this.referee.simulateNPCBehavior(p, Date.now() - i * 2000);
      }
    });

    this.npc.startDiscussion();
  }

  // ── Phase: Voting ──────────────────────────────────────────────────────────
  async _startVotingPhase() {
    gameState.phase = PHASES.VOTING;
    gameState.timer = GAME.VOTING_TIME;
    this._phaseTimer = GAME.VOTING_TIME;
    gameState.votes = {};
    gameState.activePlayers.forEach(p => p.votes = 0);

    this.npc.stopAll();
    this.ui.setPhaseBadge(PHASES.VOTING);
    this.ui.showPhaseOverlay('VOTING', 'Cast your vote — who is the traitor?');
    this.ui.addSystemMessage('Voting phase. Select a suspect.');

    // Run AI analysis in background
    this.particles.activateProofBeam();
    this.ui.setZKStatus('pending', '⟳ ANALYZING...');

    const { results } = await this.referee.analyzeRound();

    // Update suspicion visuals
    results.forEach(r => {
      const p = gameState.players.find(p => p.id === r.id);
      if (p) {
        p.suspicion = r.suspicion;
        p.trust = Math.round(100 - r.suspicion * 100);
        this.ui.updatePlayerCard(p);
        const mesh = this.meshes.get(p.id);
        if (mesh) mesh.setSuspicion(r.suspicion);
      }
    });

    // Show vote panel for human player
    const human = gameState.players[0];
    if (human.alive) {
      this.ui.showVotePanel(gameState.activePlayers);
    }

    // NPC votes
    this.npc.castNPCVotes();
  }

  // ── Phase: Tribunal ────────────────────────────────────────────────────────
  async _startTribunalPhase() {
    gameState.phase = PHASES.TRIBUNAL;
    this.ui.setPhaseBadge(PHASES.TRIBUNAL);
    this.ui.hideVotePanel();
    this.ui.showPhaseOverlay('TRIBUNAL', 'AI Referee generating ZK proof...', 2500);
    this.ui.addSystemMessage('AI Tribunal convened. Generating zero-knowledge proof...');

    // Tally votes
    const tally = {};
    Object.values(gameState.votes).forEach(id => {
      tally[id] = (tally[id] || 0) + 1;
    });
    const mostVoted = Object.entries(tally).sort((a,b) => b[1]-a[1])[0];
    const targetId = mostVoted ? parseInt(mostVoted[0]) : 1;

    // Generate ZK proof
    const proof = await this.referee.prover.generateProof({
      suspectId:    targetId,
      suspectName:  gameState.players[targetId]?.name || 'UNKNOWN',
      score:        gameState.players[targetId]?.suspicion || 0.5,
      round:        gameState.round,
      playerCount:  gameState.activePlayers.length,
      analysisHash: Date.now().toString(16),
    });

    this.particles.deactivateProofBeam();

    // Submit to chain
    const receipt = await this.settler.submitVerdict(proof);
    gameState.lastVerdict = { proof, receipt };

    // Flash arena
    this.arena.flashVerdict(proof.verdict.guilty);

    // Show tribunal panel
    await this.ui.showTribunalPanel(proof, receipt);
  }

  // ── Verdict handlers ───────────────────────────────────────────────────────
  async _onVerdictAccepted() {
    const { proof } = gameState.lastVerdict;
    const targetId = proof.verdict.suspectId;
    const target = gameState.players[targetId];

    if (target) {
      target.alive = false;
      gameState.eliminated.push(targetId);
      this.ui.updatePlayerCard(target);
      const mesh = this.meshes.get(targetId);
      if (mesh) mesh.eliminate();

      const wasGuilty = target.role !== ROLES.INNOCENT;
      if (wasGuilty) {
        gameState.innocentWins++;
        gameState.addScore(100 + gameState.round * 50);
        this.ui.addSystemMessage(`✓ ${target.name} was ${target.role.toUpperCase()}. Justice served.`);
      } else {
        gameState.traitorWins++;
        this.ui.addSystemMessage(`✗ ${target.name} was INNOCENT. The traitors remain.`);
      }
    }

    this._advanceRound();
  }

  async _onVerdictDisputed() {
    gameState.disputeCount++;
    const { proof } = gameState.lastVerdict;
    await this.settler.disputeVerdict(proof.id, 'Player dispute');
    this.ui.addSystemMessage('⚠ Verdict disputed. Dispute logged on-chain. Proceeding...');
    this._advanceRound();
  }

  // ── Round advancement ──────────────────────────────────────────────────────
  _advanceRound() {
    const traitors = gameState.activePlayers.filter(p => p.role !== ROLES.INNOCENT);
    const innocents = gameState.activePlayers.filter(p => p.role === ROLES.INNOCENT);

    if (traitors.length === 0) {
      this._endGame('INNOCENTS WIN', true);
      return;
    }
    if (innocents.length <= traitors.length) {
      this._endGame('TRAITORS WIN', false);
      return;
    }
    if (gameState.round >= GAME.ROUNDS) {
      this._endGame('TRIBUNAL ENDS', traitors.length === 0);
      return;
    }

    gameState.round++;
    this._startDiscussionPhase();
  }

  _endGame(result, innocentsWon) {
    gameState.phase = PHASES.GAMEOVER;
    gameState.gameOver = true;
    this._running = false;

    const stats = `
      Rounds: ${gameState.round}<br>
      Score: ${gameState.score}<br>
      ZK Proofs Generated: ${gameState.zkProofs.length + 1}<br>
      Disputes Filed: ${gameState.disputeCount}<br>
      Verdicts on Etherlink: ${this.settler.verdicts.length}
    `;
    this.ui.showGameOver(result, stats);
    eventBus.emit(Events.GAME_OVER, { result, score: gameState.score });
  }

  // ── Human vote handler ─────────────────────────────────────────────────────
  _handleHumanVote(targetId) {
    const human = gameState.players[0];
    if (!human.alive) return;
    gameState.votes[0] = targetId;
    const target = gameState.players[targetId];
    if (target) {
      target.votes = (target.votes || 0) + 1;
      human.logBehavior('vote', targetId / 10, Date.now());
      this.ui.addSystemMessage(`You voted to eliminate ${target.name}.`);
    }
    // Trigger tribunal immediately after human votes
    this._startTribunalPhase();
  }

  // ── Per-frame update ───────────────────────────────────────────────────────
  update(delta) {
    if (!this._running) return;

    // Update meshes
    this.meshes.forEach(mesh => mesh.update(delta));

    // Phase timer
    if (gameState.phase === PHASES.DISCUSSION || gameState.phase === PHASES.VOTING) {
      this._phaseTimer -= delta;
      gameState.timer = this._phaseTimer;
      this.ui.updateHUD(gameState.round, Math.max(0, this._phaseTimer));

      if (this._phaseTimer <= 0) {
        if (gameState.phase === PHASES.DISCUSSION) {
          this._startVotingPhase();
        } else if (gameState.phase === PHASES.VOTING) {
          this._startTribunalPhase();
        }
      }
    }
  }
}
