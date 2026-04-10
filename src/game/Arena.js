// ─────────────────────────────────────────────────────────────────────────────
// Arena.js — 3D tribunal arena built with Three.js
// Hexagonal chamber with glowing pillars, holographic floor grid, and
// floating player platforms
// ─────────────────────────────────────────────────────────────────────────────
import * as THREE from 'three';
import { ARENA, COLORS, PLAYER_COUNT } from '../core/Constants.js';

export class Arena {
  constructor(scene) {
    this.scene = scene;
    this.pillars = [];
    this.pillarLights = [];
    this.gridLines = [];
    this.floatingRings = [];
    this.time = 0;

    this._buildFloor();
    this._buildWalls();
    this._buildPillars();
    this._buildLighting();
    this._buildFog();
    this._buildCeiling();
    this._buildHologramCore();
  }

  _buildFloor() {
    // Main floor — dark with subtle texture
    const geo = new THREE.CylinderGeometry(ARENA.FLOOR_RADIUS, ARENA.FLOOR_RADIUS, 0.3, 64);
    const mat = new THREE.MeshStandardMaterial({
      color: COLORS.FLOOR,
      roughness: 0.2,
      metalness: 0.8,
    });
    const floor = new THREE.Mesh(geo, mat);
    floor.position.y = -0.15;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Glowing grid overlay
    this._buildGridOverlay();

    // Outer ring glow
    const ringGeo = new THREE.TorusGeometry(ARENA.FLOOR_RADIUS, 0.08, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: COLORS.FLOOR_GRID });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    this.scene.add(ring);

