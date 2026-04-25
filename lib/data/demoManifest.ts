import type { DocumentManifest } from "@/lib/types";

export const demoManifest: DocumentManifest = {
  documentId: "alberta-basic-security-training",
  title: "Alberta Basic Security Training: Participant Manual",
  fileName: "abst-particpants-manual-oct-2014-2.pdf",
  source: "deterministic",
  summary:
    "Recognized Alberta Basic Security Training modules and activities. The demo path is tuned for Module Five: Documentation and Evidence.",
  processedAt: new Date("2026-04-24T00:00:00.000Z").toISOString(),
  modules: [
    {
      id: "module-one",
      title: "Module One: Introduction to the Security Industry",
      description: "Role of security professionals, licensing context, ethics, and public expectations.",
      sourceRange: "Manual module one",
      activities: ["Industry role review", "Professional conduct discussion"],
      concepts: ["professionalism", "licensing", "public safety"]
    },
    {
      id: "module-two",
      title: "Module Two: The Canadian Legal System",
      description: "Legal foundations that affect security work, authority, and limits.",
      sourceRange: "Manual module two",
      activities: ["Authority scenario review", "Legal term practice"],
      concepts: ["criminal law", "civil law", "authority limits"]
    },
    {
      id: "module-three",
      title: "Module Three: Basic Security Procedures",
      description: "Observation, patrol, access control, and reporting duties.",
      sourceRange: "Manual module three",
      activities: ["Patrol checklist", "Access control decisions"],
      concepts: ["patrol", "access control", "observation"]
    },
    {
      id: "module-four",
      title: "Module Four: Communication",
      description: "Professional communication, radio procedure, de-escalation, and clarity.",
      sourceRange: "Manual module four",
      activities: ["Radio message rewrite", "De-escalation discussion"],
      concepts: ["radio protocol", "de-escalation", "clarity"]
    },
    {
      id: "module-five",
      title: "Module Five: Documentation and Evidence",
      description: "Notebook use, report writing, objective facts, source details, and evidence handling.",
      sourceRange: "Manual module five",
      activities: ["Incident report comparison", "Objective sentence practice"],
      concepts: ["incident reports", "objective facts", "evidence", "chronology"]
    },
    {
      id: "module-six",
      title: "Module Six: Emergency Response",
      description: "Emergency priorities, response procedures, and communication during incidents.",
      sourceRange: "Manual module six",
      activities: ["Emergency response ordering", "Scene priority review"],
      concepts: ["emergency response", "scene safety", "communication"]
    },
    {
      id: "module-seven",
      title: "Module Seven: Health and Safety",
      description: "Workplace safety, hazards, personal safety, and duty of care.",
      sourceRange: "Manual module seven",
      activities: ["Hazard identification", "Safety decision practice"],
      concepts: ["hazards", "personal safety", "duty of care"]
    },
    {
      id: "module-eight",
      title: "Module Eight: Final Review",
      description: "Exam preparation, scenario review, and weak-area practice.",
      sourceRange: "Manual review material",
      activities: ["Focused exam", "Weak-area review"],
      concepts: ["exam readiness", "scenario judgment", "review"]
    }
  ]
};
