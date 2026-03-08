# X_List

X_List ist ein Multi-Media-Tracker (inspiriert von MyAnimeList) für:
- Anime
- Manga
- Filme
- Serien
- Bücher

Stack:
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Firebase Auth (nur Google)
- Cloud Firestore
- Externe APIs: TMDb, Jikan, Google Books (+ Open Library Fallback)

## Features (MVP)
- Öffentliche Seiten: Landing, Browse, Suche, Detailseite
- Private Seiten: Dashboard, Listen, Favoriten, Profil, Statistik
- User-Entry pro Titel mit Status, Rating, Notizen, Fortschritt, Favorit
- Debounced Search + Filter/Sortierung
- Trending heute + einfache Empfehlungen
- JSON Export/Import eigener Liste
- Toasts, Skeleton, Empty States, Confirm Dialog
- Firestore Rules + Indexvorschlag

## 1) Firebase Projekt erstellen
1. Öffne Firebase Console und erstelle ein Projekt.
2. Aktiviere `Authentication` -> `Sign-in method` -> `Google`.
3. Lege `Cloud Firestore` im Production oder Test Mode an.
4. Erstelle eine Web App und kopiere die Firebase Web Config.
5. Erstelle ein Service Account Key (Project Settings -> Service accounts -> Generate new private key).

## 2) Google Login Redirect URLs
Bei Firebase Auth mit Google Popup sind typischerweise diese Domains erlaubt:
- Lokal: `http://localhost:3000`
- Vercel: `https://<dein-projekt>.vercel.app`

In Firebase Authentication unter **Authorized domains** hinzufügen.

## 3) Umgebungsvariablen setzen
1. Datei `.env.local` aus `.env.example` erstellen.
2. Alle Firebase Client Variablen setzen.
3. Service Account Werte setzen:
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (inkl. `\\n` Escapes)
4. `TMDB_API_KEY` setzen.
5. Optional `GOOGLE_BOOKS_API_KEY` setzen.

## 4) Firestore Rules/Indexe deployen
Optional mit Firebase CLI:

```bash
firebase login
firebase init firestore
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

Nutze dazu die Dateien:
- `firestore.rules`
- `firestore.indexes.json`

## 5) Lokal starten

```bash
npm install
npm run dev
```

## 6) Vercel Deployment
1. Repository nach GitHub pushen.
2. In Vercel importieren.
3. Alle ENV-Variablen aus `.env.example` in Vercel Project Settings setzen.
4. Deploy ausführen.

## Firestore Datenmodell
- `users/{uid}`
  - `uid, displayName, photoURL, email, createdAt`
- `users/{uid}/entries/{entryId}`
  - `mediaId, mediaType, source, externalId, title, imageUrl`
  - `status, rating, notes, progressCurrent, progressTotal`
  - `startedAt, finishedAt, rewatchCount, favorite`
  - `createdAt, updatedAt, uid`
- `cached_media/{source}_{mediaType}_{externalId}` (optional Cache)

## Sicherheit
- Keine API Keys im Client für TMDb/Books: Zugriff über serverseitige Route Handler.
- Firestore Rules erlauben nur Zugriff auf eigene User-Dokumente.
- Session-Cookie für Middleware-Routenschutz auf privaten Seiten.

## Hinweise
- Dieses Repo ist als produktionsnahes MVP gebaut.
- Falls externe APIs limitiert sind, zeigt die App robuste Fehlermeldungen statt Hard-Crash.
