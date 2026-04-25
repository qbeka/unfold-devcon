// Curated Module Five content based on the Alberta Basic Security Training
// Participant Manual, pages 107-129 (manual pages 1-23 of Module Five).
// The live extraction script at scripts/extract-module-five.mjs can refresh
// the underlying raw text. This file is hand-cleaned for demo readability.

export type ContentBlock =
  | {
      kind: "paragraph";
      page: number;
      text: string;
    }
  | {
      kind: "list";
      page: number;
      style: "bullet" | "ordered";
      items: string[];
    }
  | {
      kind: "callout";
      page: number;
      label: string;
      text: string;
    }
  | {
      kind: "report";
      page: number;
      title: string;
      lines: string[];
    };

export type ModuleSection = {
  id: string;
  page: number;
  heading: string;
  subheading?: string;
  blocks: ContentBlock[];
};

export type ModuleContent = {
  id: string;
  title: string;
  pageRange: { start: number; end: number };
  sections: ModuleSection[];
};

export const moduleFiveContent: ModuleContent = {
  id: "module-five",
  title: "Module Five: Documentation and Evidence",
  pageRange: { start: 107, end: 129 },
  sections: [
    {
      id: "intro",
      page: 1,
      heading: "Introduction",
      blocks: [
        {
          kind: "paragraph",
          page: 1,
          text: "You should now be familiar with the role and responsibilities of a security professional and you have been introduced to a variety of situations which you can expect to encounter throughout your career. So far, you have learned how you will use both verbal and non-verbal communication, and you have been introduced to the skill of interviewing. In this module, you will learn how to document various types of interactions and incidents. Keeping a notebook which is both accurate and complete is a must for any security professional. Documenting and reporting are important ways in which you contribute to the success of investigations and ultimately, the success of your employer.",},
        {
          kind: "paragraph",
          page: 1,
          text: "In addition to learning how to prepare various reports and documents, you will learn about your responsibilities when it comes to collecting and preserving evidence to be used during the investigative process.",}
      ]
    },
    {
      id: "learning-outcomes",
      page: 1,
      heading: "Learning Outcomes",
      subheading: "Upon completion of this module, you will be able to:",
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
          ],}
      ]
    },
    {
      id: "notebooks",
      page: 3,
      heading: "Notebooks",
      blocks: [
        {
          kind: "paragraph",
          page: 3,
          text: "As already stated in Module Three, every security professional must carry a notebook. Your notebook is one of the most important pieces of equipment that you will carry. It is a permanent, official record of your shift, the people you spoke with, and the events that took place.",},
        {
          kind: "paragraph",
          page: 3,
          text: "A notebook should be small enough to carry in a uniform pocket but large enough that you can write clearly. Pages must be bound and numbered so that nothing can be added or removed later. Use blue or black ink so that entries are permanent.",},
        {
          kind: "paragraph",
          page: 4,
          text: "Notebook entries should answer the questions Who, What, Where, When, Why, and How. Whenever you record an entry, ask yourself: Who was involved? What happened? Where did it occur? When did it occur? Why did it occur (if known)? How did it occur?",},
        {
          kind: "callout",
          page: 4,
          label: "When?",
          text: "When did you hear about the incident? When did the incident occur? When did you arrive on scene? When did witnesses arrive or leave? Time is the backbone of every report.",},
        {
          kind: "list",
          page: 5,
          style: "bullet",
          items: [
            "Write entries in chronological order, in the order events actually happened.",
            "Do not skip lines, leave blank spaces, or tear out pages.",
            "If you make a mistake, draw a single line through it, write your initials beside it, and continue.",
            "Notebooks remain the property of your employer and may be used as evidence in court."
          ],}
      ]
    },
    {
      id: "twenty-four-hour-clock",
      page: 6,
      heading: "The 24-Hour Clock",
      blocks: [
        {
          kind: "paragraph",
          page: 6,
          text: "The security industry uses the 24-hour clock so that there is no confusion between morning and evening. Midnight is 0000 and the last minute of the day is 2359. Any time after noon adds 12 to the standard hour: 1:30 PM becomes 1330 and 11:28 PM becomes 2328.",},
        {
          kind: "list",
          page: 7,
          style: "bullet",
          items: [
            "1:30 PM becomes 1330.",
            "5:41 PM becomes 1741.",
            "2:14 AM becomes 0214.",
            "11:28 AM becomes 1128."
          ],}
      ]
    },
    {
      id: "statements",
      page: 12,
      heading: "Statements",
      blocks: [
        {
          kind: "paragraph",
          page: 12,
          text: "Statements are an individual's account of what took place. They may come from a victim, a witness, or a suspect. A good statement is recorded in the speaker's own words, includes who, what, where, when, why, and how, and is signed and dated by the person providing it.",},
        {
          kind: "paragraph",
          page: 12,
          text: "Whenever possible, take notes during the conversation, then read your notes back to the person to confirm accuracy. Do not write opinions or interpretations. Record exactly what was said.",}
      ]
    },
    {
      id: "reports",
      page: 13,
      heading: "Reports",
      blocks: [
        {
          kind: "paragraph",
          page: 13,
          text: "Reports should be accurate reflections of what took place. They should be free from personal opinion and irrelevant detail. A person reading the report should clearly understand what happened. Reports should be written clearly and neatly. Good reports include the date, location, source of information, and what was seen, heard, smelled, or reported.",},
        {
          kind: "paragraph",
          page: 13,
          text: "Use past tense. Use short sentences. Organize events in the order they occurred. Refer to your notebook to include relevant details.",},
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
          ],},
        {
          kind: "callout",
          page: 14,
          label: "Watch your wording",
          text: "Sentences such as ‘the victim looked kooky and might cry’ contain personal opinion and irrelevant detail. Replace them with objective facts: ‘Mrs. Meredith reported her purse was stolen at 1116.’",}
      ]
    },
    {
      id: "evidence",
      page: 19,
      heading: "Evidence",
      blocks: [
        {
          kind: "paragraph",
          page: 19,
          text: "Evidence is anything that helps prove or disprove a fact. As a security professional, you may be the first person to encounter evidence at the scene of an incident. Your job is to identify, protect, and report it. Do not move or touch evidence unless absolutely necessary, and only when the scene has been documented first.",},
        {
          kind: "list",
          page: 20,
          style: "bullet",
          items: [
            "Direct evidence: a witness who saw what happened.",
            "Circumstantial evidence: facts that suggest something occurred.",
            "Physical evidence: objects, prints, fibers, video, photographs.",
            "Documentary evidence: notes, reports, signed statements."
          ],}
      ]
    },
    {
      id: "preparing-for-court",
      page: 21,
      heading: "Preparing for Court",
      blocks: [
        {
          kind: "paragraph",
          page: 21,
          text: "If you are required to give testimony, dress professionally and arrive early. Bring your notebook and any reports you authored. Refer to your notes to refresh your memory, but answer questions directly and only describe what you personally observed. Speak clearly. If you do not know an answer, say so. Do not guess.",}
      ]
    },
    {
      id: "conclusion",
      page: 23,
      heading: "Conclusion",
      blocks: [
        {
          kind: "paragraph",
          page: 23,
          text: "Keeping an accurate notebook, writing objective reports, and protecting evidence are some of the most important skills you bring to the job. They protect your employer, support investigations, and protect you. The discipline of writing only what you saw, heard, or were told is what separates a professional report from a personal opinion.",}
      ]
    }
  ]
};

