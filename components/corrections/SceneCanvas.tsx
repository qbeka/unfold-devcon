"use client";

import { OrbitControls, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { createElement, useRef } from "react";
import type { Group } from "three";
import type { CorrectionSceneData } from "@/lib/types";

export function SceneCanvas({ playing, scene }: { playing: boolean; scene: CorrectionSceneData }) {
  return (
    <div className="h-[420px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-950">
      <Canvas camera={{ position: [0, 2.1, 7.4], fov: 42 }}>
        {three("color", { attach: "background", args: ["#0f172a"] })}
        {three("ambientLight", { intensity: 0.85 })}
        {three("directionalLight", { intensity: 1.4, position: [2, 5, 4] })}
        <OutcomeScene correct playing={playing} position={[-2.85, 0, 0]} text={scene.correctChoice.text} />
        <OutcomeScene playing={playing} position={[2.85, 0, 0]} text={scene.wrongChoice.text} />
        <Divider />
        <SceneTitle position={[-2.85, 1.95, 0]} title="Correct outcome" tone="#dcfce7" />
        <SceneTitle position={[2.85, 1.95, 0]} title="Wrong outcome" tone="#fee2e2" />
        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={1.55} minPolarAngle={1.05} />
      </Canvas>
    </div>
  );
}

function OutcomeScene({
  correct = false,
  playing,
  position,
  text
}: {
  correct?: boolean;
  playing: boolean;
  position: [number, number, number];
  text: string;
}) {
  const officer = useRef<Group>(null);
  const subject = useRef<Group>(null);
  const report = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = playing ? clock.getElapsedTime() : 0;

    if (officer.current) {
      officer.current.position.x = correct ? -0.9 + Math.min(0.55, t * 0.18) : -0.8;
      officer.current.rotation.y = correct ? -0.15 : 0.15;
    }

    if (subject.current) {
      subject.current.position.x = correct ? 0.65 : 0.75 + Math.sin(t * 5) * 0.03;
      subject.current.rotation.z = correct ? 0 : Math.sin(t * 4) * 0.06;
    }

    if (report.current) {
      report.current.position.y = -0.02 + (playing ? Math.sin(t * 2) * 0.04 : 0);
    }
  });

  return three(
    "group",
    { position },
    <Floor key="floor" correct={correct} />,
    three(
      "group",
      { ref: officer, position: [-0.9, -0.2, 0] },
      <Person key="officer" uniform correct={correct} />,
      <SpeechBubble key="speech" correct={correct} text={correct ? "Facts only. Include the time and source." : "That wording is opinion-based."} />
    ),
    three("group", { ref: subject, position: [0.75, -0.2, 0] }, <Person key="subject" correct={correct} />),
    three("group", { ref: report, position: [0, -1.1, 0.2] }, <ReportCard key="report" correct={correct} text={text} />)
  );
}

function Floor({ correct }: { correct: boolean }) {
  return three(
    "mesh",
    { position: [0, -1.35, 0], rotation: [-Math.PI / 2, 0, 0] },
    three("planeGeometry", { args: [4.8, 3.2] }),
    three("meshStandardMaterial", { color: correct ? "#13291f" : "#2d1414", roughness: 0.8 })
  );
}

function Person({ correct, uniform = false }: { correct: boolean; uniform?: boolean }) {
  const bodyColor = uniform ? "#1e3a8a" : correct ? "#64748b" : "#92400e";

  return three(
    "group",
    {},
    three(
      "mesh",
      { position: [0, 0.45, 0] },
      three("capsuleGeometry", { args: [0.22, 0.72, 8, 16] }),
      three("meshStandardMaterial", { color: bodyColor, roughness: 0.55 })
    ),
    three(
      "mesh",
      { position: [0, 1.05, 0] },
      three("sphereGeometry", { args: [0.2, 24, 24] }),
      three("meshStandardMaterial", { color: "#f3c7a6", roughness: 0.5 })
    ),
    uniform
      ? three(
          "mesh",
          { position: [0, 1.25, 0] },
          three("boxGeometry", { args: [0.48, 0.08, 0.38] }),
          three("meshStandardMaterial", { color: "#0f172a" })
        )
      : null,
    !correct && !uniform
      ? createElement(
          Text,
          {
            anchorX: "center",
            color: "#fecaca",
            fontSize: 0.17,
            position: [0, 1.42, 0]
          },
          "?"
        )
      : null
  );
}

function SpeechBubble({ correct, text }: { correct: boolean; text: string }) {
  return three(
    "group",
    { position: [0.45, 1.55, 0] },
    three(
      "mesh",
      {},
      three("boxGeometry", { args: [1.75, 0.48, 0.04] }),
      three("meshStandardMaterial", { color: correct ? "#f8fafc" : "#fee2e2", roughness: 0.6 })
    ),
    createElement(
      Text,
      {
        anchorX: "center",
        anchorY: "middle",
        color: "#0f172a",
        fontSize: 0.09,
        lineHeight: 1.15,
        maxWidth: 1.45,
        position: [0, 0, 0.04]
      },
      text
    )
  );
}

function ReportCard({ correct, text }: { correct: boolean; text: string }) {
  return three(
    "group",
    {},
    three(
      "mesh",
      {},
      three("boxGeometry", { args: [2.2, 0.72, 0.08] }),
      three("meshStandardMaterial", { color: correct ? "#dcfce7" : "#fee2e2", roughness: 0.7 })
    ),
    createElement(
      Text,
      {
        anchorX: "center",
        anchorY: "middle",
        color: "#0f172a",
        fontSize: 0.105,
        lineHeight: 1.18,
        maxWidth: 1.85,
        position: [0, 0, 0.08]
      },
      text
    )
  );
}

function SceneTitle({ position, title, tone }: { position: [number, number, number]; title: string; tone: string }) {
  return createElement(
    Text,
    {
      anchorX: "center",
      color: tone,
      fontSize: 0.2,
      fontWeight: 700,
      position
    },
    title
  );
}

function Divider() {
  return three(
    "mesh",
    { position: [0, 0.1, 0], scale: [0.02, 3.2, 0.02] },
    three("boxGeometry", { args: [1, 1, 1] }),
    three("meshStandardMaterial", { color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 0.3 })
  );
}

function three(type: string, props: Record<string, unknown>, ...children: React.ReactNode[]) {
  return createElement(type as keyof JSX.IntrinsicElements, props, ...children);
}
