# Simple Notes App (Frontend)

A minimalistic, light-themed React notes application. It lets you list, create, edit, and delete notes locally in the browser. No backend required.

## Features
- List notes in a sidebar
- Create new notes
- Edit note title and content
- Delete notes
- Lightweight styling using the color scheme:
  - Primary: `#1976d2`
  - Secondary: `#424242`
  - Accent: `#ffd600`

## Layout
- Header with app name and quick “New” action
- Sidebar with note list (sorted by last updated)
- Main editor area for title and content

## Getting Started

Install dependencies and run:

```bash
npm install
npm start
```

Open http://localhost:3000 to view the app.

Run tests:
```bash
npm test
```

Build for production:
```bash
npm run build
```

## Notes Persistence
Notes are kept in memory and mirrored to `localStorage` for convenience. Clearing site data will remove saved notes.

## Tech
- React 18
- No UI framework; pure CSS

## Project Structure
- `src/App.js` — Application layout and logic
- `src/App.css` — Minimal styling and layout
- `src/index.js` — App bootstrap
- `src/index.css` — Base resets
