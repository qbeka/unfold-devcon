# Unfold Tech Stack

This document describes the exact stack used in the current demo and the stack we would use if Unfold were fully extended on AWS.

## Current Demo Stack

### Product Scope

Unfold is currently a polished deterministic exam-coach demo for the Alberta Basic Security Training manual. The app uploads a PDF to S3, recognizes the official demo manual by SHA-256, and then runs a curated local learning flow: reading, exam, 3D correction, voice practice, discussion, movie, and progress.

Translation is intentionally not part of the product.

### Frontend

- **Framework:** Next.js `14.2.35` with App Router
- **Language:** TypeScript `5.9.3`
- **Runtime UI:** React `18.3.1`, React DOM `18.3.1`
- **Styling:** Tailwind CSS `3.4.19`, PostCSS, Autoprefixer
- **Fonts:** Geist via `geist`
- **Icons:** `lucide-react`
- **State:** Zustand with `localStorage` persistence
- **3D:** Three.js, React Three Fiber, `@react-three/drei`
- **PDF support:** `pdfjs-dist`, `react-pdf`

### Backend/API

The backend is implemented with Next.js route handlers under `app/api`.

- `app/api/process-document` uploads PDFs to S3 and checks the SHA-256 hash.
- `app/api/generate-exam` returns curated exam questions.
- `app/api/submit-answer` returns deterministic answer feedback.
- `app/api/generate-scene` returns the curated 3D correction scene.
- `app/api/progress` returns progress state.
- `app/api/chat` powers the AI class discussion flow.
- `app/api/end-activity` summarizes discussion activity.
- `app/api/narration` calls ElevenLabs for high-quality scene narration.

### Live External Services Used Now

- **AWS S3:** real PDF upload target.
- **ElevenLabs:** text-to-speech narration for 3D scene playback when API credits allow it.
- **OpenAI:** discussion chat and activity summary.

### AWS SDKs Present

The repo includes AWS SDK packages so service boundaries are ready, but the current runtime only depends on S3.

- `@aws-sdk/client-s3`
- `@aws-sdk/s3-request-presigner`
- `@aws-sdk/client-bedrock-runtime`
- `@aws-sdk/client-textract`
- `@aws-sdk/client-dynamodb`
- `@aws-sdk/lib-dynamodb`
- `@aws-sdk/client-polly`

### Deployment Target

- **Recommended hosting:** AWS Amplify Hosting
- **Build file:** `amplify.yml`
- **Build commands:** `npm ci`, `npm run build`
- **Artifact directory:** `.next`

### Demo Data

- Official manual PDF: `public/manual/abst-manual.pdf`
- Curated Module Five content: `lib/data/moduleFiveContent.ts`
- Extracted module snippets: `lib/data/moduleSnippets.ts`
- Demo questions: `lib/data/demoQuestions.ts`
- Demo 3D scene/practice data: `lib/data/demoScene.ts`
- Demo progress defaults: `lib/data/demoProgress.ts`
- Demo manifest: `lib/data/demoManifest.ts`
- 3D models: `public/models/officer.glb`, `public/models/citizen.glb`
- Demo video: `public/videos/video.mp4`

## Full AWS Extension Stack

If Unfold were extended beyond the deterministic hackathon path, the system would keep the same Next.js app and replace local/demo data sources with AWS-backed pipelines.

### Hosting

- **AWS Amplify Hosting** for the Next.js frontend and route handlers.
- Optional split later: CloudFront + S3 static assets + Lambda/API Gateway for backend APIs.

### Storage

- **S3** for uploaded PDFs, generated audio, generated videos, and exported scene/storyboard assets.
- S3 object metadata would include document hash, original file name, upload time, and processing status.

### Document Processing

- **Textract** for PDF text extraction.
- **Bedrock Claude** for document parsing, sectioning, concept extraction, exam generation, answer feedback, scene JSON, discussion agents, and movie scripts.
- Optional **OpenSearch Serverless** for retrieval over source sections if the document set grows.

### Data Layer

- **DynamoDB** for:
  - document manifests
  - processing status
  - user attempts
  - weak areas
  - cached generated exams
  - cached scene JSON
  - discussion history
  - generated asset references

### AI/Media

- **Bedrock Claude** for structured learning outputs.
- **ElevenLabs** for premium narration if allowed.
- **Amazon Polly** as AWS-native narration fallback.
- Optional **Bedrock image model** for storyboard or still-frame generation.
- Optional media compositor service later for actual video rendering.

### Full Production Flow

1. User uploads PDF.
2. API uploads the file to S3.
3. API computes SHA-256 and stores metadata.
4. If the SHA-256 matches the official demo manual, return curated deterministic state.
5. Otherwise, Textract extracts text.
6. Bedrock parses the manual into modules, sections, activities, and exam concepts.
7. DynamoDB stores the document manifest and processing outputs.
8. Exam routes generate or retrieve source-grounded questions.
9. Answer routes grade attempts, generate feedback, and update weak areas.
10. Correction routes generate scene JSON and render through existing 3D templates.
11. Discussion routes run agent prompts over source activities.
12. Movie routes generate scripts, narration, and storyboard/video assets.

### Environment Variables

Current runtime:

```bash
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEMO_VIDEO_PATH=/videos/video.mp4
NEXT_PUBLIC_SKIP_UPLOAD=false
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=
DETERMINISTIC_DOCUMENT_HASH=3cc730708278558b93aa77ad0a161a66ef280ea44ea15cd2db7e199e23e9c12b
DETERMINISTIC_DOCUMENT_ID=alberta-basic-security-training
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
```

Future AWS extension:

```bash
BEDROCK_MODEL_ID=
BEDROCK_IMAGE_MODEL_ID=
DYNAMODB_TABLE_NAME=
POLLY_VOICE_ID=
TEXTRACT_POLL_INTERVAL_MS=2500
TEXTRACT_MAX_POLL_ATTEMPTS=24
OPENSEARCH_COLLECTION_ENDPOINT=
```

## Verification Commands

```bash
npm run typecheck
npm run lint
npm run build
```
