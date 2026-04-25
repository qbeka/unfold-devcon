# Unfold

Upload the manual. Learn in your language. Pass the exam.

Unfold is a source-grounded, multilingual exam coach for Alberta Basic Security Training students. It uploads the course manual, processes it on AWS, lets the student read it in their language, practice exam questions, and reinforce wrong answers in an animated 3D officer-and-citizen scene with voice-controlled practice.

## Demo Path

1. Open the app. Upload the Alberta Basic Security Training PDF.
2. Watch the four steps: S3 upload, Textract extraction, Bedrock parsing, ready.
3. Pick your native language (German is the deterministic translation that ships in the demo).
4. Read tab opens. Module Five is fully rendered with translations, callouts, sample reports.
5. Toggle "Original PDF" to view the underlying manual pages 107–129.
6. Start a focused exam. Pick 3 or 5 questions. The scene-trigger question is always included.
7. Answer the kooky-victim question incorrectly, submit, click View 3D Correction.
8. The 3D scene shows two side-by-side dioramas with the officer and citizen GLB models.
9. Press Play to hear narration and watch subtle motion.
10. Click Practice It. Speak your incident-report sentence into the mic.
11. The first attempt always returns "Try again: Reports cannot include guesses." The second is correct.
12. Complete practice — Progress shows Objective report writing as improved.
13. Discussion and Movie tabs round out the surfaces.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

```bash
npm run lint
npm run typecheck
npm run build
```

To bypass the upload screen for development, set `NEXT_PUBLIC_SKIP_UPLOAD=true`.

## Refresh Module Five Content

```bash
node scripts/extract-module-five.mjs
```

Re-runs PDF extraction over `public/manual/abst-manual.pdf` and rewrites `lib/data/moduleFiveContent.ts`. The shipped file is hand-cleaned for demo readability with German translations.

## Environment

Copy `.env.example` to `.env.local`. Fill in:

```bash
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEMO_VIDEO_PATH=/videos/demo-report-writing.mp4
NEXT_PUBLIC_AWS_REGION=us-west-2
NEXT_PUBLIC_SKIP_UPLOAD=false

AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
DYNAMODB_TABLE_NAME=
BEDROCK_MODEL_ID=
BEDROCK_IMAGE_MODEL_ID=
POLLY_VOICE_ID=Joanna
TEXTRACT_POLL_INTERVAL_MS=2500
TEXTRACT_MAX_POLL_ATTEMPTS=24
```

## AWS Resources Expected

- S3 bucket for uploaded PDFs and generated assets
- DynamoDB table with `pk` + `sk` keys
- Bedrock model access for `BEDROCK_MODEL_ID`
- Textract access in the configured region
- Polly access for narration

## Deployment

Recommended host: AWS Amplify Hosting.

1. Push to GitHub.
2. Connect the repo in Amplify Hosting.
3. Use `amplify.yml` for the build.
4. Add the variables from `.env.aws.example`.
5. Deploy.

## Repo Map

- `app/api/process-document/` — PDF upload, S3, Textract, Bedrock parse, DynamoDB save
- `components/layout/` — upload screen, top bar, tabs, app shell
- `components/read/` — Module Five reader and original PDF viewer
- `components/exam/` — focused/open-book exam, 3 or 5 questions, scene-trigger always included
- `components/corrections/` — animated 3D dioramas with GLB models, voice practice
- `components/discussion/` — Lawrence's class-discussion surface
- `components/movie/` — prompt + style + storyboard fallback
- `components/progress/` — readiness, weak areas, recommendations
- `lib/aws/` — S3, Textract, Bedrock, DynamoDB, Polly with deterministic fallback
- `lib/data/moduleFiveContent.ts` — curated Module Five with translations
- `lib/store.ts` — global state and exam shuffle
- `public/models/` — `officer.glb`, `citizen.glb`
- `public/manual/abst-manual.pdf` — original manual
- `scripts/extract-module-five.mjs` — PDF extraction utility

## Known Limits

- Module Five is the curated learning path. Other modules show recognized activities/concepts only.
- The exam pool is curated; Bedrock-driven generation is wired and disabled while `NEXT_PUBLIC_DEMO_MODE=true`.
- The Movie tab uses the local video at `public/videos/demo-report-writing.mp4` if present, otherwise storyboard cards.
- Voice practice is deterministic: first attempt → "Try again", second attempt → pass. Real speech recognition is used when supported; a simulated fallback runs otherwise.
- Next.js 14 retained per project spec.
