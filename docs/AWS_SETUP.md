# AWS Setup for Unfold

This document is the full AWS roadmap for Unfold. The current hackathon runtime only requires S3: uploaded PDFs are stored in your bucket, then the Alberta Basic Security Training PDF is recognized by SHA-256 and mapped to the curated Module Five demo state.

The Alberta Basic Security Training PDF is treated as a special document. Its SHA-256 is matched on upload so the app can use the curated Module Five content even when the deterministic flag is off — you upload your manual once, the system recognizes it, and you immediately get the polished demo experience without re-curating it.

```
DETERMINISTIC_DOCUMENT_HASH=3cc730708278558b93aa77ad0a161a66ef280ea44ea15cd2db7e199e23e9c12b
DETERMINISTIC_DOCUMENT_ID=alberta-basic-security-training
```

---

## 0 · What you will provision

| Service | What it does | Required |
|---|---|---|
| IAM user | API credentials with least-privilege access | yes |
| S3 bucket | Stores uploaded PDFs | yes |
| Textract | Extracts text from PDFs | later |
| Bedrock (Anthropic Claude) | Parses, simplifies, translates, generates exams + scenes | later |
| Polly | Narrates the correction scene and movie | later |
| DynamoDB table | Stores manifests, attempts, weak areas | later |
| Bedrock image model | Optional. Generates movie/storyboard images | optional |

Pick a single region for everything. Recommended: `us-west-2` (Oregon) — it has Bedrock model access and supports all five services. `us-east-1` (N. Virginia) also works.

---

## 1 · Create an IAM user

1. AWS Console → **IAM** → **Users** → **Create user**.
2. Name: `unfold-app`.
3. Access type: **Programmatic access** (we will create the access keys after).
4. Attach the inline JSON policy in `docs/AWS_IAM_POLICY.json` (or paste the snippet below). This hackathon-ready policy uses wildcard resources so AWS accepts it before the S3 bucket and DynamoDB table exist.
5. Create the user.
6. Open the user → **Security credentials** → **Access keys** → **Create access key** → choose **Application running outside AWS** → save the access key ID and secret. You will paste these into `.env.local`.

Inline policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3Documents",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],
      "Resource": "*"
    }
  ]
}
```

---

## 2 · Create the S3 bucket

1. AWS Console → **S3** → **Create bucket**.
2. Name: `unfold-<your-handle>` (S3 names are global, so make it unique). Example: `unfold-qendrim`.
3. Region: same as everything else (e.g. `us-west-2`).
4. **Object Ownership**: ACLs disabled, Bucket owner enforced (default).
5. **Block Public Access**: leave all four settings ON. We use signed URLs to fetch generated assets.
6. **Versioning**: Disabled (cheaper for the demo).
7. **Encryption**: SSE-S3 (default).
8. Create.

After creation, add a CORS rule so the browser can `PUT`/`GET` directly via signed URLs:

`Permissions → Cross-origin resource sharing → Edit`:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://YOUR_AMPLIFY_DOMAIN"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Add `S3_BUCKET_NAME=<your-bucket>` to `.env.local`.

---

## 3 · Enable Textract

Textract is per-region, no provisioning needed. Just make sure the IAM policy above allows it.

Verify with the CLI:

```bash
aws textract help | head -20
aws s3 cp abst-particpants-manual-oct-2014-2.pdf s3://YOUR_BUCKET/test/manual.pdf
aws textract start-document-text-detection \
  --document-location '{"S3Object":{"Bucket":"YOUR_BUCKET","Name":"test/manual.pdf"}}'
```

You should get back `{"JobId": "..."}`. That confirms Textract works in your region.

---

## 4 · Bedrock model access (Anthropic Claude)

Bedrock requires you to **request access** to specific models per-region.

1. AWS Console → **Bedrock** → **Model access** (left sidebar) → **Modify model access**.
2. Tick **Anthropic — Claude 3.5 Sonnet** (or Haiku for cheaper).
3. If prompted, fill in the use case (`Internal product development for an education app`) and submit.
4. For Anthropic models AWS usually grants access in seconds. Wait until the status reads **Access granted**.

Pick the inference profile model ID. The recommended ones are:

| Model | Inference profile model ID |
|---|---|
| Claude 3.5 Sonnet (best quality) | `anthropic.claude-3-5-sonnet-20240620-v1:0` |
| Claude 3.5 Haiku (cheap, fast) | `anthropic.claude-3-5-haiku-20241022-v1:0` |
| Claude 3 Sonnet (older) | `anthropic.claude-3-sonnet-20240229-v1:0` |

Add to `.env.local`:

```
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
```

Optional — if you want Bedrock to also generate movie/storyboard images, also request access to **Stability AI – Stable Diffusion XL** and add:

```
BEDROCK_IMAGE_MODEL_ID=stability.stable-diffusion-xl-v1
```

Verify with the CLI:

```bash
aws bedrock-runtime invoke-model \
  --model-id anthropic.claude-3-5-sonnet-20240620-v1:0 \
  --content-type application/json \
  --accept application/json \
  --body '{"anthropic_version":"bedrock-2023-05-31","max_tokens":32,"messages":[{"role":"user","content":"Say hello in 3 words."}]}' \
  /tmp/out.json && cat /tmp/out.json