    // Inner tribunal circle
    const innerGeo = new THREE.TorusGeometry(4, 0.05, 8, 64);
    const innerMat = new THREE.MeshBasicMaterial({ color: COLORS.FLOOR_GRID, transparent: true, opacity: 0.6 });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.rotation.x = Math.PI / 2;
    inner.position.y = 0.01;
    this.scene.add(inner);
  }

  _buildGridOverlay() {
    const mat = new THREE.LineBasicMaterial({
      color: COLORS.FLOOR_GRID, transparent: true, opacity: 0.12
    });
    const step = 2;
    const size = ARENA.FLOOR_RADIUS;

    for (let x = -size; x <= size; x += step) {
      const pts = [new THREE.Vector3(x, 0.02, -size), new THREE.Vector3(x, 0.02, size)];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      this.scene.add(new THREE.Line(geo, mat));
    }
    for (let z = -size; z <= size; z += step) {
      const pts = [new THREE.Vector3(-size, 0.02, z), new THREE.Vector3(size, 0.02, z)];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      this.scene.add(new THREE.Line(geo, mat));
    }
  }

  _buildWalls() {
    // Hexagonal wall segments
    const sides = 6;
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const nextAngle = ((i + 1) / sides) * Math.PI * 2;
      const r = ARENA.FLOOR_RADIUS + 0.5;

      const x1 = Math.cos(angle) * r, z1 = Math.sin(angle) * r;
      const x2 = Math.cos(nextAngle) * r, z2 = Math.sin(nextAngle) * r;
      const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
      const len = Math.sqrt((x2-x1)**2 + (z2-z1)**2);

      const geo = new THREE.BoxGeometry(len, ARENA.WALL_HEIGHT, 0.3);
      const mat = new THREE.MeshStandardMaterial({
        color: COLORS.WALL, roughness: 0.1, metalness: 0.9,
        transparent: true, opacity: 0.7,
      });
      const wall = new THREE.Mesh(geo, mat);
      wall.position.set(cx, ARENA.WALL_HEIGHT / 2, cz);
      wall.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
      wall.receiveShadow = true;
      this.scene.add(wall);

      // Wall edge glow strip
      const stripGeo = new THREE.BoxGeometry(len, 0.05, 0.05);
      const stripMat = new THREE.MeshBasicMaterial({ color: COLORS.FLOOR_GRID, transparent: true, opacity: 0.4 });
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.set(cx, 0.05, cz);
      strip.rotation.y = wall.rotation.y;
      this.scene.add(strip);
    }
  }

  _buildPillars() {
    for (let i = 0; i < ARENA.PILLAR_COUNT; i++) {
      const angle = (i / ARENA.PILLAR_COUNT) * Math.PI * 2;
      const r = ARENA.RADIUS - 2;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      // Pillar body
      const geo = new THREE.CylinderGeometry(
        ARENA.PILLAR_RADIUS, ARENA.PILLAR_RADIUS * 1.2,
        ARENA.PILLAR_HEIGHT, 8
      );
      const mat = new THREE.MeshStandardMaterial({
        color: COLORS.PILLAR, roughness: 0.1, metalness: 0.95,
      });
      const pillar = new THREE.Mesh(geo, mat);
      pillar.position.set(x, ARENA.PILLAR_HEIGHT / 2, z);
      pillar.castShadow = true;
      this.scene.add(pillar);
      this.pillars.push(pillar);

      // Pillar top cap
      const capGeo = new THREE.CylinderGeometry(ARENA.PILLAR_RADIUS * 1.5, ARENA.PILLAR_RADIUS, 0.3, 8);
      const capMat = new THREE.MeshStandardMaterial({ color: COLORS.PILLAR_GLOW, emissive: COLORS.PILLAR_GLOW, emissiveIntensity: 0.5 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(x, ARENA.PILLAR_HEIGHT + 0.15, z);
      this.scene.add(cap);

      // Pillar point light
      const light = new THREE.PointLight(COLORS.PILLAR_GLOW, 0.4, 8);
      light.position.set(x, ARENA.PILLAR_HEIGHT + 0.5, z);
      this.scene.add(light);
      this.pillarLights.push(light);

      // Floating ring around pillar
      const ringGeo = new THREE.TorusGeometry(ARENA.PILLAR_RADIUS * 2, 0.04, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: COLORS.PILLAR_GLOW, transparent: true, opacity: 0.5 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, ARENA.PILLAR_HEIGHT * 0.6, z);
      ring.rotation.x = Math.PI / 2;
      this.scene.add(ring);
      this.floatingRings.push({ mesh: ring, baseY: ARENA.PILLAR_HEIGHT * 0.6, phase: i });
    }
  }

  _buildLighting() {
    // Ambient — deep blue
    const ambient = new THREE.AmbientLight(COLORS.AMBIENT, 0.5);
    this.scene.add(ambient);

    // Main directional — cool white from above
    const dir = new THREE.DirectionalLight(COLORS.DIR_LIGHT, 0.6);
    dir.position.set(0, 20, 10);
    dir.castShadow = true;
    dir.shadow.mapSize.width = 2048;
    dir.shadow.mapSize.height = 2048;
    this.scene.add(dir);

    // Central tribunal spotlight
    const spot = new THREE.SpotLight(COLORS.HOLOGRAM, 1.5, 30, Math.PI / 8, 0.3);
    spot.position.set(0, 20, 0);
    spot.target.position.set(0, 0, 0);
    this.scene.add(spot);
    this.scene.add(spot.target);
    this.tribunalSpot = spot;
  }

  _buildFog() {
    this.scene.fog = new THREE.FogExp2(COLORS.SKY, 0.025);
  }

  _buildCeiling() {
    // Ceiling ring
    const geo = new THREE.TorusGeometry(ARENA.FLOOR_RADIUS, 0.1, 8, 64);
    const mat = new THREE.MeshBasicMaterial({ color: COLORS.FLOOR_GRID, transparent: true, opacity: 0.3 });
    const ceiling = new THREE.Mesh(geo, mat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = ARENA.WALL_HEIGHT;
    this.scene.add(ceiling);
  }

  _buildHologramCore() {
    // Central holographic tribunal column
    const geo = new THREE.CylinderGeometry(0.05, 0.05, 12, 8);
    const mat = new THREE.MeshBasicMaterial({
      color: COLORS.HOLOGRAM, transparent: true, opacity: 0.3
    });
    const beam = new THREE.Mesh(geo, mat);
    beam.position.y = 6;
    this.scene.add(beam);
    this.hologramBeam = beam;

    // Hologram base disc
    const discGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.05, 32);
    const discMat = new THREE.MeshBasicMaterial({
      color: COLORS.HOLOGRAM, transparent: true, opacity: 0.2
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = 0.03;
    this.scene.add(disc);
    this.hologramDisc = disc;
  }

  // ── Animate arena elements ─────────────────────────────────────────────────
  update(delta) {
    this.time += delta;

    // Pulse pillar lights
    this.pillarLights.forEach((light, i) => {
      light.intensity = 0.3 + 0.15 * Math.sin(this.time * 1.5 + i * 0.8);
    });

    // Float rings up and down
    this.floatingRings.forEach(({ mesh, baseY, phase }) => {
      mesh.position.y = baseY + 0.3 * Math.sin(this.time * 0.8 + phase);
      mesh.rotation.z = this.time * 0.3 + phase;
    });

    // Pulse hologram beam
    if (this.hologramBeam) {
      this.hologramBeam.material.opacity = 0.2 + 0.15 * Math.sin(this.time * 2);
    }
    if (this.hologramDisc) {
      this.hologramDisc.rotation.y = this.time * 0.5;
      this.hologramDisc.material.opacity = 0.15 + 0.1 * Math.sin(this.time * 1.5);
    }
  }

  // ── Flash tribunal spotlight (called during verdict) ──────────────────────
  flashVerdict(guilty) {
    if (!this.tribunalSpot) return;
    this.tribunalSpot.color.setHex(guilty ? 0xff2200 : 0x00ff88);
    this.tribunalSpot.intensity = 3;
    setTimeout(() => {
      if (this.tribunalSpot) {
        this.tribunalSpot.color.setHex(COLORS.HOLOGRAM);
        this.tribunalSpot.intensity = 1.5;
      }
    }, 1500);
  }
}
