// ─────────────────────────────────────────────────────────────────────────────
// PlayerMesh.js — 3D representation of a player in the arena
// Floating holographic avatar with role-colored glow and suspicion ring
// ─────────────────────────────────────────────────────────────────────────────
import * as THREE from 'three';
import { COLORS, ROLES } from '../core/Constants.js';

export class PlayerMesh {
  constructor(scene, playerData, position) {
    this.scene = scene;
    this.data = playerData;
    this.group = new THREE.Group();
    this.group.position.copy(position);
    this.time = 0;
    this.baseY = position.y;
    this.suspicionRing = null;
    this.eliminatedEffect = false;

    this._build();
    scene.add(this.group);
  }

  _build() {
    const color = COLORS.PLAYER_BASE[this.data.id % COLORS.PLAYER_BASE.length];

    // Platform base
    const platGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.12, 16);
    const platMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a20, roughness: 0.1, metalness: 0.9,
    });
    const platform = new THREE.Mesh(platGeo, platMat);
    platform.position.y = -0.06;
    platform.receiveShadow = true;
    this.group.add(platform);

    // Platform glow ring
    const ringGeo = new THREE.TorusGeometry(0.72, 0.04, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    this.group.add(ring);
    this.glowRing = ring;

    // Body — octahedron for a sci-fi look
    const bodyGeo = new THREE.OctahedronGeometry(0.45, 1);
    const bodyMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.05,
      metalness: 0.8,
      emissive: color,
      emissiveIntensity: 0.2,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    this.group.add(body);
    this.body = body;

    // Head — sphere
    const headGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.05,
      metalness: 0.7,
      emissive: color,
      emissiveIntensity: 0.3,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.55;
    head.castShadow = true;
    this.group.add(head);
    this.head = head;

    // Visor
    const visorGeo = new THREE.SphereGeometry(0.2, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x001122, roughness: 0, metalness: 1,
      transparent: true, opacity: 0.7,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.y = 1.55;
    visor.rotation.x = Math.PI * 0.1;
    this.group.add(visor);

    // Point light — player glow
    const light = new THREE.PointLight(color, 0.5, 4);
    light.position.y = 1;
    this.group.add(light);
    this.light = light;

    // Suspicion ring (hidden by default)
    const susGeo = new THREE.TorusGeometry(0.9, 0.06, 8, 32);
    const susMat = new THREE.MeshBasicMaterial({
      color: COLORS.SUSPECT_RING, transparent: true, opacity: 0
    });
    const susRing = new THREE.Mesh(susGeo, susMat);
    susRing.rotation.x = Math.PI / 2;
    susRing.position.y = 0.9;
    this.group.add(susRing);
    this.suspicionRing = susRing;

    // Name label (sprite)
    this._buildLabel();
  }

  _buildLabel() {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, 256, 64);
    ctx.font = 'bold 28px Courier New';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(this.data.name, 128, 40);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1.8, 0.45, 1);
    sprite.position.y = 2.2;
    this.group.add(sprite);
    this.label = sprite;
  }

  // ── Update suspicion visual ────────────────────────────────────────────────
  setSuspicion(score) {
    if (!this.suspicionRing) return;
    const opacity = Math.max(0, (score - 0.4) * 2.5);
    this.suspicionRing.material.opacity = opacity;
    const color = score > 0.65 ? COLORS.SUSPECT_RING : COLORS.INNOCENT_RING;
    this.suspicionRing.material.color.setHex(color);
  }

  // ── Eliminate animation ────────────────────────────────────────────────────
  eliminate() {
    this.eliminatedEffect = true;
    // Fade out and sink
    const mat = this.body.material;
    mat.transparent = true;
    const interval = setInterval(() => {
      mat.opacity = Math.max(0, mat.opacity - 0.05);
      this.group.position.y -= 0.05;
      if (mat.opacity <= 0) clearInterval(interval);
    }, 50);
  }

  // ── Per-frame update ───────────────────────────────────────────────────────
  update(delta) {
    if (this.eliminatedEffect) return;
    this.time += delta;

    // Hover float
    this.group.position.y = this.baseY + 0.15 * Math.sin(this.time * 1.2 + this.data.id);

    // Body slow rotation
    if (this.body) this.body.rotation.y = this.time * 0.5 + this.data.id;

    // Pulse light
    if (this.light) {
      this.light.intensity = 0.4 + 0.15 * Math.sin(this.time * 2 + this.data.id);
    }

    // Pulse suspicion ring
    if (this.suspicionRing && this.suspicionRing.material.opacity > 0) {
      this.suspicionRing.rotation.z = this.time * 1.5;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    this.group.traverse(c => {
      if (c.isMesh) {
        c.geometry.dispose();
        if (Array.isArray(c.material)) c.material.forEach(m => m.dispose());
        else c.material.dispose();
      }
    });
  }
}
