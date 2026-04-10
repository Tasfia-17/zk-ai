// ─────────────────────────────────────────────────────────────────────────────
// GameUI.js — All DOM UI management: HUD, vote panel, tribunal panel, chat
// ─────────────────────────────────────────────────────────────────────────────
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { PHASES, GAME } from '../core/Constants.js';

export class GameUI {
  constructor() {
    this._bindElements();
    this._bindEvents();
  }

  _bindElements() {
    this.hudRound     = document.getElementById('hud-round');
    this.hudTimer     = document.getElementById('hud-timer');
    this.phaseBadge   = document.getElementById('phase-badge');
    this.zkStatus     = document.getElementById('zk-status');
    this.playerCards  = document.getElementById('player-cards');
    this.chatMessages = document.getElementById('chat-messages');
    this.votePanel    = document.getElementById('vote-panel');
    this.voteOptions  = document.getElementById('vote-options');
    this.voteConfirm  = document.getElementById('vote-confirm');
    this.tribunalPanel= document.getElementById('tribunal-panel');
    this.proofDisplay = document.getElementById('proof-display');
    this.verdictBox   = document.getElementById('verdict-box');
    this.verdictName  = document.getElementById('verdict-name');
    this.verdictLabel = document.getElementById('verdict-label');
    this.verdictReason= document.getElementById('verdict-reason');
    this.phaseOverlay = document.getElementById('phase-overlay');
    this.phaseTitle   = document.getElementById('phase-title');
    this.phaseDesc    = document.getElementById('phase-desc');
    this.proofTicker  = document.getElementById('proof-ticker');
    this.gameoverOverlay = document.getElementById('gameover-overlay');
    this.gameoverResult  = document.getElementById('gameover-result');
    this.gameoverStats   = document.getElementById('gameover-stats');
    this.titleScreen  = document.getElementById('title-screen');
    this.walletStatusEl = document.getElementById('wallet-status');
    if (this.walletStatusEl) {
      this.walletStatusEl.addEventListener('click', () => eventBus.emit('wallet:connect'));
    }
    this._selectedVoteTarget = null;
  }

  _bindEvents() {
    document.getElementById('btn-start').addEventListener('click', () => {
      eventBus.emit(Events.GAME_START);
    });
    document.getElementById('btn-restart').addEventListener('click', () => {
      eventBus.emit(Events.GAME_RESTART);
    });
    this.voteConfirm.addEventListener('click', () => {
      if (this._selectedVoteTarget !== null) {
        eventBus.emit(Events.PLAYER_VOTE, { targetId: this._selectedVoteTarget });
        this.hideVotePanel();
      }
    });
    document.getElementById('btn-accept').addEventListener('click', () => {
      eventBus.emit(Events.VERDICT_ACCEPTED);
      this.hideTribunalPanel();
    });
    document.getElementById('btn-dispute').addEventListener('click', () => {
      eventBus.emit(Events.VERDICT_DISPUTED);
      this.hideTribunalPanel();
    });

    eventBus.on(Events.ZK_PROOF_START, () => this.setZKStatus('pending', '⟳ GENERATING PROOF'));
    eventBus.on(Events.ZK_PROOF_DONE,  () => this.setZKStatus('verified', '✓ PROOF VERIFIED'));
    eventBus.on(Events.ZK_PROOF_TICKER, ({ step }) => this.showProofTicker(step));
    eventBus.on(Events.AI_ANALYSIS_START, () => this.setZKStatus('pending', '⟳ ANALYZING...'));
    eventBus.on(Events.PLAYER_CHAT, ({ player, message }) => this.addChatMessage(player, message));
  }

  // ── HUD ───────────────────────────────────────────────────────────────────
  updateHUD(round, timer) {
    this.hudRound.textContent = `${round} / ${GAME.ROUNDS}`;
    this.hudTimer.textContent = Math.ceil(timer);
  }

