// Curated Module Five content based on the Alberta Basic Security Training
// Participant Manual, pages 107-129 (manual pages 1-23 of Module Five).
// The live extraction script at scripts/extract-module-five.mjs can refresh
// the underlying raw text. This file is hand-cleaned for demo readability and
// includes deterministic German translations.

export type LanguageCode = "en" | "de" | "es" | "fr" | "ar" | "zh" | "uk" | "tl";

export type ContentBlock =
  | {
      kind: "paragraph";
      page: number;
      text: string;
      translations?: Partial<Record<LanguageCode, string>>;
    }
  | {
      kind: "list";
      page: number;
      style: "bullet" | "ordered";
      items: string[];
      translations?: Partial<Record<LanguageCode, string[]>>;
    }
  | {
      kind: "callout";
      page: number;
      label: string;
      text: string;
      translations?: Partial<Record<LanguageCode, { label: string; text: string }>>;
    }
  | {
      kind: "report";
      page: number;
      title: string;
      lines: string[];
      translations?: Partial<Record<LanguageCode, { title: string; lines: string[] }>>;
    };

export type ModuleSection = {
  id: string;
  page: number;
  heading: string;
  subheading?: string;
  blocks: ContentBlock[];
  translations?: Partial<Record<LanguageCode, { heading: string; subheading?: string }>>;
};

export type ModuleContent = {
  id: string;
  title: string;
  pageRange: { start: number; end: number };
  sections: ModuleSection[];
  translations?: Partial<Record<LanguageCode, { title: string }>>;
};

