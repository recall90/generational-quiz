# 🧬 Generacijski Kviz

## Tehnologije
- Next.js 14, TypeScript, Recharts
- **Supabase** (PostgreSQL) za shranjevanje

---

## 🚀 Setup — Supabase (5 minut)

### 1. Ustvari Supabase projekt
1. Pojdi na [supabase.com](https://supabase.com) → **New project**
2. Poimenuj projekt, nastavi geslo, izberi regijo (EU West) → **Create**
3. Počakaj ~2 minuti da se projekt zažene

### 2. Ustvari tabelo
V Supabase dashboardu → **SQL Editor** → **New query** → prilepi in poženi:

```sql
create table results (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  birth_year integer not null,
  result text not null,
  scores jsonb not null,
  timestamp bigint not null,
  created_at timestamptz default now()
);
```

### 3. Pridobi API ključe
Supabase dashboard → **Settings** → **API**:
- **Project URL** → to je `NEXT_PUBLIC_SUPABASE_URL`
- **service_role** key (secret) → to je `SUPABASE_SERVICE_ROLE_KEY`

### 4. Dodaj v Vercel
Vercel dashboard → tvoj projekt → **Settings** → **Environment Variables**:
```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGci...
```
Označi vse tri: ✅ Production ✅ Preview ✅ Development

### 5. Redeploy
Vercel → Deployments → zadnji deploy → **Redeploy**

---

## 💻 Lokalni razvoj
Ustvari `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```
Nato:
```bash
npm install
npm run dev
```