  setPhaseBadge(phase) {
    const labels = {
      [PHASES.DISCUSSION]: 'DISCUSSION',
      [PHASES.VOTING]:     'VOTING',
      [PHASES.TRIBUNAL]:   'TRIBUNAL',
      [PHASES.RESULT]:     'VERDICT',
    };
    this.phaseBadge.textContent = labels[phase] || phase.toUpperCase();
  }

  setZKStatus(state, text) {
    this.zkStatus.className = state;
    this.zkStatus.textContent = text;
  }

  // ── Wallet status ─────────────────────────────────────────────────────────
  updateWalletStatus(settler) {
    if (!this.walletStatusEl) return;
    this.walletStatusEl.textContent = settler.statusLabel;
    this.walletStatusEl.className = settler.isOnChain ? 'connected' : '';
  }
  hideTitleScreen() {
    this.titleScreen.classList.add('hidden');
  }

  // ── PHASE OVERLAY ─────────────────────────────────────────────────────────
  showPhaseOverlay(title, desc, duration = 2000) {
    this.phaseTitle.textContent = title;
    this.phaseDesc.textContent = desc;
    this.phaseOverlay.classList.add('show');
    setTimeout(() => this.phaseOverlay.classList.remove('show'), duration);
  }

  // ── PLAYER CARDS ──────────────────────────────────────────────────────────
  buildPlayerCards(players) {
    this.playerCards.innerHTML = '';
    players.forEach(p => {
      const card = document.createElement('div');
      card.className = 'player-card' + (p.isHuman ? ' selected' : '');
      card.id = `card-${p.id}`;
      card.innerHTML = `
        <div class="card-avatar" style="background:rgba(${this._hexToRgb(p.id)},0.2)">${p.emoji}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-role">${p.isHuman ? 'YOU' : 'NPC'}</div>
        <div class="card-trust" id="trust-${p.id}">100</div>
      `;
      this.playerCards.appendChild(card);
    });
  }

  updatePlayerCard(player) {
    const card = document.getElementById(`card-${player.id}`);
    if (!card) return;
    card.className = 'player-card';
    if (!player.alive) card.classList.add('eliminated');
    else if (player.suspicion > 0.65) card.classList.add('suspect');
    else if (player.suspicion < 0.3) card.classList.add('innocent');

    const trust = document.getElementById(`trust-${player.id}`);
    if (trust) trust.textContent = Math.round(player.trust);
  }

  _hexToRgb(id) {
    const colors = ['0,255,204', '0,136,255', '170,0,255', '255,102,0', '255,0,102', '255,204,0'];
    return colors[id % colors.length];
  }

  // ── VOTE PANEL ────────────────────────────────────────────────────────────
  showVotePanel(players) {
    this._selectedVoteTarget = null;
    this.voteConfirm.disabled = true;
    this.voteOptions.innerHTML = '';

    players.filter(p => p.alive && !p.isHuman).forEach(p => {
      const opt = document.createElement('div');
      opt.className = 'vote-option';
      opt.innerHTML = `
        <span>${p.emoji}</span>
        <span class="vo-name">${p.name}</span>
        <span class="vo-sus">${Math.round(p.suspicion * 100)}% sus</span>
      `;
      opt.addEventListener('click', () => {
        document.querySelectorAll('.vote-option').forEach(o => o.style.background = '');
        opt.style.background = 'rgba(0,255,204,0.1)';
        this._selectedVoteTarget = p.id;
        this.voteConfirm.disabled = false;
      });
      this.voteOptions.appendChild(opt);
    });

    this.votePanel.classList.add('visible');
  }

  hideVotePanel() {
    this.votePanel.classList.remove('visible');
  }

