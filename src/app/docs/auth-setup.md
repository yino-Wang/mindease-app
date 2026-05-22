# Supabase Auth setup (MindEase)

## Environment variables

Add to `.env` (never commit):

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Find both in Supabase Dashboard → **Project Settings → API**.

## Dashboard configuration

1. **Authentication → URL configuration**
   - Site URL: `http://localhost:3000` (dev)
   - Redirect URLs: `http://localhost:3000/auth/callback`

2. **Authentication → Providers**
   - Enable **Email**
   - Enable password sign-in and magic link (OTP) as needed

## Prisma user sync

On sign-in / callback, the app upserts `users` with `id` equal to Supabase Auth `user.id` and `email` from Auth.

## Manual test

1. Visit `/zen-timer` while logged out → redirect to `/login`
2. Sign up → `/zen-timer`
3. Complete a session → journal modal saves via cookie session
4. Sign out → `/login`
