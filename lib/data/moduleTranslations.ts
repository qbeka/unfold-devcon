// Hand-curated short module overviews used to render a translation card on the
// Read tab when a non-English language is selected for modules other than
// Module Five (which has full sectioned translations of its own).
//
// Add additional language keys here over time. For now the demo ships German.

import type { LanguageCode } from "@/lib/data/moduleFiveContent";

type ModuleOverview = {
  title: string;
  intro: string;
  bullets: string[];
};

const overviews: Record<string, Record<LanguageCode, ModuleOverview | undefined>> = {
  "module-one": {
    en: undefined,
    de: {
      title: "Modul Eins: Einführung in die Sicherheitsbranche",
      intro:
        "Dieses Modul beschreibt die Rolle und Verantwortlichkeiten von Sicherheitsfachleuten in Alberta, einschließlich Ethik, Lizenzierung und öffentlicher Erwartungen.",
      bullets: [
        "Rolle und Pflichten eines Sicherheitsfachmanns.",
        "Lizenzierung und gesetzliche Voraussetzungen in Alberta.",
        "Berufsethik und öffentliches Vertrauen."
      ]
    },
    es: undefined,
    fr: undefined,
    ar: undefined,
    zh: undefined,
    uk: undefined,
    tl: undefined
  },
  "module-two": {
    en: undefined,
    de: {
      title: "Modul Zwei: Das Kanadische Rechtssystem",
      intro:
        "Rechtliche Grundlagen für Sicherheitspersonal: Strafrecht, Zivilrecht, Befugnisse und Grenzen.",
      bullets: [
        "Unterschied zwischen Straf- und Zivilrecht.",
        "Befugnisse zur Festnahme durch Bürger und Sicherheitskräfte.",
        "Grenzen der Befugnis und Konsequenzen bei Überschreitung."
      ]
    },
    es: undefined,
    fr: undefined,
    ar: undefined,
    zh: undefined,
    uk: undefined,
    tl: undefined
  },
  "module-three": {
    en: undefined,
    de: {
      title: "Modul Drei: Grundlegende Sicherheitsverfahren",
      intro:
        "Beobachtung, Streifengang, Zugangskontrolle und Berichterstattung als Kernaufgaben.",
      bullets: [
        "Streifengangs-Routinen und Kontrollpunkte.",
        "Zugangskontrolle und Identitätsprüfung.",
        "Beobachtungs- und Meldepflichten."
      ]
    },
    es: undefined,
    fr: undefined,
    ar: undefined,
    zh: undefined,
    uk: undefined,
    tl: undefined
  },
  "module-four": {
    en: undefined,
    de: {
      title: "Modul Vier: Kommunikation für Sicherheitsfachleute",
      intro:
        "Klare, professionelle Kommunikation, Funkprotokoll und Deeskalation in Stresssituationen.",
      bullets: [
        "Aktives Zuhören und paraphrasieren.",
        "Funkprotokoll und das phonetische Alphabet.",
        "Deeskalationstechniken bei aufgebrachten Personen."
      ]
    },
    es: undefined,
    fr: undefined,
    ar: undefined,
    zh: undefined,
    uk: undefined,
    tl: undefined
  },
  "module-five": {
    en: undefined,
    de: undefined, // Module Five is fully translated section-by-section elsewhere.
    es: undefined,
    fr: undefined,
    ar: undefined,
    zh: undefined,
    uk: undefined,
    tl: undefined
  },
  "module-six": {
    en: undefined,
    de: {
      title: "Modul Sechs: Notfallreaktionsverfahren",
      intro:
        "Prioritäten in Notfällen, Reaktionsabläufe und Kommunikation während eines Vorfalls.",
      bullets: [
        "Sicherheit am Tatort und persönliche Sicherheit zuerst.",
        "Notruf und Übergabe an Einsatzkräfte.",
        "Dokumentation der Reaktion und der Beobachtungen."
      ]
    },
    es: undefined,
    fr: undefined,
    ar: undefined,
    zh: undefined,
    uk: undefined,
    tl: undefined
  },
  "module-seven": {
    en: undefined,
    de: {
      title: "Modul Sieben: Gesundheit und Sicherheit",
      intro:
        "Arbeitsschutz, Gefahrenerkennung, persönliche Sicherheit und Sorgfaltspflicht.",
      bullets: [
        "Erkennung von Gefahren am Arbeitsplatz.",
        "Persönliche Schutzausrüstung und sichere Praktiken.",
        "Pflicht zur Fürsorge gegenüber Kollegen und der Öffentlichkeit."
      ]
    },
    es: undefined,
    fr: undefined,
    ar: undefined,
    zh: undefined,
    uk: undefined,
    tl: undefined
  },
  "module-eight": {
    en: undefined,
    de: {
      title: "Modul Acht: Abschlussüberprüfung",
      intro:
        "Prüfungsvorbereitung, Szenario-Überprüfung und Wiederholung der Schwächen.",
      bullets: [
        "Wiederholung der wichtigsten Konzepte.",
        "Bearbeitung typischer Prüfungsszenarien.",
        "Strategien für die Prüfung."
      ]
    },
    es: undefined,
    fr: undefined,
    ar: undefined,
    zh: undefined,
    uk: undefined,
    tl: undefined
  }
};

export function getModuleOverview(moduleId: string, language: LanguageCode): ModuleOverview | undefined {
  return overviews[moduleId]?.[language];
}
