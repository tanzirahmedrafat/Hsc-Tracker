import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { toBengaliNumber } from '../../utils/bengali';
import { Sparkles, RotateCw, Droplets } from 'lucide-react';

interface StudyTree3DProps {
  percentage: number;
  streakDays?: number;
  completedChapters?: number;
  totalChapters?: number;
}

export const StudyTree3D: React.FC<StudyTree3DProps> = ({
  percentage,
  streakDays = 1,
  completedChapters = 0,
  totalChapters = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [activeStageInfo, setActiveStageInfo] = useState<string>('');
  const [waterEffectTrigger, setWaterEffectTrigger] = useState(0);

  // Growth Stage Definitions
  const isSprout = percentage <= 12;
  const isSeedling = percentage > 12 && percentage <= 35;
  const isYoungTree = percentage > 35 && percentage <= 68;
  const isFlowering = percentage > 68 && percentage < 95;
  const isFruitBearing = percentage >= 95;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Compact viewport height so the entire tree & card are fully visible without clipping
    const width = container.clientWidth || 300;
    const height = 245;

    // 1. Scene & Camera Setup with optimal framing
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);

    // Balanced camera framing ensuring top leaves and pot base are 100% visible
    if (isSprout) {
      camera.position.set(0, 0.95, 3.1);
      camera.lookAt(0, 0.52, 0);
    } else if (isSeedling) {
      camera.position.set(0, 1.35, 3.8);
      camera.lookAt(0, 0.78, 0);
    } else if (isYoungTree) {
      camera.position.set(0, 1.7, 4.6);
      camera.lookAt(0, 0.98, 0);
    } else {
      // Full mature / flowering / fruit tree: pull back slightly for complete framing
      camera.position.set(0, 1.85, 5.0);
      camera.lookAt(0, 1.05, 0);
    }

    // 2. High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Realistic Nature Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    // Warm sun light for high-fidelity leaf translucency
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.5);
    sunLight.position.set(3.5, 6, 4.5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Sky soft bounce light
    const skyFill = new THREE.DirectionalLight(0xdbeafe, 0.7);
    skyFill.position.set(-3, 3.5, -3);
    scene.add(skyFill);

    // Root Group for interactive 360-degree rotation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Dynamic stage info text
    let stageTitle = 'কচি চারাগাছ (০% - ১২%)';
    if (isFruitBearing) {
      stageTitle = '🍎 ফলবান মহীরুহ (১০০% সম্পন্ন 🎉)';
    } else if (isFlowering) {
      stageTitle = '🌸 পুষ্পশোভিত বৃক্ষ (৭০% - ৯৪%)';
    } else if (isYoungTree) {
      stageTitle = '🌿 কচি ডালপালার বাড়ন্ত গাছ (৩৬% - ৬৯%)';
    } else if (isSeedling) {
      stageTitle = '🌱 ছোট চারাগাছ (১৩% - ৩৫%)';
    }
    setActiveStageInfo(stageTitle);

    // 4. Compact, Realistic Ceramic Planter Pot with Moist Soil
    const potGroup = new THREE.Group();
    rootGroup.add(potGroup);

    // Clean, minimalist modern white-ceramic / terracotta planter
    const potHeight = 0.55;
    const potTopRadius = 0.88;
    const potBottomRadius = 0.65;
    const potGeo = new THREE.CylinderGeometry(potTopRadius, potBottomRadius, potHeight, 32);
    const potMat = new THREE.MeshStandardMaterial({
      color: 0xeadbc8, // Elegant warm ceramic earthenware
      roughness: 0.5,
      metalness: 0.05,
    });
    const potMesh = new THREE.Mesh(potGeo, potMat);
    potMesh.position.y = potHeight / 2;
    potMesh.castShadow = true;
    potMesh.receiveShadow = true;
    potGroup.add(potMesh);

    // Top rim ring
    const rimGeo = new THREE.TorusGeometry(potTopRadius + 0.015, 0.045, 12, 32);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xdcc7b0, roughness: 0.45 });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = potHeight;
    potGroup.add(rimMesh);

    // Moist dark organic soil
    const soilGeo = new THREE.CylinderGeometry(potTopRadius - 0.03, potTopRadius - 0.03, 0.08, 32);
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x302115, // deep fertile dark brown loam
      roughness: 0.95,
      metalness: 0.01,
    });
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.position.y = potHeight - 0.02;
    soilMesh.receiveShadow = true;
    potGroup.add(soilMesh);

    // Soft velvety moss patches around base of trunk
    const mossGeo = new THREE.TorusGeometry(0.55, 0.08, 8, 24);
    const mossMat = new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.95 });
    const mossMesh = new THREE.Mesh(mossGeo, mossMat);
    mossMesh.rotation.x = Math.PI / 2;
    mossMesh.position.y = potHeight + 0.01;
    potGroup.add(mossMesh);

    // 5. Procedural Botanical Leaf & Twig Engine
    const treeGroup = new THREE.Group();
    treeGroup.position.y = potHeight; // Rests exactly on soil surface
    rootGroup.add(treeGroup);

    // Shared realistic botanical leaf geometry (tapered ellipse with pointed tip & central curvature)
    const createBotanicalLeafGeometry = () => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0); // Petiole attachment
      shape.bezierCurveTo(0.08, 0.06, 0.12, 0.22, 0, 0.44); // Right curved blade to tip
      shape.bezierCurveTo(-0.12, 0.22, -0.08, 0.06, 0, 0); // Left blade back to base
      return new THREE.ShapeGeometry(shape, 12);
    };
    const leafGeo = createBotanicalLeafGeometry();

    // Two-tone leaf materials for depth and sunlit translucency
    const leafMatPrimary = new THREE.MeshStandardMaterial({
      color: 0x15803d, // rich forest green blade
      roughness: 0.38,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const leafMatTender = new THREE.MeshStandardMaterial({
      color: 0x4ade80, // young tender sunlit green
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    // Material for woody trunk
    const woodBarkMat = new THREE.MeshStandardMaterial({
      color: 0x4a3728, // natural tree bark brown
      roughness: 0.9,
      metalness: 0.05,
    });

    // Material for tender young green twigs (কচি ডাল)
    const tenderTwigMat = new THREE.MeshStandardMaterial({
      color: 0x65a30d, // supple green-olive bark
      roughness: 0.65,
      metalness: 0.05,
    });

    const animatedParts: Array<{ obj: THREE.Object3D; baseRot: number; speed: number; amp: number }> = [];

    // Helper: Attach an organic leaf to a branch coordinate with realistic angle
    const attachLeaf = (
      parent: THREE.Object3D,
      pos: [number, number, number],
      rot: [number, number, number],
      scale = 1.0,
      isTender = false
    ) => {
      const leafGroup = new THREE.Group();
      leafGroup.position.set(pos[0], pos[1], pos[2]);

      // Slender little petiole stem (বোঁটা)
      const petioleGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.08 * scale, 6);
      const petiole = new THREE.Mesh(petioleGeo, tenderTwigMat);
      petiole.position.y = 0.04 * scale;
      leafGroup.add(petiole);

      // Curved leaf blade
      const leafMesh = new THREE.Mesh(leafGeo, isTender ? leafMatTender : leafMatPrimary);
      leafMesh.scale.set(scale * 0.75, scale * 0.75, scale * 0.75);
      leafMesh.position.y = 0.07 * scale;
      leafMesh.rotation.x = 0.25; // natural outward droop/curve
      leafMesh.castShadow = true;
      leafGroup.add(leafMesh);

      leafGroup.rotation.set(rot[0], rot[1], rot[2]);
      parent.add(leafGroup);

      animatedParts.push({
        obj: leafGroup,
        baseRot: rot[2],
        speed: 1.8 + Math.random() * 0.8,
        amp: 0.05 + Math.random() * 0.03,
      });
      return leafGroup;
    };

    // Helper: Create a visible slender twig (কচি ডাল)
    const createTwig = (
      parent: THREE.Object3D,
      start: [number, number, number],
      dir: [number, number, number],
      len: number,
      r1 = 0.025,
      r2 = 0.015,
      isTender = true
    ) => {
      const twigGeo = new THREE.CylinderGeometry(r2, r1, len, 8);
      const twigMesh = new THREE.Mesh(twigGeo, isTender ? tenderTwigMat : woodBarkMat);
      twigMesh.castShadow = true;

      // Position halfway along length
      twigMesh.position.set(start[0], start[1] + len / 2, start[2]);
      twigMesh.rotation.set(dir[0], dir[1], dir[2]);
      parent.add(twigMesh);

      return {
        mesh: twigMesh,
        tip: [
          start[0] - Math.sin(dir[2]) * len,
          start[1] + Math.cos(dir[2]) * len,
          start[2] + Math.sin(dir[0]) * len,
        ] as [number, number, number],
      };
    };

    // ==========================================
    // STAGE IMPLEMENTATION (Botanical lifecycle)
    // ==========================================
    if (isSprout) {
      // ------------------------------------------
      // STAGE 1: DELICATE SPROUT (০% - ১২%)
      // ------------------------------------------
      const sproutColor = percentage === 0 ? 0x84cc16 : 0x4ade80;

      // Curved supple green sprout stalk
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.025, 0.18, 0.01),
        new THREE.Vector3(-0.015, 0.38, 0.03),
      ]);
      const stalkGeo = new THREE.TubeGeometry(curve, 16, 0.025, 8, false);
      const stalkMat = new THREE.MeshStandardMaterial({ color: sproutColor, roughness: 0.55 });
      const stalk = new THREE.Mesh(stalkGeo, stalkMat);
      stalk.castShadow = true;
      treeGroup.add(stalk);

      // Two delicate, pointed botanical leaves opening to the sky
      attachLeaf(treeGroup, [0, 0.36, 0.02], [-0.3, 0.8, -0.65], 0.75, true);
      attachLeaf(treeGroup, [0, 0.36, 0.02], [0.3, -0.8, 0.65], 0.75, true);

      // Tiny apical bud emerging
      const budGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const budMat = new THREE.MeshStandardMaterial({ color: 0x86efac });
      const bud = new THREE.Mesh(budGeo, budMat);
      bud.position.set(-0.01, 0.41, 0.03);
      treeGroup.add(bud);

    } else if (isSeedling) {
      // ------------------------------------------
      // STAGE 2: YOUNG SAPLING (১৩% - ৩৫%)
      // ------------------------------------------
      // Main central slender stem
      const stemH = 0.85;
      const mainStemGeo = new THREE.CylinderGeometry(0.03, 0.055, stemH, 10);
      const mainStem = new THREE.Mesh(mainStemGeo, tenderTwigMat);
      mainStem.position.y = stemH / 2;
      mainStem.castShadow = true;
      treeGroup.add(mainStem);

      // 4 slender visible side twigs (কচি ডালপালা)
      const twigConfigs = [
        { y: 0.28, rot: [0.3, 0.5, -0.55], len: 0.28 },
        { y: 0.45, rot: [-0.3, -0.7, 0.6], len: 0.32 },
        { y: 0.62, rot: [0.4, 1.2, -0.5], len: 0.28 },
        { y: 0.75, rot: [-0.4, -1.1, 0.52], len: 0.25 },
      ];

      twigConfigs.forEach((cfg) => {
        const { tip } = createTwig(treeGroup, [0, cfg.y, 0], cfg.rot as any, cfg.len, 0.02, 0.012, true);
        // Attach 2-3 leaves along each tender twig
        attachLeaf(treeGroup, tip, [cfg.rot[0] * 1.2, cfg.rot[1], cfg.rot[2] * 1.1], 0.8, true);
        attachLeaf(
          treeGroup,
          [tip[0] * 0.6, tip[1] * 0.9, tip[2] * 0.6],
          [cfg.rot[0], cfg.rot[1] + 1.2, cfg.rot[2] - 0.4],
          0.7,
          false
        );
      });

      // Terminal apex leaf cluster at top of stem
      attachLeaf(treeGroup, [0, stemH, 0], [0.3, 0, -0.3], 0.85, true);
      attachLeaf(treeGroup, [0, stemH, 0], [-0.3, 2.1, 0.3], 0.85, true);
      attachLeaf(treeGroup, [0, stemH, 0], [0.1, -1.9, 0.2], 0.8, true);

    } else {
      // ------------------------------------------
      // STAGE 3, 4, 5: MATURE / FLOWER / FRUITFUL TREE (৩৬% - ১০০%)
      // ------------------------------------------
      const growthFactor = (percentage - 35) / 65; // 0 to 1
      const trunkH = 0.95 + growthFactor * 0.45; // Compact trunk height (0.95 to 1.4)
      const trunkRadius = 0.12 + growthFactor * 0.08;

      // Realistic Bark Trunk with gentle botanical curve
      const trunkGeo = new THREE.CylinderGeometry(trunkRadius * 0.7, trunkRadius, trunkH, 16);
      const trunk = new THREE.Mesh(trunkGeo, woodBarkMat);
      trunk.position.y = trunkH / 2;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // Primary structural wooden branches
      const primaryBranches = [
        { y: trunkH * 0.65, rot: [0.25, 0.4, -0.65], len: 0.45 + growthFactor * 0.25, r: 0.055 },
        { y: trunkH * 0.75, rot: [-0.3, -0.8, 0.65], len: 0.48 + growthFactor * 0.25, r: 0.05 },
        { y: trunkH * 0.85, rot: [0.45, 1.3, -0.55], len: 0.42 + growthFactor * 0.22, r: 0.045 },
        { y: trunkH * 0.92, rot: [-0.4, 0.2, 0.5], len: 0.4 + growthFactor * 0.2, r: 0.04 },
      ];

      // Secondary tender green twigs (কচি ডাল) branching from the wooden branches
      primaryBranches.forEach((b) => {
        const { tip } = createTwig(treeGroup, [0, b.y, 0], b.rot as any, b.len, b.r, b.r * 0.65, false);

        // Sub-twig 1 (Tender green shoot)
        const sub1 = createTwig(
          treeGroup,
          tip,
          [b.rot[0] + 0.2, b.rot[1] + 0.4, b.rot[2] - 0.3],
          0.3 + growthFactor * 0.15,
          0.022,
          0.012,
          true
        );
        // Sub-twig 2 (Tender green shoot)
        const sub2 = createTwig(
          treeGroup,
          tip,
          [b.rot[0] - 0.2, b.rot[1] - 0.5, b.rot[2] + 0.3],
          0.28 + growthFactor * 0.12,
          0.02,
          0.01,
          true
        );

        // Populate realistic botanical leaves along the tender twigs
        [tip, sub1.tip, sub2.tip].forEach((twigPoint, pIdx) => {
          attachLeaf(treeGroup, twigPoint, [0.3, pIdx * 1.5, -0.4], 0.9, pIdx > 0);
          attachLeaf(
            treeGroup,
            [twigPoint[0] * 0.85, twigPoint[1] * 0.95, twigPoint[2] * 0.85],
            [-0.3, pIdx * 1.5 + 2.0, 0.5],
            0.8,
            false
          );
        });

        // 🌸 STAGE 4: DELICATE BLOSSOMS / FLOWERS (৭০% - ৯৪%)
        if (isFlowering || isFruitBearing) {
          const flowerGroup = new THREE.Group();
          // Petals
          const petalGeo = new THREE.SphereGeometry(0.065, 8, 8);
          const petalMat = new THREE.MeshStandardMaterial({
            color: 0xf472b6, // Soft cherry blossom pink
            roughness: 0.3,
            emissive: 0xdb2777,
            emissiveIntensity: 0.25,
          });
          const petal = new THREE.Mesh(petalGeo, petalMat);
          flowerGroup.add(petal);

          // Yellow center pistil
          const centerGeo = new THREE.SphereGeometry(0.03, 6, 6);
          const centerMat = new THREE.MeshStandardMaterial({ color: 0xfde047 });
          const center = new THREE.Mesh(centerGeo, centerMat);
          center.position.z = 0.045;
          flowerGroup.add(center);

          flowerGroup.position.set(sub1.tip[0], sub1.tip[1] + 0.05, sub1.tip[0]);
          treeGroup.add(flowerGroup);
        }

        // 🍎 STAGE 5: RIPE JUICY FRUITS HANGING FROM ACTUAL TWIGS (৯৫% - ১০০%)
        if (isFruitBearing) {
          const fruitGroup = new THREE.Group();

          const appleMat = new THREE.MeshStandardMaterial({
            color: 0xdc2626, // Glossy ripe red apple
            roughness: 0.2,
            metalness: 0.15,
            emissive: 0x991b1b,
            emissiveIntensity: 0.25,
          });

          const goldenFruitMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b, // Golden ripe mango / apple
            roughness: 0.22,
            metalness: 0.2,
            emissive: 0xd97706,
            emissiveIntensity: 0.3,
          });

          // Fruit sphere
          const fruitGeo = new THREE.SphereGeometry(0.11, 16, 16);
          const isGolden = Math.random() > 0.45;
          const fruitMesh = new THREE.Mesh(fruitGeo, isGolden ? goldenFruitMat : appleMat);
          fruitMesh.castShadow = true;
          fruitGroup.add(fruitMesh);

          // Slender stem hanging fruit from twig
          const stemGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.09, 6);
          const stemMat = new THREE.MeshStandardMaterial({ color: 0x3d2716 });
          const stemMesh = new THREE.Mesh(stemGeo, stemMat);
          stemMesh.position.y = 0.11;
          fruitGroup.add(stemMesh);

          // Tiny green leaf on fruit stem
          const leafTinyGeo = new THREE.PlaneGeometry(0.07, 0.04);
          const leafTiny = new THREE.Mesh(leafTinyGeo, leafMatTender);
          leafTiny.position.set(0.03, 0.12, 0);
          leafTiny.rotation.z = 0.4;
          fruitGroup.add(leafTiny);

          // Position hanging below twig
          fruitGroup.position.set(sub2.tip[0], sub2.tip[1] - 0.08, sub2.tip[2]);
          treeGroup.add(fruitGroup);
          animatedParts.push({ obj: fruitGroup, baseRot: 0, speed: 2.2, amp: 0.03 });
        }
      });

      // Terminal apex leaves at top of tree
      for (let a = 0; a < 6; a++) {
        const angle = a * (Math.PI / 3);
        attachLeaf(
          treeGroup,
          [Math.cos(angle) * 0.18, trunkH + 0.15, Math.sin(angle) * 0.18],
          [0.4, angle, 0.5],
          0.95,
          a % 2 === 0
        );
      }
    }

    // 6. Natural floating spores / golden sparkles
    const particleCount = isFruitBearing ? 30 : 12;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 2.8;
      particlePos[i * 3 + 1] = Math.random() * 2.2 + 0.5;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleColor = isFruitBearing ? 0xfbbf24 : 0x86efac;
    const particleMat = new THREE.PointsMaterial({
      color: particleColor,
      size: isFruitBearing ? 0.065 : 0.045,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Interactive 360-degree Orbit Drag
    let isDragging = false;
    let prevMouseX = 0;
    let manualRotSpeed = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      prevMouseX = clientX;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - prevMouseX;
      prevMouseX = clientX;
      rootGroup.rotation.y += deltaX * 0.012;
      manualRotSpeed = deltaX * 0.003;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    dom.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 8. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth auto-rotation
      if (!isDragging) {
        if (isRotating) {
          rootGroup.rotation.y += 0.004 + manualRotSpeed;
        } else {
          rootGroup.rotation.y += manualRotSpeed;
        }
        manualRotSpeed *= 0.92;
      }

      // Gentle natural breeze sway on individual leaves and twigs
      animatedParts.forEach((part, idx) => {
        const offset = idx * 0.45;
        part.obj.rotation.z = part.baseRot + Math.sin(elapsedTime * part.speed + offset) * part.amp;
      });

      // Floating spores / sparkles rise softly
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.003;
        if (positions[i * 3 + 1] > 2.8) {
          positions[i * 3 + 1] = 0.6;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      if (newW > 0) {
        camera.aspect = newW / height;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, height);
      }
    };
    window.addEventListener('resize', handleResize);

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      dom.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      if (container.contains(dom)) {
        container.removeChild(dom);
      }

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [percentage, isSprout, isSeedling, isYoungTree, isFlowering, isFruitBearing]);

  const handleWaterClick = () => {
    setWaterEffectTrigger((prev) => prev + 1);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-sky-50/60 via-emerald-50/20 to-stone-100/60 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-slate-950 border border-stone-200/80 dark:border-slate-800 shadow-xs">
      {/* Top Floating Badge with Stage & Percentage */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 rounded-full border border-stone-200/80 dark:border-slate-700 shadow-2xs pointer-events-auto">
          <div
            className={`w-2 h-2 rounded-full animate-pulse ${
              isFruitBearing
                ? 'bg-amber-500'
                : isFlowering
                ? 'bg-pink-500'
                : isYoungTree
                ? 'bg-emerald-500'
                : isSeedling
                ? 'bg-lime-500'
                : 'bg-stone-400'
            }`}
          />
          <span className="text-xs font-black text-slate-800 dark:text-slate-100 font-sans">
            {toBengaliNumber(percentage)}%
          </span>
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-300">
            {isFruitBearing
              ? '🍎 পাকা ফল'
              : isFlowering
              ? '🌸 প্রস্ফুটিত ফুল'
              : isYoungTree
              ? '🌿 কচি ডালপালা'
              : isSeedling
              ? '🌱 বাড়ন্ত চারা'
              : '🌱 কচি অঙ্কুর'}
          </span>
        </div>

        {/* Action Controls: Water & Rotate */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={handleWaterClick}
            className="p-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 hover:bg-sky-50 active:scale-95 transition shadow-2xs"
            title="চারাগাছে পানি দিন"
          >
            <Droplets className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className="p-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-stone-200/80 dark:border-slate-700 text-stone-600 dark:text-stone-300 hover:text-slate-900 active:scale-95 transition shadow-2xs"
            title={isRotating ? 'অটো-ঘূর্ণন বন্ধ করুন' : 'অটো-ঘূর্ণন চালু করুন'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container: 245px compact height for optimal whole-tree view */}
      <div
        ref={mountRef}
        className="w-full h-[245px] cursor-grab active:cursor-grabbing select-none"
        title="মাউস বা আঙুল দিয়ে ৩৬০° ঘুরিয়ে দেখুন"
      />

      {/* Bottom Interactive Info Bar */}
      <div className="px-3.5 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-stone-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-200 font-semibold truncate text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">{activeStageInfo}</span>
        </div>

        <span className="text-[10px] font-sans text-stone-500 dark:text-stone-400 shrink-0 ml-1.5">
          ৩৬০° ঘোরান 🔄
        </span>
      </div>
    </div>
  );
};
