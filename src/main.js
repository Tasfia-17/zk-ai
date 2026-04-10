// ─────────────────────────────────────────────────────────────────────────────
// main.js — Entry point: Three.js setup, camera, render loop
// ─────────────────────────────────────────────────────────────────────────────
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CAMERA, COLORS, GAME } from './core/Constants.js';
import { eventBus, Events } from './core/EventBus.js';
import { gameState } from './core/GameState.js';
import { Arena } from './game/Arena.js';
import { GameLoop } from './game/GameLoop.js';
import { GameUI } from './ui/GameUI.js';
import { ParticleSystem } from './systems/ParticleSystem.js';
import { TitleScene } from './ui/TitleScene.js';

// ── Title screen 3D background ────────────────────────────────────────────────
const titleCanvas = document.getElementById('title-canvas');
const titleScene = new TitleScene(titleCanvas);

// ── Renderer ──────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, GAME.MAX_DPR));
renderer.setClearColor(COLORS.SKY);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.prepend(renderer.domElement);

// ── Scene ─────────────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.SKY);

// ── Camera ────────────────────────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(
  CAMERA.FOV_GAME, window.innerWidth / window.innerHeight, 0.1, 500
);
camera.position.set(0, CAMERA.HEIGHT, CAMERA.DISTANCE);

// ── Orbit Controls ────────────────────────────────────────────────────────────
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = CAMERA.ORBIT_MIN;
controls.maxDistance = CAMERA.ORBIT_MAX;
controls.maxPolarAngle = Math.PI / 2.2;
controls.target.set(0, 1, 0);
controls.update();

// ── Systems ───────────────────────────────────────────────────────────────────
const arena     = new Arena(scene);
const particles = new ParticleSystem(scene);
const ui        = new GameUI();
const gameLoop  = new GameLoop(scene, ui, arena, particles);

// ── Clock ─────────────────────────────────────────────────────────────────────
const clock = new THREE.Clock();

// ── Render Loop ───────────────────────────────────────────────────────────────
renderer.setAnimationLoop(() => {
  const delta = Math.min(clock.getDelta(), GAME.MAX_DELTA);

  arena.update(delta);
  particles.update(delta);
  gameLoop.update(delta);

  controls.update();
  renderer.render(scene, camera);
});

// ── Resize ────────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ── Dispose title scene when game starts ──────────────────────────────────────
eventBus.on(Events.GAME_START, () => titleScene.dispose());

// ── AI-readable state (for Playwright / agents) ───────────────────────────────
window.render_game_to_text = () => JSON.stringify({
  mode:     gameState.gameOver ? 'game_over' : gameState.started ? 'playing' : 'menu',
  phase:    gameState.phase,
  round:    gameState.round,
  score:    gameState.score,
  players:  gameState.players.map(p => ({
    id: p.id, name: p.name, alive: p.alive,
    role: p.role, suspicion: Math.round(p.suspicion * 100),
  })),
  proofs:   gameState.zkProofs.length,
});

window.advanceTime = (ms) => new Promise(resolve => {
  const start = performance.now();
  const step = () => {
    if (performance.now() - start >= ms) return resolve();
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
});

// Expose for debugging
window.__GAME_STATE__ = gameState;
window.__EVENT_BUS__  = eventBus;
window.__EVENTS__     = Events;