  // ── TRIBUNAL PANEL ────────────────────────────────────────────────────────
  async showTribunalPanel(proof, receipt) {
    const v = proof.verdict;
    const pi = proof.publicInputs;

    const txDisplay = receipt?.explorerUrl
      ? `<a href="${receipt.explorerUrl}" target="_blank" style="color:#0088ff">${receipt.txHash.slice(0,20)}... ↗</a>`
      : `<span class="proof-hash">${proof.txHash.slice(0,20)}...</span>`;

    const networkStatus = receipt?.status === 'confirmed'
      ? `<span style="color:#00ff88">✓ confirmed</span>`
      : `<span style="color:#888">${receipt?.status || 'offline'}</span>`;

    this.proofDisplay.innerHTML = `
      <div class="proof-line"><span class="proof-key">circuit:</span> <span class="proof-val">${proof.circuit}</span></div>
      <div class="proof-line"><span class="proof-key">proof_type:</span> <span class="proof-val">${proof.proofType}</span></div>
      <div class="proof-line"><span class="proof-key">commitment:</span> <span class="proof-hash">${proof.commitment.slice(0,32)}...</span></div>
      <div class="proof-line"><span class="proof-key">score_commit:</span> <span class="proof-hash">${pi.scoreCommit}</span></div>
      <div class="proof-line"><span class="proof-key">analysis_hash:</span> <span class="proof-hash">${pi.analysisHash}</span></div>
      <div class="proof-line"><span class="proof-key">tx_hash:</span> ${txDisplay}</div>
      <div class="proof-line"><span class="proof-key">block:</span> <span class="proof-val">${receipt?.blockNumber || 'pending'}</span></div>
      <div class="proof-line"><span class="proof-key">gas_used:</span> <span class="proof-val">${receipt?.gasUsed || '—'}</span></div>
      <div class="proof-line"><span class="proof-key">network:</span> <span class="proof-val">${receipt?.network || 'Etherlink Testnet'}</span></div>
      <div class="proof-line"><span class="proof-key">status:</span> ${networkStatus}</div>
      <div class="proof-line"><span class="proof-key">verified:</span> <span class="proof-val" style="color:#00ff88">✓ TRUE</span></div>
    `;

    // Verdict box
    this.verdictBox.className = `verdict-box ${v.guilty ? 'guilty' : 'innocent'}`;
    this.verdictName.textContent = v.suspectName;
    this.verdictLabel.className = v.guilty ? 'guilty' : 'innocent';
    this.verdictLabel.textContent = v.guilty
      ? `⚠ GUILTY — ${v.confidence}% confidence`
      : `✓ INNOCENT — ${v.confidence}% confidence`;
    this.verdictReason.textContent = v.reason;

    this.tribunalPanel.classList.add('visible');
  }

  hideTribunalPanel() {
    this.tribunalPanel.classList.remove('visible');
  }

  // ── CHAT ──────────────────────────────────────────────────────────────────
  addChatMessage(player, message, type = '') {
    const div = document.createElement('div');
    div.className = `chat-msg ${type}`;
    div.innerHTML = `
      <div class="msg-author" style="color:${this._playerColor(player?.id)}">${player ? player.emoji + ' ' + player.name : '⚖ SYSTEM'}</div>
      <div class="msg-text">${message}</div>
    `;
    this.chatMessages.appendChild(div);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

    // Keep max 20 messages
    while (this.chatMessages.children.length > 20) {
      this.chatMessages.removeChild(this.chatMessages.firstChild);
    }
  }

  addSystemMessage(message) {
    this.addChatMessage(null, message, 'system');
  }

  _playerColor(id) {
    const colors = ['#00ffcc','#0088ff','#aa00ff','#ff6600','#ff0066','#ffcc00'];
    return colors[(id ?? 0) % colors.length];
  }

  // ── PROOF TICKER ──────────────────────────────────────────────────────────
  showProofTicker(text) {
    this.proofTicker.textContent = `🔐 ${text}`;
    this.proofTicker.classList.add('show');
    clearTimeout(this._tickerTimeout);
    this._tickerTimeout = setTimeout(() => this.proofTicker.classList.remove('show'), 1200);
  }

  // ── GAME OVER ─────────────────────────────────────────────────────────────
  showGameOver(result, stats) {
    this.gameoverResult.textContent = result;
    this.gameoverStats.innerHTML = stats;
    this.gameoverOverlay.classList.remove('hidden');
  }

  hideGameOver() {
    this.gameoverOverlay.classList.add('hidden');
  }
}
