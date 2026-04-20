// Main entry for the app
import {
  hexToString,
  cardColorModifierFromHex,
  removeColorClasses,
} from "./colorMap.js";

import { gallery, getGalleryByID } from "./decks.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";
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
  if (link) link.href = `#gallery/${deckData.id}`;

  // Delete button — confirm then remove from DOM and gallery array
  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const confirmed = await openModal();
    if (!confirmed) return;
    const li = deleteBtn.closest(".card");
    if (li && li.parentNode) li.parentNode.removeChild(li);
    const idx = gallery.findIndex((d) => d.id === deckData.id);
    if (idx !== -1) gallery.splice(idx, 1);
  });

  return clone;
}

// The last <li> in decksList is the "+ New Deck" button
const newDeckBtnLi = decksList
  ?.querySelector(".gallery__new-card-btn")
  ?.closest(".gallery__new-card-item");

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

// ===============================
// CREATE FLASHCARD (DECK VIEW)
// ===============================
// Flashcard creation and deck-view rendering moved to `deck-view.js`.

// Deck view rendering moved to `deck-view.js` (imported above).

// ===============================
// INITIAL RENDER OF HOME VIEW
// ===============================
gallery.forEach(renderDeckCard);

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
    location.hash = `carousel/${currentDeck.id}`;
  });
}

// ===============================
// ROUTER
// ===============================
function handleHashChange() {
  const hash = location.hash.replace(/^#/, "");

  const home = document.getElementById("home");
  const deckView = document.getElementById("deck-view");
  const carousel = document.getElementById("carousel");
  const notfound = document.getElementById("not-found");
  const mainEl = document.getElementById("main");

  // Hide everything by default
  home.style.display = "none";
  deckView.style.display = "none";
  carousel.style.display = "none";
  notfound.style.display = "none";
  mainEl.classList.remove("page__main-content_carousel");
  document.body.classList.remove("page_has-bottom-bar");

  // HOME
  if (!hash || hash === "home") {
    currentDeck = null;
    home.style.display = "block";
    document.body.classList.add("page_has-bottom-bar");
    return;
  }

  // CAROUSEL
  if (hash.startsWith("carousel/")) {
    const id = hash.split("/")[1];
    const deck = getGalleryByID(id);

    if (deck) {
      carousel.style.display = "block";
      mainEl.classList.add("page__main-content_carousel");
      renderCarouselView(deck);
      return;
    }

    notfound.style.display = "block";
    return;
  }

  // DECK VIEW
  if (hash.startsWith("gallery/")) {
    const id = hash.split("/")[1];
    const deck = getGalleryByID(id);

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

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange);
