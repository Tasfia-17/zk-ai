// ─────────────────────────────────────────────────────────────────────────────
// ParticleSystem.js — Ambient particles + ZK proof beam effects
// ─────────────────────────────────────────────────────────────────────────────
import * as THREE from 'three';
import { COLORS } from '../core/Constants.js';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this._buildAmbientParticles();
    this._buildProofBeam();
  }

  _buildAmbientParticles() {
    const count = 200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(COLORS.FLOOR_GRID),
      new THREE.Color(COLORS.PROOF_BEAM),
      new THREE.Color(0xaa00ff),
    ];

    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 15;
      const angle = Math.random() * Math.PI * 2;
      positions[i*3]   = Math.cos(angle) * r;
      positions[i*3+1] = Math.random() * 8;
      positions[i*3+2] = Math.sin(angle) * r;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i*3]   = c.r;
      colors[i*3+1] = c.g;
      colors[i*3+2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.06, vertexColors: true,
      transparent: true, opacity: 0.6,
      sizeAttenuation: true,
    });

    this.ambientPoints = new THREE.Points(geo, mat);
    this.scene.add(this.ambientPoints);
    this._ambientPositions = positions;
    this._ambientCount = count;
  }

  _buildProofBeam() {
    // Vertical beam that activates during ZK proof generation
    const geo = new THREE.CylinderGeometry(0.02, 0.5, 12, 8, 1, true);
    const mat = new THREE.MeshBasicMaterial({
      color: COLORS.PROOF_BEAM,
      transparent: true, opacity: 0,
      side: THREE.DoubleSide,
    });
    this.proofBeam = new THREE.Mesh(geo, mat);
    this.proofBeam.position.y = 6;
    this.scene.add(this.proofBeam);
    this._beamActive = false;
    this._beamTime = 0;
  }

  activateProofBeam() {
    this._beamActive = true;
    this._beamTime = 0;
  }

  deactivateProofBeam() {
    this._beamActive = false;
  }

  update(delta) {
    const t = performance.now() * 0.001;

    // Drift ambient particles
    const pos = this._ambientPositions;
    for (let i = 0; i < this._ambientCount; i++) {
      pos[i*3+1] += delta * 0.3;
      if (pos[i*3+1] > 9) pos[i*3+1] = 0;
    }
    this.ambientPoints.geometry.attributes.position.needsUpdate = true;
    this.ambientPoints.rotation.y = t * 0.05;

    // Proof beam pulse
    if (this._beamActive) {
      this._beamTime += delta;
      this.proofBeam.material.opacity = 0.15 + 0.1 * Math.sin(this._beamTime * 8);
      this.proofBeam.rotation.y = this._beamTime * 2;
    } else {
      this.proofBeam.material.opacity = Math.max(0, this.proofBeam.material.opacity - delta * 2);
    }
  }
}
