# TubeEQ API

Backend API for the [TubeEQ](https://github.com/Dongdarealest/TubeEQ) Chrome extension, deployed on Vercel.

## Endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /api/count` | Total download count |
| `GET /api/presets` | List shared presets |
| `POST /api/react` | Add a reaction to a preset |
| `GET /api/version` | Latest extension version |
| `GET /api/changelog` | Extension changelog |

## Storage

Data lives in Upstash Redis. Set these environment variables before running:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

See `.env.example` for the expected shape.
