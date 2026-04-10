// ─────────────────────────────────────────────────────────────────────────────
// TitleScene.js — Animated 3D background for the title/onboarding screen
// Floating hexagonal tribunal chamber, orbiting proof nodes, ZK beam
// ─────────────────────────────────────────────────────────────────────────────
import * as THREE from 'three';

export class TitleScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.time = 0;
    this.nodes = [];
    this.connections = [];
    this.hexRings = [];

    this._initRenderer();
    this._initScene();
    this._buildBackground();
    this._buildHexRings();
    this._buildOrbitingNodes();
    this._buildCentralCore();
    this._buildStarfield();
    this._buildDataStreams();

    this._animate = this._animate.bind(this);
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
    this.renderer.setAnimationLoop(this._animate);
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas, antialias: true, alpha: false
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x010208);
    this.scene.fog = new THREE.FogExp2(0x010208, 0.018);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);
    this.camera.position.set(0, 8, 28);
    this.camera.lookAt(0, 0, 0);
  }

  // ── Subtle grid floor ──────────────────────────────────────────────────────
  _buildBackground() {
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x00ffcc, transparent: true, opacity: 0.06
    });
    const step = 3, size = 40;
    for (let x = -size; x <= size; x += step) {
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, -6, -size), new THREE.Vector3(x, -6, size)
      ]);
      this.scene.add(new THREE.Line(g, gridMat));
    }
    for (let z = -size; z <= size; z += step) {
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-size, -6, z), new THREE.Vector3(size, -6, z)
      ]);
      this.scene.add(new THREE.Line(g, gridMat));
    }

    // Ambient + directional
    this.scene.add(new THREE.AmbientLight(0x112244, 0.8));
    const dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.position.set(5, 15, 10);
    this.scene.add(dir);
  }

  // ── Concentric hexagonal rings ─────────────────────────────────────────────
  _buildHexRings() {
    const radii = [4, 7, 11, 15];
    const colors = [0x00ffcc, 0x0088ff, 0xaa00ff, 0x00ffcc];

    radii.forEach((r, i) => {
      const pts = [];
      for (let j = 0; j <= 6; j++) {
        const a = (j / 6) * Math.PI * 2 - Math.PI / 6;
        pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: colors[i], transparent: true,
        opacity: 0.15 + (radii.length - i) * 0.05
      });
      const ring = new THREE.Line(geo, mat);
      ring.position.y = -0.5;
      this.scene.add(ring);
      this.hexRings.push({ mesh: ring, speed: 0.08 - i * 0.015, phase: i * 0.5 });
    });
  }

  // ── Orbiting proof nodes ───────────────────────────────────────────────────
  _buildOrbitingNodes() {
    const configs = [
      { r: 7,  count: 6,  size: 0.18, color: 0x00ffcc, speed: 0.4,  y: 0 },
      { r: 11, count: 8,  size: 0.12, color: 0x0088ff, speed: -0.25, y: 1.5 },
      { r: 14, count: 10, size: 0.09, color: 0xaa00ff, speed: 0.18,  y: -1 },
    ];

    configs.forEach(cfg => {
      for (let i = 0; i < cfg.count; i++) {
        const geo = new THREE.OctahedronGeometry(cfg.size, 0);
        const mat = new THREE.MeshStandardMaterial({
          color: cfg.color, emissive: cfg.color, emissiveIntensity: 0.6,
          roughness: 0.1, metalness: 0.8,
        });
        const mesh = new THREE.Mesh(geo, mat);

        // Point light on each node
        const light = new THREE.PointLight(cfg.color, 0.3, 3);
        mesh.add(light);

        this.scene.add(mesh);
        this.nodes.push({
          mesh, r: cfg.r, speed: cfg.speed,
          phase: (i / cfg.count) * Math.PI * 2,
          y: cfg.y, color: cfg.color,
        });
      }
    });

    // Draw connection lines between nearby nodes (static, updated each frame)
    this._connectionLines = [];
  }

  // ── Central holographic core ───────────────────────────────────────────────
  _buildCentralCore() {
    // Outer icosahedron wireframe
    const outerGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.15
    });
    this.outerCore = new THREE.Mesh(outerGeo, outerMat);
    this.scene.add(this.outerCore);

    // Inner solid icosahedron
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x001122, emissive: 0x00ffcc, emissiveIntensity: 0.3,
      roughness: 0, metalness: 1, transparent: true, opacity: 0.8,
    });
    this.innerCore = new THREE.Mesh(innerGeo, innerMat);
    this.scene.add(this.innerCore);

    // Core glow light
    const coreLight = new THREE.PointLight(0x00ffcc, 2, 12);
    this.scene.add(coreLight);
    this.coreLight = coreLight;

    // Vertical beam
    const beamGeo = new THREE.CylinderGeometry(0.03, 0.8, 20, 8, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x0088ff, transparent: true, opacity: 0.08,
      side: THREE.DoubleSide,
    });
    this.beam = new THREE.Mesh(beamGeo, beamMat);
    this.beam.position.y = 4;
    this.scene.add(this.beam);

    // Horizontal scan ring
    const scanGeo = new THREE.TorusGeometry(3, 0.04, 8, 64);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x00ffcc, transparent: true, opacity: 0.4
    });
    this.scanRing = new THREE.Mesh(scanGeo, scanMat);
    this.scanRing.rotation.x = Math.PI / 2;
    this.scene.add(this.scanRing);
  }

  // ── Starfield ──────────────────────────────────────────────────────────────
  _buildStarfield() {
    const count = 400;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 200;
      pos[i*3+1] = (Math.random() - 0.5) * 100;
      pos[i*3+2] = (Math.random() - 0.5) * 200;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.08, transparent: true, opacity: 0.5
    });
    this.scene.add(new THREE.Points(geo, mat));
  }

  // ── Floating data stream particles ────────────────────────────────────────
  _buildDataStreams() {
    const count = 80;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 12;
      pos[i*3]   = Math.cos(a) * r;
      pos[i*3+1] = (Math.random() - 0.5) * 10;
      pos[i*3+2] = Math.sin(a) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x00ffcc, size: 0.12, transparent: true, opacity: 0.4,
      sizeAttenuation: true,
    });
    this.dataStream = new THREE.Points(geo, mat);
    this.scene.add(this.dataStream);
    this._streamPos = pos;
  }

  // ── Animation loop ─────────────────────────────────────────────────────────
  _animate() {
    this.time += 0.016;
    const t = this.time;

    // Rotate cores
    this.outerCore.rotation.y = t * 0.2;
    this.outerCore.rotation.x = t * 0.1;
    this.innerCore.rotation.y = -t * 0.35;
    this.innerCore.rotation.z = t * 0.15;

    // Pulse core light
    this.coreLight.intensity = 1.5 + 0.8 * Math.sin(t * 2.5);

    // Scan ring oscillates vertically
    this.scanRing.position.y = 3 * Math.sin(t * 0.6);
    this.scanRing.material.opacity = 0.2 + 0.25 * Math.abs(Math.sin(t * 0.6));

    // Beam pulse
    this.beam.material.opacity = 0.05 + 0.06 * Math.sin(t * 1.8);
    this.beam.rotation.y = t * 0.5;

    // Orbit nodes
    this.nodes.forEach(n => {
      const a = n.phase + t * n.speed;
      n.mesh.position.set(
        Math.cos(a) * n.r,
        n.y + 0.5 * Math.sin(t * 0.7 + n.phase),
        Math.sin(a) * n.r
      );
      n.mesh.rotation.y = t * 2;
    });

    // Hex rings slow rotation
    this.hexRings.forEach(h => {
      h.mesh.rotation.y = t * h.speed + h.phase;
      h.mesh.material.opacity = 0.08 + 0.06 * Math.sin(t * 0.5 + h.phase);
    });

    // Data stream drift upward
    for (let i = 0; i < this._streamPos.length / 3; i++) {
      this._streamPos[i*3+1] += 0.02;
      if (this._streamPos[i*3+1] > 6) this._streamPos[i*3+1] = -6;
    }
    this.dataStream.geometry.attributes.position.needsUpdate = true;

    // Slow camera drift
    this.camera.position.x = 3 * Math.sin(t * 0.07);
    this.camera.position.y = 8 + 1.5 * Math.sin(t * 0.05);
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ── Teardown when game starts ──────────────────────────────────────────────
  dispose() {
    this.renderer.setAnimationLoop(null);
    window.removeEventListener('resize', this._onResize);
    this.renderer.dispose();
  }
}
