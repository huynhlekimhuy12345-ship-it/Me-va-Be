/**
 * BabyClothesHero — Three.js hero scene, strictly baby-clothes themed.
 *
 * Floating pastel 3D garments (onesie, t-shirt, dress, beanie, socks) plus
 * small stars and clouds, gently bobbing with light mouse parallax.
 * Performance guards (required for mobile):
 * - few meshes, no shadows, pixelRatio capped at 1.5
 * - animation pauses when the tab is hidden
 * - honors prefers-reduced-motion (renders one static frame, no loop)
 * - if WebGL is unavailable, the canvas hides itself and the page keeps working
 */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const pastel = (hex) => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.9, metalness: 0 });

function buildOnesie() {
  const g = new THREE.Group();
  const pink = pastel(0xff8fab);
  const white = pastel(0xfff8f0);
  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.05, 0.3), pink);
  torso.position.y = 0.1;
  g.add(torso);
  for (const side of [-1, 1]) {
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.55, 16), pink);
    sleeve.position.set(side * 0.62, 0.48, 0);
    sleeve.rotation.z = side * -1.15;
    g.add(sleeve);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.5, 16), pink);
    leg.position.set(side * 0.26, -0.68, 0);
    g.add(leg);
  }
  for (const y of [0.38, 0.08, -0.22]) {
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), white);
    btn.position.set(0, y, 0.17);
    g.add(btn);
  }
  return g;
}

function buildTee() {
  const g = new THREE.Group();
  const mint = pastel(0x7bc9a6);
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.95, 0.28), mint);
  g.add(body);
  for (const side of [-1, 1]) {
    const sleeve = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.28), mint);
    sleeve.position.set(side * 0.78, 0.28, 0);
    sleeve.rotation.z = side * -0.25;
    g.add(sleeve);
  }
  return g;
}

function buildDress() {
  const g = new THREE.Group();
  const yellow = pastel(0xffd97a);
  const bodice = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.5, 20), yellow);
  bodice.position.y = 0.55;
  g.add(bodice);
  const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.72, 1.1, 24), yellow);
  skirt.position.y = -0.25;
  g.add(skirt);
  return g;
}

function buildBeanie() {
  const g = new THREE.Group();
  const coral = pastel(0xff9e7a);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 16), coral);
  cap.scale.set(1, 0.75, 1);
  g.add(cap);
  const pom = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 12), pastel(0xfff8f0));
  pom.position.y = 0.38;
  g.add(pom);
  return g;
}

function buildSocks() {
  const g = new THREE.Group();
  const white = pastel(0xffffff);
  const mint = pastel(0xc5f0dc);
  for (const [side, mat] of [
    [-1, white],
    [1, mint],
  ]) {
    const sock = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.34, 6, 12), mat);
    sock.position.set(side * 0.18, 0, 0);
    sock.rotation.z = side * 0.35;
    g.add(sock);
  }
  return g;
}

function buildStar() {
  return new THREE.Mesh(new THREE.OctahedronGeometry(0.15), pastel(0xffefc7));
}

function buildCloud() {
  const g = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.92 });
  const parts = [
    [0, 0, 0.34],
    [-0.3, -0.05, 0.26],
    [0.3, -0.05, 0.26],
  ];
  for (const [x, y, r] of parts) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), white);
    s.position.set(x, y, 0);
    s.scale.y = 0.7;
    g.add(s);
  }
  return g;
}

export function BabyClothesHero() {
  const containerRef = useRef(null);
  const failedRef = useRef(false);
  const [, setFailed] = React.useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      failedRef.current = true;
      setFailed(true);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.3, 7);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(3, 5, 4);
    scene.add(dir);

    const stage = new THREE.Group();
    scene.add(stage);

    const place = (obj, x, y, z, s, amp, speed, phase) => {
      obj.position.set(x, y, z);
      obj.scale.setScalar(s);
      stage.add(obj);
      return { obj, baseY: y, amp, speed, phase };
    };

    const floaters = [
      place(buildOnesie(), -1.7, 0.5, 0, 0.95, 0.16, 1.1, 0),
      place(buildTee(), 1.75, 0.75, -0.3, 0.9, 0.13, 0.9, 1.4),
      place(buildDress(), 0.15, -0.9, -0.6, 0.85, 0.11, 1.0, 2.6),
      place(buildBeanie(), 1.9, -0.9, 0.2, 0.9, 0.15, 1.3, 0.7),
      place(buildSocks(), -1.9, -1.05, 0.1, 0.95, 0.12, 1.2, 2.0),
      place(buildStar(), -2.3, 1.5, -0.5, 1, 0.1, 1.4, 0.3),
      place(buildStar(), 2.35, 1.35, -0.5, 0.8, 0.1, 1.1, 1.9),
      place(buildStar(), 0.4, 1.85, -0.8, 0.7, 0.08, 1.5, 3.1),
      place(buildCloud(), -2.2, -1.7, -1, 0.9, 0.07, 0.7, 1.1),
      place(buildCloud(), 2.2, -1.8, -1, 0.8, 0.07, 0.8, 2.4),
    ];

    const resize = () => {
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = null;
    let running = true;
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2;
      pointer.y = ((e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2;
    };
    container.addEventListener('pointermove', onPointerMove);

    const clock = new THREE.Clock();
    const renderFrame = () => {
      const t = clock.getElapsedTime();
      for (const f of floaters) {
        f.obj.position.y = f.baseY + Math.sin(t * f.speed + f.phase) * f.amp;
        f.obj.rotation.y = Math.sin(t * 0.4 + f.phase) * 0.22;
      }
      stage.rotation.y += (pointer.x * 0.14 - stage.rotation.y) * 0.05;
      stage.rotation.x += (-pointer.y * 0.08 - stage.rotation.x) * 0.05;
      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!running) return;
      renderFrame();
      rafId = requestAnimationFrame(loop);
    };
    if (reducedMotion) {
      renderFrame();
    } else {
      loop();
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      } else if (!reducedMotion && running === false) {
        running = true;
        clock.getElapsedTime();
        loop();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibility);
      container.removeEventListener('pointermove', onPointerMove);
      observer.disconnect();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (failedRef.current) return null;
  return <div ref={containerRef} className="relative w-full h-full" aria-hidden="true" />;
}

export default BabyClothesHero;
