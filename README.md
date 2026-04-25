# Unfold

Upload the manual. Learn in your language. Pass the exam.

Unfold is a source-grounded exam coach for Alberta Basic Security Training students. It uploads the course manual, extracts the document with AWS, recognizes modules, and guides students through reading, exam practice, corrections, discussion, movie review, and progress tracking.

## Current Demo

The app is optimized for the hackathon pitch path:

1. Upload the Alberta Basic Security Training PDF.
2. Wait for S3 upload, Textract extraction, and Bedrock parsing states.
3. Select `Module Five: Documentation and Evidence`.
4. Read the report-writing section in English, simplified English, Spanish, or side-by-side mode.
5. Start the focused exam.
6. Answer the objective-report-writing question incorrectly.
7. Review feedback, source reference, tested concept, and common mistake.
8. Open the animated 3D correction scene.
9. Play the narrated officer scenario.
10. Complete the practice prompt.
11. Confirm Progress updates readiness and improved areas.
12. Show Discussion and Movie surfaces.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment

Create `.env.local` from `.env.example`.

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

Use `NEXT_PUBLIC_DEMO_MODE=true` for the judged run. AWS upload, Textract, Bedrock parsing, and DynamoDB writes are wired through the backend. If AWS is unavailable, the app returns the deterministic Alberta manual manifest so the demo remains reliable.

## AWS Resources

Expected resources:

- S3 bucket for uploaded PDFs and generated assets.
- DynamoDB table using `pk` and `sk` keys.
- Bedrock model access for `BEDROCK_MODEL_ID`.
- Textract access in the configured region.
- Polly access for narration work.

## AWS Deployment

Recommended host: AWS Amplify Hosting.

1. Push this repo to GitHub.
2. Open AWS Amplify Hosting.
3. Connect the repo and branch.
4. Use `amplify.yml`.
5. Add variables from `.env.aws.example`.
6. Deploy.

Do not put real secrets in git.

## Repository Map

- `app/`: Next.js app and API routes.
- `app/api/process-document/`: PDF upload, S3, Textract, Bedrock parsing, DynamoDB manifest save.
- `components/layout/`: upload screen, shell, sidebar, top bar, tabs.
- `components/read/`: language modes and source section view.
- `components/exam/`: focused and open-book exam flow.
- `components/corrections/`: animated narrated 3D correction and practice.
- `components/discussion/`: Lawrence’s AI discussion integration surface.
- `components/movie/`: prompt, style selector, fake load, local video/storyboard output.
- `components/progress/`: readiness, weak areas, improved areas, recommendations.
- `lib/aws/`: S3, Textract, Bedrock, DynamoDB, Polly service code.
- `lib/data/`: deterministic fallback content for the pitch path.
- `lib/store.ts`: app state and deterministic demo transitions.
- `public/videos/`: add `demo-report-writing.mp4`.

## Team Workstreams

- AWS: implement and harden functions in `lib/aws/`.
- Discussion: replace `components/discussion/DiscussionTab.tsx` with Lawrence’s live logic.
- Movie: add the final video at `public/videos/demo-report-writing.mp4`.
- Content: edit `lib/data/` for deterministic pitch content.
- UI: keep each tab isolated under `components/`.

## Known Limits

- Module Five is the fully curated learning path.
- Other modules are recognized and selectable from the processed manifest, but not fully authored as learning screens.
- Movie generation shows the provided local video or storyboard fallback.
- Next.js 14 is retained because the project spec requires it.
