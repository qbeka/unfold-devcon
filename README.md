# Unfold

Upload the manual. Practice with source-grounded tools. Pass the exam.

Unfold is a source-grounded exam coach for Alberta Basic Security Training students. It uploads the course manual to S3, recognizes the official demo PDF by SHA-256, then opens a curated exam practice path with 3D correction scenes, voice practice, discussion, movie generation, and progress tracking.

## Demo Path

1. Open the app. Upload the Alberta Basic Security Training PDF. 
2. Watch the upload flow: S3 upload, source verification, workspace loading, ready.
3. Read tab opens. Module Five is fully rendered with callouts and sample reports.
4. Toggle "Original PDF" to view the underlying manual pages 107–129.
5. Start a focused exam. Pick 3 or 5 questions. The scene-trigger question is always included.
6. Answer the kooky-victim question incorrectly, submit, click View 3D Correction.
7. The 3D scene shows two side-by-side dioramas with the officer and citizen GLB models.
8. Press Play to hear narration and watch subtle motion.
9. Click Practice It. Speak your incident-report sentence into the mic.
10. The first attempt always returns "Try again: Reports cannot include guesses." The second is correct.
11. Complete practice — Progress shows Objective report writing as improved.
12. Discussion and Movie tabs round out the surfaces.

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

Re-runs PDF extraction over `public/manual/abst-manual.pdf` and rewrites `lib/data/moduleFiveContent.ts`. The shipped file is hand-cleaned for demo readability.

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
DETERMINISTIC_DOCUMENT_HASH=3cc730708278558b93aa77ad0a161a66ef280ea44ea15cd2db7e199e23e9c12b
DETERMINISTIC_DOCUMENT_ID=alberta-basic-security-training
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
```

## AWS Resources Expected

- S3 bucket for uploaded PDFs
- IAM user with `s3:PutObject`, `s3:GetObject`, and `s3:ListBucket`
- The broader AWS setup guide is kept in `docs/AWS_SETUP.md`, but the current runtime implementation only requires S3.

## Deployment

Recommended host: AWS Amplify Hosting.

1. Push to GitHub.
2. Connect the repo in Amplify Hosting.
3. Use `amplify.yml` for the build.
4. Add the variables from `.env.aws.example`.
5. Deploy.

## Repo Map

- `app/api/process-document/` — PDF upload to S3 and SHA-256 recognition for the deterministic manual
- `components/layout/` — upload screen, top bar, tabs, app shell
- `components/read/` — Module Five reader and original PDF viewer
- `components/exam/` — focused/open-book exam, 3 or 5 questions, scene-trigger always included
- `components/corrections/` — animated 3D dioramas with GLB models, voice practice
- `components/discussion/` — Lawrence's class-discussion surface
- `components/movie/` — prompt + style + storyboard fallback
- `components/progress/` — readiness, weak areas, recommendations
- `lib/aws/` — AWS service boundaries; S3 is the only live runtime dependency for the demo
- `lib/data/moduleFiveContent.ts` — curated Module Five source content
- `lib/store.ts` — global state and exam shuffle
- `public/models/` — `officer.glb`, `citizen.glb`
- `public/manual/abst-manual.pdf` — original manual
- `scripts/extract-module-five.mjs` — PDF extraction utility

## Known Limits.

- Module Five is the curated learning path. Other modules show recognized activities/concepts only.
- The official manual is recognized by SHA-256 and mapped to curated content after S3 upload.
- The Movie tab uses the local video at `public/videos/demo-report-writing.mp4` if present, otherwise storyboard cards.
- Voice practice is deterministic: first attempt → "Try again", second attempt → pass. ElevenLabs narrates scene playback when configured; browser speech synthesis remains the fallback.
- Next.js 14 retained per project spec.
