import type { TrainingDocument } from "@/lib/types";

export const demoDocument: TrainingDocument = {
  id: "alberta-basic-security-training",
  title: "Alberta Basic Security Training",
  description:
    "Participant Manual demo content focused on Module Five: Documentation and Evidence.",
  modules: [
    {
      id: "module-five",
      title: "Module Five: Documentation and Evidence",
      sections: [
        {
          id: "report-writing-guidelines",
          moduleId: "module-five",
          title: "Report Writing Guidelines",
          type: "exam_concept",
          sourceReference: "Module Five: Documentation and Evidence, Report Writing Guidelines.",
          originalText:
            "Reports should be accurate reflections of what took place. They should be free from personal opinion and irrelevant detail. A person reading the report should clearly understand what happened. Reports should be written clearly and neatly. Good reports include the date, location, source of information, and what was seen, heard, smelled, or reported. Use past tense. Use short sentences. Organize events in the order they occurred. Refer to your notebook to include relevant details.",
          simplifiedText:
            "A security report should explain what happened using facts. Do not include guesses, opinions, insults, or unrelated details. Write clearly. Include the date, time, location, people involved, and what you saw, heard, or were told. Put events in the order they happened. Use your notebook to check details.",
          translatedText:
            "Un informe de seguridad debe explicar lo que ocurrió usando hechos. No incluya suposiciones, opiniones, insultos ni detalles que no sean importantes. Escriba con claridad. Incluya la fecha, la hora, el lugar, las personas involucradas y lo que vio, escuchó o le dijeron. Escriba los eventos en el orden en que ocurrieron. Use su libreta para verificar los detalles.",
          keyTerms: [
            "objective",
            "accurate",
            "relevant detail",
            "personal opinion",
            "incident report",
            "past tense",
            "source of information"
          ],
          examConcepts: [
            "objective report writing",
            "removing personal opinion",
            "using relevant details",
            "organizing events chronologically",
            "including who, what, where, when, why, and how"
          ]
        }
      ]
    }
  ]
};

export const demoModule = demoDocument.modules[0];
export const demoSection = demoModule.sections[0];
