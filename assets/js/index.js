// Main entry for the app
import { cardColorModifierFromHex } from "./colorMap.js";

import { deleteDeck, getDecks } from "./api.js";
import { fetchedDecks, getDeckByID, removeDeckByID } from "./decks.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
import { disableSubmitBtn, showError } from "./new-deck-view.js";
import { openModal } from "./modal.js";

const CLICK_ANIMATION_MS = 300;

// ===============================
// SELECTORS (UPDATED TO MATCH HTML)
// ===============================

// Home view list of decks
const decksList = document.getElementById("decksList");

// Template for deck cards (keeps original ID per lesson)
const deckTemplate = document.getElementById("deck-template");

// Deck-view list of flashcards is handled in deck-view.js

// Track the currently opened deck (fixes memory leak)
let currentDeck = null;

// ===============================
// CREATE DECK CARD (HOME VIEW)
// ===============================
/**
 * Creates a home-view deck card element from template data.
 *
 * @param {{_id: string, name: string, color: string, cards: Array}} deckData - Deck object.
 * @returns {HTMLLIElement|null} Render-ready list item or null.
 */
function createDeckCardEl(deckData) {
  if (!deckTemplate) return null;

  const clone = deckTemplate.content.firstElementChild.cloneNode(true);

  const titleEl = clone.querySelector(".card__title");
  const countEl = clone.querySelector(".card__count");
  const deleteBtn = clone.querySelector(".card__btn_type_delete");
  const link = clone.querySelector(".card__link");

  titleEl.textContent = deckData.name;
  countEl.textContent = `${deckData.cards.length} cards`;

  // Apply color modifier
  const colorMod = cardColorModifierFromHex(deckData.color);
  clone.classList.remove("card_color_green");
  clone.classList.add(colorMod);

  // Link to deck-view
  if (link) link.href = `#deck/${deckData._id}`;

  // Delete button — confirm, delete from API, then remove from DOM/cache
  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const confirmed = await openModal();
    if (!confirmed) return;

    deleteDeck(deckData._id)
      .then(() => {
        const li = deleteBtn.closest(".card");
        if (li && li.parentNode) li.parentNode.removeChild(li);
        removeDeckByID(deckData._id);
      })
      .catch(showError);
  });

  return clone;
}

// The last <li> in decksList is the "+ New Deck" button
const newDeckBtnLi = decksList
  ?.querySelector(".gallery__new-card-btn")
  ?.closest(".gallery__new-card-item");

/**
 * Renders a single deck card in the home list.
 *
 * @param {Object} deckData - Deck data.
 */
function renderDeckCard(deckData) {
  const el = createDeckCardEl(deckData);
  if (el && decksList) {
    if (newDeckBtnLi) {
      decksList.insertBefore(el, newDeckBtnLi);
    } else {
      decksList.append(el);
    }
  }
}

/**
 * Clears rendered deck cards while preserving the new deck button list item.
 */
function clearDeckCards() {
  if (!decksList) return;
  [...decksList.querySelectorAll(".card")].forEach((el) => el.remove());
}

/**
 * Renders the home view deck list from the fetched cache.
 */
function renderHomeView() {
  clearDeckCards();
  fetchedDecks.forEach(renderDeckCard);
}

// ===============================
// CREATE FLASHCARD (DECK VIEW)
// ===============================
// Flashcard creation and deck-view rendering moved to `deck-view.js`.

// Deck view rendering moved to `deck-view.js` (imported above).

// ===============================
// NEW CARD BUTTON ANIMATION
// ===============================
document.querySelectorAll(".gallery__new-card-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.add("gallery__new-card-btn_clicked");
    setTimeout(
      () => btn.classList.remove("gallery__new-card-btn_clicked"),
      CLICK_ANIMATION_MS,
    );
  });
});

const homeNewDeckBtn = document.querySelector("#home .gallery__new-card-btn");

if (homeNewDeckBtn) {
  homeNewDeckBtn.addEventListener("click", () => {
    location.hash = "new-deck";
  });
}

// ===============================
// DELEGATED CLICK HANDLER FOR DECK LINKS
// ===============================
if (decksList) {
  decksList.addEventListener("click", (e) => {
    const link = e.target.closest(".card__link");
    if (link) {
      e.preventDefault();
      const href = link.getAttribute("href") || "#";
      location.hash = href.replace(/^#/, "");
    }
  });
}

// ===============================
// PRACTICE BUTTON (GLOBAL LISTENER)
// ===============================
const practiceBtn = document.querySelector(".gallery__practice-btn");

if (practiceBtn) {
  practiceBtn.addEventListener("click", () => {
    if (!currentDeck) return;
    location.hash = `carousel/${currentDeck._id}`;
  });
}

// ===============================
// ROUTER
// ===============================
/**
 * Hash-based router that toggles visible app views.
 */
function router() {
  const hash = location.hash.replace(/^#/, "");

  const home = document.getElementById("home");
  const about = document.getElementById("about");
  const newDeckView = document.getElementById("new-deck-view");
  const deckView = document.getElementById("deck-view");
  const carousel = document.getElementById("carousel");
  const notfound = document.getElementById("not-found");
  const mainEl = document.getElementById("main");

  // Hide everything by default
  home.style.display = "none";
  about.style.display = "none";
  newDeckView.style.display = "none";
  deckView.style.display = "none";
  carousel.style.display = "none";
  notfound.style.display = "none";
  mainEl.classList.remove("page__main-content_carousel");
  document.body.classList.remove("page_has-bottom-bar");

  // HOME
  if (!hash || hash === "home") {
    currentDeck = null;
    home.style.display = "block";
    renderHomeView();
    document.body.classList.add("page_has-bottom-bar");
    return;
  }

  // ABOUT VIEW
  if (hash === "about") {
    currentDeck = null;
    about.style.display = "block";
    return;
  }

  // NEW DECK VIEW
  if (hash === "new-deck" || hash === "new-deck-view") {
    currentDeck = null;
    newDeckView.style.display = "block";
    disableSubmitBtn();
    return;
  }

  // CAROUSEL
  if (hash.startsWith("carousel/")) {
    const id = hash.split("/")[1];
    const deck = getDeckByID(id);

    if (deck) {
      carousel.style.display = "flex";
      mainEl.classList.add("page__main-content_carousel");
      renderCarouselView(deck);
      return;
    }

    notfound.style.display = "block";
    return;
  }

  // DECK VIEW
  if (hash.startsWith("deck/")) {
    const id = hash.split("/")[1];
    const deck = getDeckByID(id);

    if (deck) {
      currentDeck = deck;
      deckView.style.display = "block";
      document.body.classList.add("page_has-bottom-bar");
      renderDeckView(deck);
      return;
    }

    notfound.style.display = "block";
    return;
  }

  // FALLBACK
  notfound.style.display = "block";
}

window.addEventListener("hashchange", router);

window.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((decks) => {
      fetchedDecks.push(...decks);
      renderHomeView();
    })
    .catch(() => {
      showError("Can't fetch decks");
    })
    .finally(() => {
      router();
    });
});
