// Main entry for the app
import {
  hexToString,
  deckColorModifierFromHex,
  removeColorClasses,
} from "./colors.js";

import { decks, getDeckByID } from "./decks.js";
import { renderCarouselView } from "./carousel.js";

// Selectors
const decksList = document.getElementById("decksList");
const deckTemplate = document.getElementById("deck-template");

// Safety check: prevent crashes if template is missing
if (!deckTemplate) {
  console.error(
    "ERROR: <template id='deck-template'> is missing in index.html",
  );
}

// Create a deck element from the template
function createDeckEl(deckData) {
  if (!deckTemplate) return null;

  const clone = deckTemplate.content.firstElementChild.cloneNode(true);

  const titleEl = clone.querySelector(".deck__title");
  const countEl = clone.querySelector(".deck__count");
  const deleteBtn = clone.querySelector(".deck__delete-btn");
  const link = clone.querySelector(".deck__link");

  titleEl.textContent = deckData.name;
  countEl.textContent = `${deckData.cards.length} cards`;

  // Apply color modifier
  const colorMod = deckColorModifierFromHex(deckData.color);
  clone.classList.remove("deck_color_green");
  clone.classList.add(colorMod);

  // Link to carousel
  if (link) link.href = `#carousel/${deckData.id}`;

  // Delete button removes element from DOM
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const li = deleteBtn.closest(".deck");
    if (li && li.parentNode) li.parentNode.removeChild(li);
  });

  return clone;
}

// Render a deck into the list
function renderDeckEl(deckData) {
  const el = createDeckEl(deckData);
  if (el && decksList) decksList.prepend(el);
}

// Render all decks
decks.forEach(renderDeckEl);

// New deck button animation (placeholder)
const newDeckBtn = document.querySelector(".decks__new-deck-btn");
if (newDeckBtn) {
  newDeckBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    newDeckBtn.classList.add("decks__new-deck-btn_clicked");
    setTimeout(
      () => newDeckBtn.classList.remove("decks__new-deck-btn_clicked"),
      300,
    );
  });
}

// Delegated click handler for deck links
if (decksList) {
  decksList.addEventListener("click", (e) => {
    const link = e.target.closest(".deck__link");
    if (link) {
      e.preventDefault();
      const href = link.getAttribute("href") || "#";
      const newHash = href.replace(/^#/, "");
      location.hash = newHash;
    }
  });
}

// Basic hash router
function handleHashChange() {
  const hash = location.hash.replace(/^#/, "");
  const homeSection = document.getElementById("home");
  const carouselSection = document.getElementById("carousel");
  const notfound = document.getElementById("notfound");
  const mainEl = document.getElementById("main");

  // Home route
  if (!hash || hash === "home") {
    homeSection.style.display = "block";
    carouselSection.style.display = "none";
    notfound.style.display = "none";
    if (mainEl) mainEl.classList.remove("page__main-content_carousel");
    return;
  }

  // Carousel route
  if (hash.startsWith("carousel/")) {
    const id = hash.split("/")[1];
    const deck = getDeckByID(id);

    if (deck) {
      homeSection.style.display = "none";
      carouselSection.style.display = "block";
      notfound.style.display = "none";
      if (mainEl) mainEl.classList.add("page__main-content_carousel");
      renderCarouselView(deck);
      return;
    }

    // Deck not found
    homeSection.style.display = "none";
    carouselSection.style.display = "none";
    notfound.style.display = "block";
    if (mainEl) mainEl.classList.remove("page__main-content_carousel");
    return;
  }

  // Fallback: not found
  homeSection.style.display = "none";
  carouselSection.style.display = "none";
  notfound.style.display = "block";
  if (mainEl) mainEl.classList.remove("page__main-content_carousel");
}

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange);
