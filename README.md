# Adventure Book — Frontend

Angular client for the Adventure Book engine: browse and search books on a home screen, then play through a book's section graph, taking damage or healing based on the choices you make, until you reach an ending or run out of health.

## Tech Stack

- **Angular 22** (standalone components, Signals, `computed()`)
- **TypeScript 6**
- **SCSS** for styling
- **Vitest** configured as the test runner (no test files currently written — see Known Issues)

Requires the [backend](../adventure-book-main) running on `http://localhost:8080` (no environment-based config yet — the API base URL is hardcoded in the services, see Known Issues).

## Requirements

- Node.js (compatible with Angular CLI 22.0.7)
- npm

## Running Locally

```bash
npm install
npm start        # ng serve
```

Open `http://localhost:4200`. The backend must already be running and reachable at `http://localhost:8080`, since `BookService` fetches the book list as soon as the app module loads (see Known Issues — this also means the app won't start cleanly if the backend is down).

```bash
npm run build     # ng build, output to dist/
npm test          # ng test (Vitest) — currently no spec files exist
```

## Project Structure

```
src/app
├── app.component.ts       # Root component (RouterOutlet)
├── app.routes.ts           # '/' -> HomeComponent, '/game' -> GameComponent
├── home/                    # Library screen: search, filter, list of books
├── game/                    # Play screen: current section, choices, health, save
├── models/                  # Book, Section, Choice, Progress interfaces
└── services/
    ├── book.service.ts      # Book list + in-memory game state (signals)
    └── progress.service.ts  # Save/load progress against the backend
```

## Features

- **Home screen**: lists all books, free-text search (title/author), and tag/difficulty/category filters, built from the union of tags across all loaded books.
- **Game screen**: renders the current section's text and options, tracks health as the player makes choices, and shows dedicated "you died" / "adventure complete" end states.
- **Save/resume**: "Save Progress" persists the current section id and health to the backend; reopening a book with saved progress resumes from that section instead of the beginning. (Currently broken in practice — see Known Issues.)
- **Not implemented**: no UI for uploading a new book (backend Objective 5 exists as an API but has no corresponding screen here).
