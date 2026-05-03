// decks.js
// API-fetched deck cache and helpers.

export const fetchedDecks = [];

/**
 * Returns a deck from the in-memory cache by its database id.
 *
 * @param {string} deckId - The deck _id.
 * @returns {Object|null} Matching deck or null.
 */
export function getDeckByID(deckId) {
  return fetchedDecks.find((deck) => deck._id === deckId) || null;
}

/**
 * Removes a deck from the in-memory cache by id.
 *
 * @param {string} deckId - The deck _id.
 */
export function removeDeckByID(deckId) {
  const index = fetchedDecks.findIndex((deck) => deck._id === deckId);
  if (index !== -1) {
    fetchedDecks.splice(index, 1);
  }
}
