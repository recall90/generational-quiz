# 🧬 Generacijski Kviz

## Tehnologije
- Next.js 14 (Pages Router)
- **Vercel Blob** za shranjevanje podatkov
- Recharts za grafikone

## 🚀 Deploy na Vercel

### 1. GitHub
```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/TVOJE_IME/generacijski-kviz.git
git push -u origin main
```

### 2. Vercel deploy
Pojdi na vercel.com → New Project → importiraj repo → Deploy

### 3. ⚡ Dodaj Vercel Blob
1. Vercel dashboard → tvoj projekt → **Storage**
2. **Create Database** → **Blob**
3. Poimenuj (npr. `kviz-blob`) → Create
4. **Connect to Project** → Vercel doda `BLOB_READ_WRITE_TOKEN`
5. **Redeploy**

## 💻 Lokalno
```bash
npm install
vercel link
vercel env pull .env.local
npm run dev
```
