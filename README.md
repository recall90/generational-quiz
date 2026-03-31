# 🧬 Generacijski Kviz

Interaktiven kviz za ugotavljanje generacijske identitete z realnim shranjevanjem rezultatov in statistiko.

## Tehnologije
- **Next.js 14** (Pages Router)
- **Vercel KV** (Redis) za shranjevanje podatkov
- **Recharts** za grafikone
- **TypeScript + CSS Modules**

---

## 🚀 Deploy na Vercel – navodila

### 1. Naloži na GitHub
```bash
git init
git add .
git commit -m "init: generacijski kviz"
git remote add origin https://github.com/TVOJE_IME/generacijski-kviz.git
git push -u origin main
```

### 2. Poveži z Vercel
1. Pojdi na [vercel.com](https://vercel.com) → **New Project**
2. Importiraj GitHub repo
3. Framework: **Next.js** (samodejno zazna)
4. Klikni **Deploy** (prva verzija brez KV bo delovala, a ne bo shranjevala)

### 3. Dodaj Vercel KV (za shranjevanje podatkov) ⚡

**To je ključen korak!**

1. V Vercel dashboardu → tvoj projekt → **Storage**
2. Klikni **Create Database** → izberi **KV**
3. Poimenuj jo (npr. `kviz-db`) → **Create & Continue**
4. Klikni **Connect to Project** → izberi tvoj projekt
5. Klikni **Continue** → Vercel samodejno doda potrebne environment variables

### 4. Redeploy
Po dodajanju KV baze klikni **Redeploy** v Vercel dashboardu (ali pushni nov commit).

---

## 💻 Lokalni razvoj

```bash
npm install
```

Za lokalni razvoj z KV:
1. Namesti Vercel CLI: `npm i -g vercel`
2. `vercel link` (poveži z Vercel projektom)
3. `vercel env pull .env.local` (potegni env variables)
4. `npm run dev`

Brez tega bo app deloval, a ne bo shranjevala podatkov lokalno.

---

## 📁 Struktura projekta

```
generacijski-kviz/
├── pages/
│   ├── api/
│   │   └── results.ts    # API endpoint za shranjevanje/branje
│   ├── _app.tsx
│   ├── index.tsx         # Kviz stran
│   ├── rezultat.tsx      # Stran z rezultatom
│   └── statistika.tsx    # Statistika (SSR)
├── src/
│   ├── components/
│   │   ├── Nav.tsx
│   │   └── Nav.module.css
│   └── lib/
│       └── quiz-data.ts  # Vprašanja, točkovnik, tipi
├── styles/
│   ├── globals.css
│   ├── Quiz.module.css
│   ├── Rezultat.module.css
│   └── Statistika.module.css
└── README.md
```