```

---

## 5 · Polly

Polly needs no setup beyond IAM access. Pick a voice.

| Voice | Language | Engine | Notes |
|---|---|---|---|
| `Joanna` | en-US | neural | default narration |
| `Matthew` | en-US | neural | male alternative |
| `Vicki` | de-DE | neural | German |
| `Lupe` | es-US | neural | Spanish |

Add to `.env.local`:

```
POLLY_VOICE_ID=Joanna
```

Verify:

```bash
aws polly synthesize-speech \
  --output-format mp3 --voice-id Joanna \
  --text "Hello from Unfold." \
  /tmp/test.mp3 && open /tmp/test.mp3
```

---

## 6 · DynamoDB table

1. AWS Console → **DynamoDB** → **Create table**.
2. Name: `unfold-state`.
3. **Partition key**: `pk` (String).
4. **Sort key**: `sk` (String).
5. **Capacity mode**: On-demand (cheapest for low usage).
6. Encryption: AWS-owned key (default).
7. Create.

Add to `.env.local`:

```
DYNAMODB_TABLE_NAME=unfold-state
```

The app stores items like:

| `pk` | `sk` | What |
|---|---|---|
| `DOCUMENT#<id>` | `MANIFEST` | Parsed module manifest |
| `STUDENT#<id>` | `PROGRESS` | Readiness, weak areas, recommendations |
| `STUDENT#<id>` | `ATTEMPT#<ts>#<qid>` | Each exam attempt |

---

## 7 · Final `.env.local`

Create `.env.local` at the repo root (the file is git-ignored):

```ini
# --- Demo mode ---------------------------------------------------------------
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SKIP_UPLOAD=false
NEXT_PUBLIC_DEMO_VIDEO_PATH=/videos/video.mp4

# --- AWS ---------------------------------------------------------------------
AWS_REGION=us-west-2
NEXT_PUBLIC_AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

S3_BUCKET_NAME=unfold-qendrim

# --- Deterministic match -----------------------------------------------------
DETERMINISTIC_DOCUMENT_HASH=3cc730708278558b93aa77ad0a161a66ef280ea44ea15cd2db7e199e23e9c12b
DETERMINISTIC_DOCUMENT_ID=alberta-basic-security-training
```

How the current runtime works:

- `/api/process-document` uploads the PDF to S3 when `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `S3_BUCKET_NAME` are present.
- The route computes the uploaded file's SHA-256. If it matches `DETERMINISTIC_DOCUMENT_HASH`, the app returns the curated Alberta Basic Security Training manifest.
- Textract, Bedrock, Polly, and DynamoDB remain documented as the roadmap, but they are not required for the current demo runtime.

---

## 8 · Smoke test

After saving `.env.local`:

```bash
npm run typecheck
npm run dev
```

Then in a second terminal:

```bash
# 1. S3 reachable
aws s3 ls s3://$S3_BUCKET_NAME

# 2. Upload route reachable
curl -s http://localhost:3000/api/process-document -F "file=@abst-particpants-manual-oct-2014-2.pdf"
```

The upload route should return a JSON object with `recognized: true`, the file `documentHash`, an S3 `upload`, and the curated `manifest`.

---

## 9 · Cost expectations (us-west-2, on-demand pricing as of 2026)

| Service | Single-user demo | Notes |
|---|---|---|
| S3 | ~$0.01 / GB / month | one PDF + small generated assets |
| Textract | $1.50 per 1000 pages async | Alberta manual = $0.30 per processing |
| Bedrock Claude 3.5 Sonnet | $3 / 1M input tokens, $15 / 1M output | a single demo run is < $0.05 |
| Bedrock Claude 3.5 Haiku | $0.80 / 1M in, $4 / 1M out | swap to Haiku to lower cost ~3× |
| Polly neural | $16 / 1M chars | the demo narration is < 1000 chars |
| DynamoDB on-demand | $1.25 / 1M writes, $0.25 / 1M reads | negligible for a demo |

A realistic full-end-to-end demo run costs well under **$1**.

---

## 10 · Deploy on AWS Amplify Hosting (optional)

1. Push the repo to GitHub.
2. AWS Console → **Amplify Hosting** → **New app** → **Host from GitHub** → select repo + `main`.
3. Use the auto-detected Next.js build settings.
4. **Environment variables**: paste every value from `.env.local`.
5. Service role: let Amplify create one (it gets read access automatically). For the AWS SDK calls you still rely on the IAM access keys you set as env vars.
6. Deploy.

---

## 11 · Re-running the deterministic content build

Whenever you change the Alberta manual or want to refresh the curated content:

```bash
node scripts/extract-all-modules.mjs        # re-extract every module's text
TARGET_LANG=de node scripts/translate-modules.mjs  # re-translate to German
```

The generated `lib/data/moduleSnippets.ts` and `lib/data/moduleSnippetsTranslated.ts` are committed; both run offline (no AWS).

---

## 12 · Quick checklist

- [ ] IAM user `unfold-app` with the inline policy
- [ ] Access key ID + secret in `.env.local`
- [ ] S3 bucket created, CORS configured, name in `S3_BUCKET_NAME`
- [ ] `DETERMINISTIC_DOCUMENT_HASH` and `DETERMINISTIC_DOCUMENT_ID` set
- [ ] `npm run dev` boots and `/api/process-document` returns `recognized: true` for the official manual
- [ ] Later: Textract, Bedrock, Polly, and DynamoDB provisioned if the team extends beyond the S3 demo