export const moduleFiveContent: ModuleContent = {
  id: "module-five",
  title: "Module Five: Documentation and Evidence",
  pageRange: { start: 107, end: 129 },
  translations: {
    de: { title: "Modul Fünf: Dokumentation und Beweise" }
  },
  sections: [
    {
      id: "intro",
      page: 1,
      heading: "Introduction",
      translations: { de: { heading: "Einführung" } },
      blocks: [
        {
          kind: "paragraph",
          page: 1,
          text: "You should now be familiar with the role and responsibilities of a security professional and you have been introduced to a variety of situations which you can expect to encounter throughout your career. So far, you have learned how you will use both verbal and non-verbal communication, and you have been introduced to the skill of interviewing. In this module, you will learn how to document various types of interactions and incidents. Keeping a notebook which is both accurate and complete is a must for any security professional. Documenting and reporting are important ways in which you contribute to the success of investigations and ultimately, the success of your employer.",
          translations: {
            de: "Sie sollten nun mit der Rolle und den Verantwortlichkeiten eines Sicherheitsfachmanns vertraut sein und wurden in eine Vielzahl von Situationen eingeführt, die Sie im Laufe Ihrer Karriere erwarten können. Bisher haben Sie gelernt, wie Sie sowohl verbale als auch nonverbale Kommunikation einsetzen, und wurden in die Fähigkeit des Interviewens eingeführt. In diesem Modul lernen Sie, wie Sie verschiedene Arten von Interaktionen und Vorfällen dokumentieren. Ein Notizbuch zu führen, das sowohl genau als auch vollständig ist, ist für jeden Sicherheitsfachmann ein Muss. Dokumentation und Berichterstattung sind wichtige Wege, um zum Erfolg von Untersuchungen und letztlich zum Erfolg Ihres Arbeitgebers beizutragen."
          }
        },
        {
          kind: "paragraph",
          page: 1,
          text: "In addition to learning how to prepare various reports and documents, you will learn about your responsibilities when it comes to collecting and preserving evidence to be used during the investigative process.",
          translations: {
            de: "Zusätzlich zum Erlernen der Erstellung verschiedener Berichte und Dokumente lernen Sie Ihre Verantwortlichkeiten beim Sammeln und Erhalten von Beweisen kennen, die im Rahmen des Untersuchungsprozesses verwendet werden sollen."
          }
        }
      ]
    },
    {
      id: "learning-outcomes",
      page: 1,
      heading: "Learning Outcomes",
      subheading: "Upon completion of this module, you will be able to:",
      translations: {
        de: {
          heading: "Lernergebnisse",
          subheading: "Nach Abschluss dieses Moduls können Sie:"
        }
      },
      blocks: [
        {
          kind: "list",
          page: 1,
          style: "bullet",
          items: [
            "Describe the importance and legal implications of maintaining an accurate and complete notebook.",
            "Describe the correct use of a notebook.",
            "Maintain an accurate and complete notebook.",
            "Obtain and record an accurate and complete statement.",
            "Prepare accurate and complete written reports.",
            "Preserve and protect evidence and a potential crime scene.",
            "Prepare for the process of giving testimony in court."
          ],
          translations: {
            de: [
              "Die Bedeutung und rechtlichen Folgen eines genauen und vollständigen Notizbuchs beschreiben.",
              "Die korrekte Verwendung eines Notizbuchs beschreiben.",
              "Ein genaues und vollständiges Notizbuch führen.",
              "Eine genaue und vollständige Aussage einholen und aufzeichnen.",
              "Genaue und vollständige schriftliche Berichte erstellen.",
              "Beweise und einen möglichen Tatort sichern und schützen.",
              "Sich auf den Prozess der Zeugenaussage vor Gericht vorbereiten."
            ]
          }
        }
      ]
    },
    {
      id: "notebooks",
      page: 3,
      heading: "Notebooks",
      translations: { de: { heading: "Notizbücher" } },
      blocks: [
        {
          kind: "paragraph",
          page: 3,
          text: "As already stated in Module Three, every security professional must carry a notebook. Your notebook is one of the most important pieces of equipment that you will carry. It is a permanent, official record of your shift, the people you spoke with, and the events that took place.",
          translations: {
            de: "Wie bereits in Modul Drei erwähnt, muss jeder Sicherheitsfachmann ein Notizbuch mitführen. Ihr Notizbuch ist eines der wichtigsten Ausrüstungsgegenstände, die Sie tragen werden. Es ist eine dauerhafte, offizielle Aufzeichnung Ihrer Schicht, der Personen, mit denen Sie gesprochen haben, und der Ereignisse, die stattgefunden haben."
          }
        },
        {
          kind: "paragraph",
          page: 3,
          text: "A notebook should be small enough to carry in a uniform pocket but large enough that you can write clearly. Pages must be bound and numbered so that nothing can be added or removed later. Use blue or black ink so that entries are permanent.",
          translations: {
            de: "Ein Notizbuch sollte klein genug sein, um in eine Uniformtasche zu passen, aber groß genug, damit Sie klar schreiben können. Die Seiten müssen gebunden und nummeriert sein, damit später nichts hinzugefügt oder entfernt werden kann. Verwenden Sie blaue oder schwarze Tinte, damit die Einträge dauerhaft sind."
          }
        },
        {
          kind: "paragraph",
          page: 4,
          text: "Notebook entries should answer the questions Who, What, Where, When, Why, and How. Whenever you record an entry, ask yourself: Who was involved? What happened? Where did it occur? When did it occur? Why did it occur (if known)? How did it occur?",
          translations: {
            de: "Notizbucheinträge sollten die Fragen Wer, Was, Wo, Wann, Warum und Wie beantworten. Wenn Sie einen Eintrag aufzeichnen, fragen Sie sich: Wer war beteiligt? Was geschah? Wo geschah es? Wann geschah es? Warum geschah es (sofern bekannt)? Wie geschah es?"
          }
        },
        {
          kind: "callout",
          page: 4,
          label: "When?",
          text: "When did you hear about the incident? When did the incident occur? When did you arrive on scene? When did witnesses arrive or leave? Time is the backbone of every report.",
          translations: {
            de: {
              label: "Wann?",
              text: "Wann haben Sie von dem Vorfall erfahren? Wann ist der Vorfall passiert? Wann sind Sie am Tatort eingetroffen? Wann sind Zeugen gekommen oder gegangen? Zeit ist das Rückgrat jedes Berichts."
            }
          }
        },
        {
          kind: "list",
          page: 5,
          style: "bullet",
          items: [
            "Write entries in chronological order, in the order events actually happened.",
            "Do not skip lines, leave blank spaces, or tear out pages.",
            "If you make a mistake, draw a single line through it, write your initials beside it, and continue.",
            "Notebooks remain the property of your employer and may be used as evidence in court."
          ],
          translations: {
            de: [
              "Schreiben Sie Einträge in chronologischer Reihenfolge, in der Reihenfolge, in der die Ereignisse tatsächlich stattgefunden haben.",
              "Überspringen Sie keine Zeilen, lassen Sie keine leeren Stellen und reißen Sie keine Seiten heraus.",
              "Wenn Sie einen Fehler machen, ziehen Sie eine einzelne Linie hindurch, schreiben Sie Ihre Initialen daneben und fahren Sie fort.",
              "Notizbücher bleiben Eigentum Ihres Arbeitgebers und können vor Gericht als Beweismittel verwendet werden."
            ]
          }
        }
      ]
    },
    {
      id: "twenty-four-hour-clock",
      page: 6,
      heading: "The 24-Hour Clock",
      translations: { de: { heading: "Die 24-Stunden-Uhr" } },
      blocks: [
        {
          kind: "paragraph",
          page: 6,
          text: "The security industry uses the 24-hour clock so that there is no confusion between morning and evening. Midnight is 0000 and the last minute of the day is 2359. Any time after noon adds 12 to the standard hour: 1:30 PM becomes 1330 and 11:28 PM becomes 2328.",
          translations: {
            de: "Die Sicherheitsbranche verwendet die 24-Stunden-Uhr, damit es keine Verwechslungen zwischen Morgen und Abend gibt. Mitternacht ist 0000 und die letzte Minute des Tages ist 2359. Jede Zeit nach Mittag erhält 12 zu der Standardstunde hinzugefügt: 13:30 Uhr wird zu 1330 und 23:28 Uhr wird zu 2328."
          }
        },
        {
          kind: "list",
          page: 7,
          style: "bullet",
          items: [
            "1:30 PM becomes 1330.",
            "5:41 PM becomes 1741.",
            "2:14 AM becomes 0214.",
            "11:28 AM becomes 1128."
          ],
          translations: {
            de: [
              "13:30 Uhr wird zu 1330.",
              "17:41 Uhr wird zu 1741.",
              "02:14 Uhr wird zu 0214.",
              "11:28 Uhr wird zu 1128."
            ]
          }
        }
      ]
    },
    {
      id: "statements",
      page: 12,
      heading: "Statements",
      translations: { de: { heading: "Aussagen" } },
      blocks: [
        {
          kind: "paragraph",
          page: 12,
          text: "Statements are an individual's account of what took place. They may come from a victim, a witness, or a suspect. A good statement is recorded in the speaker's own words, includes who, what, where, when, why, and how, and is signed and dated by the person providing it.",
          translations: {
            de: "Aussagen sind die Schilderung einer Person, was geschehen ist. Sie können von einem Opfer, einem Zeugen oder einem Verdächtigen stammen. Eine gute Aussage wird in den eigenen Worten des Sprechers aufgezeichnet, enthält Wer, Was, Wo, Wann, Warum und Wie und wird von der Person, die sie abgibt, unterschrieben und datiert."
          }
        },
        {
          kind: "paragraph",
          page: 12,
          text: "Whenever possible, take notes during the conversation, then read your notes back to the person to confirm accuracy. Do not write opinions or interpretations. Record exactly what was said.",
          translations: {
            de: "Wenn möglich, machen Sie sich während des Gesprächs Notizen und lesen Sie der Person dann Ihre Notizen vor, um die Richtigkeit zu bestätigen. Schreiben Sie keine Meinungen oder Interpretationen. Halten Sie genau das fest, was gesagt wurde."
          }
        }
      ]
    },
    {
      id: "reports",
      page: 13,
      heading: "Reports",
      translations: { de: { heading: "Berichte" } },
      blocks: [
        {
          kind: "paragraph",
          page: 13,
          text: "Reports should be accurate reflections of what took place. They should be free from personal opinion and irrelevant detail. A person reading the report should clearly understand what happened. Reports should be written clearly and neatly. Good reports include the date, location, source of information, and what was seen, heard, smelled, or reported.",
          translations: {
            de: "Berichte sollten eine genaue Wiedergabe dessen sein, was geschehen ist. Sie sollten frei von persönlichen Meinungen und irrelevanten Details sein. Eine Person, die den Bericht liest, sollte klar verstehen, was passiert ist. Berichte sollten klar und ordentlich verfasst sein. Gute Berichte enthalten das Datum, den Ort, die Informationsquelle und das, was gesehen, gehört, gerochen oder gemeldet wurde."
          }
        },
        {
          kind: "paragraph",
          page: 13,
          text: "Use past tense. Use short sentences. Organize events in the order they occurred. Refer to your notebook to include relevant details.",
          translations: {
            de: "Verwenden Sie die Vergangenheitsform. Verwenden Sie kurze Sätze. Ordnen Sie die Ereignisse in der Reihenfolge, in der sie aufgetreten sind. Greifen Sie auf Ihr Notizbuch zurück, um relevante Details aufzunehmen."
          }
        },
        {
          kind: "report",
          page: 14,
          title: "Sample Report #1 — Prairie Mall",
          lines: [
            "Date: 14 February 2014",
            "Time: 1116",
            "Location: Prairie Mall, west entrance",
            "Reporting officer: Hassan, J.",
            "Mrs. Meredith reported her purse was stolen at 1116. The purse was a brown leather handbag last seen on the bench beside her.",
            "Police were notified at 1118 and arrived on scene at 1151."
          ],
          translations: {
            de: {
              title: "Beispielbericht Nr. 1 — Prairie Mall",
              lines: [
                "Datum: 14. Februar 2014",
                "Zeit: 1116",
                "Ort: Prairie Mall, Westeingang",
                "Diensthabender Beamter: Hassan, J.",
                "Frau Meredith meldete um 1116, dass ihre Handtasche gestohlen wurde. Die Handtasche war eine braune Ledertasche, zuletzt gesehen auf der Bank neben ihr.",
                "Die Polizei wurde um 1118 benachrichtigt und traf um 1151 am Tatort ein."
              ]
            }
          }
        },
        {
          kind: "callout",
          page: 14,
          label: "Watch your wording",
          text: "Sentences such as ‘the victim looked kooky and might cry’ contain personal opinion and irrelevant detail. Replace them with objective facts: ‘Mrs. Meredith reported her purse was stolen at 1116.’",
          translations: {
            de: {
              label: "Achten Sie auf Ihre Wortwahl",
              text: "Sätze wie ‚das Opfer sah seltsam aus und könnte gleich weinen‘ enthalten persönliche Meinungen und irrelevante Details. Ersetzen Sie sie durch objektive Fakten: ‚Frau Meredith meldete um 1116, dass ihre Handtasche gestohlen wurde.‘"
            }
          }
        }
      ]
    },
    {
      id: "evidence",
      page: 19,
      heading: "Evidence",
      translations: { de: { heading: "Beweise" } },
      blocks: [
        {
          kind: "paragraph",
          page: 19,
          text: "Evidence is anything that helps prove or disprove a fact. As a security professional, you may be the first person to encounter evidence at the scene of an incident. Your job is to identify, protect, and report it. Do not move or touch evidence unless absolutely necessary, and only when the scene has been documented first.",
          translations: {
            de: "Beweise sind alles, was hilft, eine Tatsache zu beweisen oder zu widerlegen. Als Sicherheitsfachmann sind Sie möglicherweise die erste Person, die auf Beweise am Ort eines Vorfalls stößt. Ihre Aufgabe ist es, sie zu identifizieren, zu schützen und zu melden. Bewegen oder berühren Sie Beweise nur, wenn es absolut notwendig ist, und nur dann, wenn der Tatort zuvor dokumentiert wurde."
          }
        },
        {
          kind: "list",
          page: 20,
          style: "bullet",
          items: [
            "Direct evidence: a witness who saw what happened.",
            "Circumstantial evidence: facts that suggest something occurred.",
            "Physical evidence: objects, prints, fibers, video, photographs.",
            "Documentary evidence: notes, reports, signed statements."
          ],
          translations: {
            de: [
              "Direkter Beweis: ein Zeuge, der gesehen hat, was passiert ist.",
              "Indizienbeweis: Tatsachen, die auf einen Vorgang hindeuten.",
              "Sachbeweis: Gegenstände, Abdrücke, Fasern, Videos, Fotografien.",
              "Urkundenbeweis: Notizen, Berichte, unterzeichnete Aussagen."
            ]
          }
        }
      ]
    },
    {
      id: "preparing-for-court",
      page: 21,
      heading: "Preparing for Court",
      translations: { de: { heading: "Vorbereitung auf das Gericht" } },
      blocks: [
        {
          kind: "paragraph",
          page: 21,
          text: "If you are required to give testimony, dress professionally and arrive early. Bring your notebook and any reports you authored. Refer to your notes to refresh your memory, but answer questions directly and only describe what you personally observed. Speak clearly. If you do not know an answer, say so. Do not guess.",
          translations: {
            de: "Wenn Sie eine Zeugenaussage machen müssen, kleiden Sie sich professionell und kommen Sie früh an. Bringen Sie Ihr Notizbuch und alle von Ihnen verfassten Berichte mit. Greifen Sie auf Ihre Notizen zurück, um Ihr Gedächtnis aufzufrischen, beantworten Sie aber Fragen direkt und beschreiben Sie nur das, was Sie selbst beobachtet haben. Sprechen Sie deutlich. Wenn Sie eine Antwort nicht wissen, sagen Sie es. Raten Sie nicht."
          }
        }
      ]
    },
    {
      id: "conclusion",
      page: 23,
      heading: "Conclusion",
      translations: { de: { heading: "Schlussfolgerung" } },
      blocks: [
        {
          kind: "paragraph",
          page: 23,
          text: "Keeping an accurate notebook, writing objective reports, and protecting evidence are some of the most important skills you bring to the job. They protect your employer, support investigations, and protect you. The discipline of writing only what you saw, heard, or were told is what separates a professional report from a personal opinion.",
          translations: {
            de: "Ein genaues Notizbuch zu führen, objektive Berichte zu schreiben und Beweise zu schützen, gehören zu den wichtigsten Fähigkeiten, die Sie in den Beruf einbringen. Sie schützen Ihren Arbeitgeber, unterstützen Untersuchungen und schützen Sie selbst. Die Disziplin, nur das aufzuschreiben, was Sie gesehen, gehört oder mitgeteilt bekommen haben, ist das, was einen professionellen Bericht von einer persönlichen Meinung unterscheidet."
          }
        }
      ]
    }
  ]
};

