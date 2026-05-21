# Dev auth for meditate APIs (Phase B)

Phase B uses a temporary dev header until Supabase Auth UI ships.

## Setup

1. Copy variables into `.env`:

```env
ENABLE_DEV_AUTH=true
DEV_USER_ID=<uuid>
NEXT_PUBLIC_DEV_USER_ID=<same-uuid>
```

2. Create a matching user row (Prisma Studio or seed):

```sql
INSERT INTO users (id, email, "updatedAt")
VALUES ('<uuid>', 'dev@mindease.local', NOW());
```

3. Upload `ambient/singing-bowl-chime.mp3` to Supabase bucket `meditation-assets`, or set `NEXT_PUBLIC_CHIME_AUDIO_URL`.

4. Restart `npm run dev`.

## API usage

Requests to `/api/meditate/log` and `/api/meditate/journal` must include:

```
x-dev-user-id: <uuid>
```

The browser client sends this automatically when `NEXT_PUBLIC_DEV_USER_ID` is set.
