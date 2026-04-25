"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, RoundedBox, Text, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { CorrectionSceneData } from "@/lib/types";

useGLTF.preload("/models/officer.glb");
useGLTF.preload("/models/citizen.glb");

type SceneVariant = "comparison" | "practice";

export type SceneProps = {
  playing: boolean;
  scene: CorrectionSceneData;
  variant?: SceneVariant;
  height?: number;
  caption?: string;
  highlightSide?: "correct" | "wrong" | null;
};

// World coordinates of the puddle
const PUDDLE_X = 1.2;
const PUDDLE_Z = 0.4;
const ACTION_Z = PUDDLE_Z; // characters walk along this z line

// Animation timeline (seconds)
const T_WALK = 3.4;
const T_SLIP = 0.9;
const T_LIE = 3.0;
const T_RESET = 0.6;
const T_TOTAL = T_WALK + T_SLIP + T_LIE + T_RESET;

export function SceneCanvas({
  playing,
  scene,
  variant = "comparison",
  height = 540,
  caption,
  highlightSide = null
}: SceneProps) {
  return (
    <div
      className="relative isolate overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-b from-[#eef2f8] via-[#dde4ee] to-[#bfcadb]"
      style={{ height }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [4.8, 2.7, 5.2], fov: 38, near: 0.1, far: 80 }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#eef2f8"]} />
          <fog attach="fog" args={["#eef2f8", 16, 28]} />

          <ambientLight intensity={0.7} />
          <directionalLight
            castShadow
            intensity={1.55}
            position={[5, 8, 4]}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-4}
          />
          <directionalLight intensity={0.35} position={[-6, 3, -3]} color="#cfd9ff" />
          <Environment preset="apartment" />

          <Lobby />
          <Puddle />
          <Officer />
          <Victim playing={playing} />

          <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={18} blur={2.6} far={2.6} />

          <OrbitControls
            enablePan={false}
            minDistance={4.6}
            maxDistance={10}
            minPolarAngle={0.85}
            maxPolarAngle={1.4}
            target={[0.2, 1, ACTION_Z]}
          />
        </Suspense>
      </Canvas>

      {variant === "comparison" && <ReportOverlay scene={scene} highlight={highlightSide} />}

      {caption && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/95 px-4 py-1.5 text-[12px] font-medium text-neutral-700 shadow-soft">
          {caption}
        </div>
      )}

      <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500 shadow-sm">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Drag to rotate · scroll to zoom
      </div>
    </div>
  );
}

function Lobby() {
  return (
    <group>
      <MarbleFloor />
      <FrontDesk />
      <TimePlaque />
    </group>
  );
}

