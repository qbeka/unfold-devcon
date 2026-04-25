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
      sourceRange: "Pages 9–25",
      activities: ["Industry role review", "Professional conduct discussion"],
      concepts: ["professionalism", "licensing", "public safety"],
      pageStart: 9,
      pageEnd: 25
    },
    {
      id: "module-two",
      title: "Module Two: The Canadian Legal System",
      description: "Legal foundations that affect security work, authority, and limits.",
      sourceRange: "Pages 26–50",
      activities: ["Authority scenario review", "Legal term practice"],
      concepts: ["criminal law", "civil law", "authority limits"],
      pageStart: 26,
      pageEnd: 50
    },
    {
      id: "module-three",
      title: "Module Three: Basic Security Procedures",
      description: "Observation, patrol, access control, and reporting duties.",
      sourceRange: "Pages 51–87",
      activities: ["Patrol checklist", "Access control decisions"],
      concepts: ["patrol", "access control", "observation"],
      pageStart: 51,
      pageEnd: 87
    },
    {
      id: "module-four",
      title: "Module Four: Communication for Security Professionals",
      description: "Professional communication, radio procedure, de-escalation, and clarity.",
      sourceRange: "Pages 88–106",
      activities: ["Radio message rewrite", "De-escalation discussion"],
      concepts: ["radio protocol", "de-escalation", "clarity"],
      pageStart: 88,
      pageEnd: 106
    },
    {
      id: "module-five",
      title: "Module Five: Documentation and Evidence",
      description: "Notebook use, report writing, objective facts, source details, and evidence handling.",
      sourceRange: "Pages 107–129",
      activities: ["Incident report comparison", "Objective sentence practice"],
      concepts: ["incident reports", "objective facts", "evidence", "chronology"],
      pageStart: 107,
      pageEnd: 129
    },
    {
      id: "module-six",
      title: "Module Six: Emergency Response Procedures",
      description: "Emergency priorities, response procedures, and communication during incidents.",
      sourceRange: "Pages 130–147",
      activities: ["Emergency response ordering", "Scene priority review"],
      concepts: ["emergency response", "scene safety", "communication"],
      pageStart: 130,
      pageEnd: 147
    },
    {
      id: "module-seven",
      title: "Module Seven: Health and Safety",
      description: "Workplace safety, hazards, personal safety, and duty of care.",
      sourceRange: "Pages 148–180",
      activities: ["Hazard identification", "Safety decision practice"],
      concepts: ["hazards", "personal safety", "duty of care"],
      pageStart: 148,
      pageEnd: 180
    },
    {
      id: "module-eight",
      title: "Module Eight: Final Review",
      description: "Exam preparation, scenario review, and weak-area practice.",
      sourceRange: "Pages 181–200",
      activities: ["Focused exam", "Weak-area review"],
      concepts: ["exam readiness", "scenario judgment", "review"],
      pageStart: 181,
      pageEnd: 200
    }
  ]
};
