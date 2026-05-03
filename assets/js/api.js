const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
  "Content-Type": "application/json",
  Authorization: "019def2e-b8a2-72b3-8c16-91368d79813c",
};

/**
 * Converts a fetch response into JSON for successful responses.
 * Rejects with a useful message for failed responses.
 *
 * @param {Response} res - The fetch response object.
 * @returns {Promise<any>} Parsed JSON for successful responses.
 */
function processResponse(res) {
  if (res.ok) {
    return res.json();
  }

  return res
    .json()
    .then((data) => {
      const message = data?.error || data?.message || `HTTP ${res.status}`;
      return Promise.reject(message);
    })
    .catch(() => Promise.reject(`HTTP ${res.status}`));
}

/**
 * Fetches all decks for the authenticated user.
 *
 * @returns {Promise<Array>} A promise that resolves with deck objects.
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Deletes a deck by its id.
 *
 * @param {string} deckId - The deck _id to delete.
 * @returns {Promise<any>} API response payload.
 */
function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

/**
 * Creates a new deck in the database.
 *
 * @param {{name: string, color: string, cards: Array<{question: string, answer: string}>}} deckData - Deck payload.
 * @returns {Promise<Object>} The newly created deck object.
 */
function addDeck(deckData) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    headers,
    body: JSON.stringify(deckData),
  }).then(processResponse);
}

/**
 * Adds a card to a specific deck.
 *
 * @param {string} deckId - Deck _id that will own the card.
 * @param {{question: string, answer: string}} cardData - Card payload.
 * @returns {Promise<Object>} Newly created card.
 */
function addCard(deckId, cardData) {
  return fetch(`${baseUrl}/cards/${deckId}`, {
    method: "POST",
    headers,
    body: JSON.stringify(cardData),
  }).then(processResponse);
}

/**
 * Updates a card in place.
 *
 * @param {string} cardId - Card _id to update.
 * @param {{question: string, answer: string}} cardData - Updated card payload.
 * @returns {Promise<Object>} Updated card object.
 */
function updateCard(cardId, cardData) {
  return fetch(`${baseUrl}/cards/${cardId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(cardData),
  }).then(processResponse);
}

/**
 * Deletes a card by id.
 *
 * @param {string} cardId - Card _id to delete.
 * @returns {Promise<any>} API response payload.
 */
function deleteCard(cardId) {
  return fetch(`${baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

export { addCard, addDeck, deleteCard, deleteDeck, getDecks, updateCard };