function MarbleFloor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color="#e8dfd0" roughness={0.32} metalness={0.12} />
      </mesh>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh
          key={`v-${i}`}
          position={[-7.2 + i * 1.8, 0.003, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.014, 14]} />
          <meshBasicMaterial color="#c5b8a3" transparent opacity={0.45} />
        </mesh>
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh
          key={`h-${i}`}
          position={[0, 0.004, -5.4 + i * 1.8]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        >
          <planeGeometry args={[0.014, 20]} />
          <meshBasicMaterial color="#c5b8a3" transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function FrontDesk() {
  return (
    <group position={[0, 0, -3.6]}>
      <RoundedBox args={[7.2, 1.2, 0.7]} radius={0.06} smoothness={3} position={[0, 0.6, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#d7c6ad" roughness={0.45} />
      </RoundedBox>
      <RoundedBox args={[7.5, 0.18, 0.82]} radius={0.04} smoothness={3} position={[0, 1.28, 0]} castShadow>
        <meshStandardMaterial color="#1f2125" roughness={0.3} />
      </RoundedBox>
      <Text position={[0, 1.55, 0.42]} fontSize={0.18} color="#f8fafc" letterSpacing={0.18}>
        FRONT DESK
      </Text>
      {/* Lamp */}
      <group position={[-2.2, 1.36, 0.08]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <coneGeometry args={[0.18, 0.22, 24, 1, true]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fde68a" emissiveIntensity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* Plant */}
      <group position={[-3.4, 1.36, 0.08]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.22, 0.32, 16]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial color="#15803d" roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

function TimePlaque() {
  return (
    <group position={[-5.6, 2.7, -3.78]}>
      <RoundedBox args={[1.1, 0.42, 0.05]} radius={0.04} smoothness={3}>
        <meshStandardMaterial color="#0a0a0a" />
      </RoundedBox>
      <Text position={[0, 0, 0.04]} fontSize={0.22} color="#f8fafc" letterSpacing={0.04}>
        14:30
      </Text>
    </group>
  );
}

function Puddle() {
  const surfaceRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ripple1Ref = useRef<THREE.Mesh>(null);
  const ripple2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (surfaceRef.current) {
      const mat = surfaceRef.current.material as THREE.MeshPhysicalMaterial;
      mat.opacity = 0.62 + Math.sin(t * 1.4) * 0.05;
    }
    [ripple1Ref, ripple2Ref].forEach((ref, i) => {
      if (!ref.current) return;
      const phase = (t * 0.5 + i * 0.5) % 1;
      const scale = 0.4 + phase * 1.1;
      ref.current.scale.set(scale, scale, 1);
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - phase) * 0.35;
    });
    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.5 + Math.sin(t * 1.8) * 0.08;
    }
  });

  return (
    <group position={[PUDDLE_X, 0.012, PUDDLE_Z]}>
      <mesh ref={surfaceRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.95, 64]} />
        <meshPhysicalMaterial
          color="#7e9cb8"
          transparent
          opacity={0.65}
          roughness={0.05}
          metalness={0.1}
          transmission={0.7}
          thickness={0.4}
          ior={1.33}
          reflectivity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.85, 0.98, 64]} />
        <meshBasicMaterial color="#5b7794" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ripple1Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <ringGeometry args={[0.5, 0.55, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ripple2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0035, 0]}>
        <ringGeometry args={[0.5, 0.55, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <Text
        position={[0, 0.06, 1.32]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.15}
        color="#7f1d1d"
        anchorX="center"
      >
        Wet area · no caution sign
      </Text>
    </group>
  );
}

// ---- Characters (using user-provided GLB models) -------------------------------

function Officer() {
  // Stationary observer on the left, slightly turned toward the action.
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 1.3) * 0.005; // soft breathing
  });
  return (
    <group ref={ref} position={[-2.4, 0, ACTION_Z]} rotation={[0, 0.95, 0]}>
      <CharacterModel kind="officer" />
    </group>
  );
}

