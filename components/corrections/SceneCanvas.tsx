"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { ContactShadows, Environment, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { CorrectionSceneData } from "@/lib/types";

useGLTF.preload("/models/officer.glb");
useGLTF.preload("/models/citizen.glb");

export function SceneCanvas({
  playing,
  scene,
  height = 480,
  caption
}: {
  playing: boolean;
  scene: CorrectionSceneData;
  height?: number;
  caption?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-gradient-to-b from-[#cfe2f3] via-[#a7c4e1] to-[#7d9fc6]"
      style={{ height }}
    >
      <Canvas shadows camera={{ position: [0, 1.6, 7.4], fov: 36 }}>
        <Suspense fallback={null}>
          <SceneLighting />
          <Environment preset="city" />
          <Diorama
            position={[-2.6, 0, 0]}
            tone="correct"
            playing={playing}
            text={scene.correctChoice.text}
            label={scene.correctChoice.label}
          />
          <Diorama
            position={[2.6, 0, 0]}
            tone="wrong"
            playing={playing}
            text={scene.wrongChoice.text}
            label={scene.wrongChoice.label}
          />
          <Divider />
          <ContactShadows
            position={[0, -0.65, 0]}
            opacity={0.45}
            scale={11}
            blur={2.4}
            far={2}
          />
        </Suspense>
      </Canvas>

      {caption && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-[0_4px_18px_rgba(15,23,42,0.18)]">
          {caption}
        </div>
      )}
    </div>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        intensity={1.4}
        position={[5, 7, 5]}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight intensity={0.4} position={[-6, 4, -3]} />
    </>
  );
}

function Diorama({
  position,
  tone,
  playing,
  text,
  label
}: {
  position: [number, number, number];
  tone: "correct" | "wrong";
  playing: boolean;
  text: string;
  label: string;
}) {
  const isCorrect = tone === "correct";
  const groundTint = isCorrect ? "#d8e7d2" : "#e7d4cc";
  const accent = isCorrect ? "#15803d" : "#b91c1c";

  return (
    <group position={position}>
      <Stage tint={groundTint} />
      <CharacterStage playing={playing} tone={tone} />
      <TimedCallout playing={playing} tone={tone} text={text} label={label} accent={accent} />
    </group>
  );
}

function Stage({ tint }: { tint: string }) {
  return (
    <group>
      {/* Ground plate */}
      <mesh receiveShadow position={[0, -0.65, 0]}>
        <cylinderGeometry args={[2.1, 2.1, 0.18, 48]} />
        <meshStandardMaterial color={tint} roughness={0.85} />
      </mesh>
      {/* Sidewalk */}
      <mesh position={[0, -0.55, 0.55]}>
        <boxGeometry args={[3.6, 0.05, 1.0]} />
        <meshStandardMaterial color="#cccccc" roughness={0.95} />
      </mesh>
      {/* Curb */}
      <mesh position={[0, -0.49, 1.1]}>
        <boxGeometry args={[3.6, 0.06, 0.12]} />
        <meshStandardMaterial color="#9ba3ad" roughness={0.9} />
      </mesh>
      {/* Storefront wall */}
      <mesh position={[0, 0.95, -0.95]} castShadow>
        <boxGeometry args={[3.6, 2.4, 0.18]} />
        <meshStandardMaterial color="#f5efe5" roughness={0.7} />
      </mesh>
      {/* Window */}
      <mesh position={[0, 1.05, -0.85]}>
        <boxGeometry args={[2.4, 1.1, 0.06]} />
        <meshStandardMaterial color="#9bbfd6" emissive="#1d3a52" emissiveIntensity={0.18} roughness={0.4} metalness={0.4} />
      </mesh>
      {/* Door */}
      <mesh position={[1.4, 0.4, -0.85]}>
        <boxGeometry args={[0.5, 1.1, 0.06]} />
        <meshStandardMaterial color="#5b3a29" roughness={0.6} />
      </mesh>
      {/* Streetlight */}
      <mesh position={[-1.5, 0.4, 0.95]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 12]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      <mesh position={[-1.5, 1.55, 0.95]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#fff8d6" emissive="#ffe58a" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function CharacterStage({ playing, tone }: { playing: boolean; tone: "correct" | "wrong" }) {
  const officerRef = useRef<THREE.Group>(null);
  const citizenRef = useRef<THREE.Group>(null);
  const baseY = -0.55;

  useFrame(({ clock }) => {
    const t = playing ? clock.getElapsedTime() : 0;
    if (officerRef.current) {
      officerRef.current.position.y = baseY + (playing ? Math.sin(t * 1.6) * 0.015 : 0);
      officerRef.current.rotation.y = tone === "correct" ? -0.22 : 0.22;
    }
    if (citizenRef.current) {
      citizenRef.current.position.y = baseY + (playing ? Math.sin(t * 1.6 + 0.6) * 0.015 : 0);
      citizenRef.current.rotation.y =
        tone === "correct" ? 0.22 : 0.22 + (playing ? Math.sin(t * 4.2) * 0.05 : 0);
    }
  });

  return (
    <>
      <group ref={officerRef} position={[-0.65, baseY, 0.1]}>
        <CharacterModel kind="officer" />
      </group>
      <group ref={citizenRef} position={[0.7, baseY, 0.05]}>
        <CharacterModel kind="citizen" />
      </group>
    </>
  );
}

function CharacterModel({ kind }: { kind: "officer" | "citizen" }) {
  const url = kind === "officer" ? "/models/officer.glb" : "/models/citizen.glb";
  const gltf = useLoader(GLTFLoader, url);
  const cloned = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    cloned.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = false;
      }
    });

    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const targetHeight = 1.55;
    const scale = size.y > 0 ? targetHeight / size.y : 1;
    cloned.scale.setScalar(scale);

    // Recompute bounds after scaling so we sit the model on the ground.
    cloned.updateMatrixWorld(true);
    const scaledBox = new THREE.Box3().setFromObject(cloned);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    cloned.position.x -= scaledCenter.x;
    cloned.position.z -= scaledCenter.z;
    cloned.position.y -= scaledBox.min.y;
  }, [cloned]);

  return <primitive object={cloned} />;
}

function TimedCallout({
  playing,
  tone,
  text,
  label,
  accent
}: {
  playing: boolean;
  tone: "correct" | "wrong";
  text: string;
  label: string;
  accent: string;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = playing ? clock.getElapsedTime() : 0;
    ref.current.position.y = 1.55 + (playing ? Math.sin(t * 1.4) * 0.02 : 0);
  });

  return (
    <group ref={ref} position={[0, 1.55, 0.6]}>
      <Html
        transform
        occlude={false}
        distanceFactor={3.6}
        position={[0, 0, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            width: 220,
            background: "white",
            borderRadius: 14,
            padding: "10px 14px",
            boxShadow: "0 10px 30px rgba(15,23,42,0.18)",
            border: "1px solid rgba(15,23,42,0.06)",
            fontFamily: "ui-sans-serif, system-ui, -apple-system",
            color: "#0f172a"
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accent,
              fontWeight: 600
            }}
          >
            {label}
          </div>
          <div style={{ marginTop: 6, fontSize: 11, lineHeight: 1.4, fontWeight: 500 }}>{text}</div>
        </div>
      </Html>
    </group>
  );
}

function Divider() {
  return (
    <mesh position={[0, 0.4, 0]}>
      <boxGeometry args={[0.02, 3.2, 0.02]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
    </mesh>
  );
}
