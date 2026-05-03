# Flashcard App

GitHub Repository:
https://github.com/Joedeezee1983/ai-se_project_flashcards

This project is a hash-routed flashcard SPA built during TripleTen AI-Assisted Software Engineering. In Sprint 4, the app was upgraded from local in-memory data to a remote API-backed database so deck changes persist across page reloads.

## Live Demo

https://joedeezee1983.github.io/ai-se_project_flashcards

## Project Pitch Video

Check out this video where I describe the project and challenges I faced:
https://drive.google.com/file/d/1Gm-LD4Efb7RP9dXfixpdAVFwYk4SmH12/view?usp=sharing

## Sprint 4 Features

- Initial decks are fetched from the remote API on load.
- New Deck form creates decks with `POST /v1/decks` and navigates to the new deck view.
- Deck delete buttons remove decks with `DELETE /v1/decks/{deckId}`.
- Deck data is cached in a shared `fetchedDecks` array and routed using database `_id` values.
- Errors from API/form flows are shown through a shared modal message.
- Added an About view available at `#about`, including a JSON schema code sample.
- Optional card routes are implemented:
  - Add cards with `POST /v1/cards/{deckId}`.
  - Edit cards with `PUT /v1/cards/{cardId}`.
  - Delete cards with `DELETE /v1/cards/{cardId}`.
- All named JavaScript functions are documented with JSDoc.

## Routes

- `#home` - Deck gallery
- `#new-deck` - New deck form
- `#deck/:id` - Deck details and cards
- `#carousel/:id` - Practice mode carousel
- `#about` - About page

## Tech Stack

- HTML5
- CSS3 (BEM-style classes)
- Vanilla JavaScript (ES modules)
- Remote REST API: https://se-flashcards-api.en.tripleten-services.com

## Local Run

1. Clone/download the repository.
2. Open `index.html` in a browser, or serve the project root with any static server.

## Automated Check Entry Point

The repository includes `run.sh` at the root for platform/instructor checks. It starts a static server at http://127.0.0.1:8000.

## Future Improvements

- Add richer accessibility support and keyboard shortcuts.
- Add loading states/skeletons for API operations.