function Victim({ playing }: { playing: boolean }) {
  // GLB walks toward the puddle, then tilts back during the slip and lies.
  // The static GLB pose (arms slightly out) actually reads well during the slip
  // because real slips include arms thrown out for balance.
  const ref = useRef<THREE.Group>(null);
  const playStartedAt = useRef(0);
  const wasPlaying = useRef(false);
  const startX = 2.8; // close enough to always be in frame next to the puddle
  const slipTargetX = PUDDLE_X;
  const finalRestX = PUDDLE_X - 0.7;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const elapsed = clock.getElapsedTime();

    if (playing && !wasPlaying.current) {
      playStartedAt.current = elapsed;
    }
    wasPlaying.current = playing;

    const t = playing ? (elapsed - playStartedAt.current) % T_TOTAL : 0;

    let x = startX;
    let y = 0;
    let bodyTilt = 0;
    let bob = 0;
    const facing = -1.55;

    if (!playing) {
      x = startX;
    } else if (t < T_WALK) {
      const p = t / T_WALK;
      x = THREE.MathUtils.lerp(startX, slipTargetX, easeInOutSine(p));
      // Bigger bounce while walking — visible without leg bones.
      bob = Math.abs(Math.sin(t * 7)) * 0.06;
    } else if (t < T_WALK + T_SLIP) {
      const p = (t - T_WALK) / T_SLIP;
      const ease = p * p;
      x = THREE.MathUtils.lerp(slipTargetX, finalRestX, ease);
      bodyTilt = -ease * 1.4;
      y = ease * 0.05;
    } else if (t < T_WALK + T_SLIP + T_LIE) {
      x = finalRestX;
      bodyTilt = -1.4;
      y = 0;
      const sub = (t - T_WALK - T_SLIP) % 0.8;
      bob = Math.sin(sub * 8) * 0.005;
    } else {
      const p = (t - T_WALK - T_SLIP - T_LIE) / T_RESET;
      const ease = easeInOutSine(p);
      x = THREE.MathUtils.lerp(finalRestX, startX, ease);
      bodyTilt = THREE.MathUtils.lerp(-1.4, 0, Math.min(1, p * 2));
    }

    ref.current.position.set(x, y + bob, ACTION_Z);
    ref.current.rotation.set(bodyTilt, facing, 0);
  });

  return (
    <group ref={ref} position={[startX, 0, ACTION_Z]} rotation={[0, -1.55, 0]}>
      <CharacterModel kind="citizen" />
    </group>
  );
}

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function CharacterModel({ kind }: { kind: "officer" | "citizen" }) {
  const url = kind === "officer" ? "/models/officer.glb" : "/models/citizen.glb";
  const gltf = useLoader(GLTFLoader, url);
  const cloned = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    cloned.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = false;
    });

    const initialBox = new THREE.Box3().setFromObject(cloned);
    const initialSize = initialBox.getSize(new THREE.Vector3());
    const targetHeight = 1.85;
    const scale = initialSize.y > 0 ? targetHeight / initialSize.y : 1;
    cloned.scale.setScalar(scale);

    cloned.updateMatrixWorld(true);
    const scaledBox = new THREE.Box3().setFromObject(cloned);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    cloned.position.x -= scaledCenter.x;
    cloned.position.z -= scaledCenter.z;
    cloned.position.y -= scaledBox.min.y; // sit on the ground
  }, [cloned]);

  return <primitive object={cloned} />;
}

function ReportOverlay({
  scene,
  highlight
}: {
  scene: CorrectionSceneData;
  highlight: "correct" | "wrong" | null;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex justify-between gap-3">
      <OverlayCard
        side="correct"
        accent="#15803d"
        label={scene.correctChoice.label}
        text={scene.correctChoice.text}
        tags={scene.correctChoice.tags}
        highlight={highlight === "correct"}
      />
      <OverlayCard
        side="wrong"
        accent="#b91c1c"
        label={scene.wrongChoice.label}
        text={scene.wrongChoice.text}
        tags={scene.wrongChoice.tags}
        highlight={highlight === "wrong"}
      />
    </div>
  );
}

function OverlayCard({
  side,
  accent,
  label,
  text,
  tags,
  highlight
}: {
  side: "correct" | "wrong";
  accent: string;
  label: string;
  text: string;
  tags: string[];
  highlight: boolean;
}) {
  return (
    <div
      className="relative w-[44%] max-w-[260px] rounded-xl bg-white/98 px-3.5 py-3 ring-1 transition"
      style={{
        transform: side === "correct" ? "rotate(-1deg)" : "rotate(1deg)",
        boxShadow: highlight
          ? `0 0 0 2px ${accent}, 0 14px 40px -16px rgba(15,23,42,0.30)`
          : "0 14px 40px -16px rgba(15,23,42,0.20)"
      }}
    >
      <div className="flex items-center gap-1.5">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: accent }}
        >
          {label}
        </span>
      </div>
      <p className="mt-1.5 text-[12.5px] font-medium leading-[1.45] text-neutral-800">“{text}”</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-black/[0.04] px-1.5 py-[1px] text-[9.5px] font-medium text-neutral-600"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
