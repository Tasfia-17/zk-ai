// ─────────────────────────────────────────────────────────────────────────────
// NPCController.js — AI-driven NPC behavior: movement, chat, voting
// ─────────────────────────────────────────────────────────────────────────────
import { ROLES, ARENA, GAME } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import * as THREE from 'three';

export class NPCController {
  constructor(players, meshes) {
    this.players = players;
    this.meshes  = meshes;   // Map<id, PlayerMesh>
    this._chatTimers = {};
    this._moveTimers = {};
  }

  // ── Start NPC activity for discussion phase ────────────────────────────────
  startDiscussion() {
    this.players.filter(p => !p.isHuman && p.alive).forEach(p => {
      this._scheduleChatMessage(p);
      this._scheduleMovement(p);
    });
  }

  stopAll() {
    Object.values(this._chatTimers).forEach(clearTimeout);
    Object.values(this._moveTimers).forEach(clearTimeout);
    this._chatTimers = {};
    this._moveTimers = {};
  }

  // ── NPC votes ─────────────────────────────────────────────────────────────
  castNPCVotes() {
    const active = gameState.activePlayers;
    this.players.filter(p => !p.isHuman && p.alive).forEach(p => {
      // Traitors/bots vote together against an innocent
      let target;
      if (p.role !== ROLES.INNOCENT) {
        const innocents = active.filter(a => a.id !== p.id && a.role === ROLES.INNOCENT);
        target = innocents[Math.floor(Math.random() * innocents.length)];
      } else {
        // Innocents vote for highest suspicion player
        const suspects = active
          .filter(a => a.id !== p.id)
          .sort((a, b) => b.suspicion - a.suspicion);
        target = suspects[0];
      }
      if (target) {
        gameState.votes[p.id] = target.id;
        target.votes = (target.votes || 0) + 1;
        p.logBehavior('vote', target.id / 10, Date.now());
      }
    });
  }

  _scheduleChatMessage(player) {
    const delay = 3000 + Math.random() * 8000;
    this._chatTimers[player.id] = setTimeout(() => {
      if (!player.alive || gameState.phase !== 'discussion') return;

      const suspects = gameState.activePlayers.filter(p => p.id !== player.id);
      const target = suspects[Math.floor(Math.random() * suspects.length)];
      const msg = player.generateMessage('discussion', target?.id ?? 0);

      eventBus.emit(Events.PLAYER_CHAT, { player, message: msg });
      player.logBehavior('chat', Math.random(), Date.now());

      // Schedule next message
      this._scheduleChatMessage(player);
    }, delay);
  }

  _scheduleMovement(player) {
    const delay = 2000 + Math.random() * 5000;
    this._moveTimers[player.id] = setTimeout(() => {
      if (!player.alive) return;

      const mesh = this.meshes.get(player.id);
      if (mesh) {
        // Move to a random position within the arena
        const angle = Math.random() * Math.PI * 2;
        const r = 2 + Math.random() * (ARENA.RADIUS - 5);
        const target = new THREE.Vector3(
          Math.cos(angle) * r, 0, Math.sin(angle) * r
        );
        this._animateMove(mesh, target);
      }

      player.logBehavior('move', Math.random(), Date.now());
      this._scheduleMovement(player);
    }, delay);
  }

  _animateMove(mesh, target) {
    const start = mesh.group.position.clone();
    const duration = 1500 + Math.random() * 1000;
    const startTime = performance.now();

    const animate = () => {
      const t = Math.min(1, (performance.now() - startTime) / duration);
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t; // ease in-out
      mesh.group.position.lerpVectors(start, target, ease);
      mesh.group.position.y = mesh.baseY; // keep Y managed by hover
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}