export const supportedLanguages: { code: LanguageCode; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "zh", label: "Chinese", nativeLabel: "中文" },
  { code: "uk", label: "Ukrainian", nativeLabel: "Українська" },
  { code: "tl", label: "Tagalog", nativeLabel: "Tagalog" }
];

export function translateBlock<TBlock extends ContentBlock>(block: TBlock, lang: LanguageCode): TBlock {
  if (lang === "en") return block;
  const next: any = { ...block };
  switch (block.kind) {
    case "paragraph":
      if (block.translations?.[lang]) {
        next.text = block.translations[lang]!;
      }
      return next;
    case "list":
      if (block.translations?.[lang]) {
        next.items = block.translations[lang]!;
      }
      return next;
    case "callout":
      if (block.translations?.[lang]) {
        next.label = block.translations[lang]!.label;
        next.text = block.translations[lang]!.text;
      }
      return next;
    case "report":
      if (block.translations?.[lang]) {
        next.title = block.translations[lang]!.title;
        next.lines = block.translations[lang]!.lines;
      }
      return next;
  }
  return next;
}

export function translateSection(section: ModuleSection, lang: LanguageCode): ModuleSection {
  const headingTranslation = section.translations?.[lang];
  return {
    ...section,
    heading: headingTranslation?.heading ?? section.heading,
    subheading: headingTranslation?.subheading ?? section.subheading,
    blocks: section.blocks.map((block) => translateBlock(block, lang))
  };
}

export function translateModuleTitle(content: ModuleContent, lang: LanguageCode): string {
  return content.translations?.[lang]?.title ?? content.title;
}
