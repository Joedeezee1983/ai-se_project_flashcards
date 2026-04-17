// deck-view.js
// Responsible for rendering the deck (card group) view and its flashcards.

import { hexToString, removeColorClasses } from "./colors.js";
import { openModal } from "./modal.js";

export function createFlashcardEl(flashcardData, deckColorName) {
  const cardTemplate = document.getElementById("card-template");
  if (!cardTemplate) return null;

  const clone = cardTemplate.content.firstElementChild.cloneNode(true);

  const titleEl = clone.querySelector(".card__title");
  const flipBtn = clone.querySelector(".card__btn_type_flip");
  const deleteBtn = clone.querySelector(".card__btn_type_delete");

  // Set initial question text
  if (titleEl) titleEl.textContent = flashcardData.question;

  // Apply deck color
  removeColorClasses(clone);
  clone.classList.add(`card_color_${deckColorName}`);

  // Store color name for restoring later
  clone.dataset.colorName = deckColorName;
  clone.dataset.flipped = "false";

  // Flip logic
  if (flipBtn) {
    flipBtn.addEventListener("click", () => {
      const isFlipped = clone.dataset.flipped === "true";

      if (!isFlipped) {
        // Show answer
        titleEl.textContent = flashcardData.answer;

        removeColorClasses(clone);
        clone.classList.add("card_color_white");

        clone.dataset.flipped = "true";
      } else {
        // Show question
        titleEl.textContent = flashcardData.question;

        removeColorClasses(clone);
        clone.classList.add(`card_color_${clone.dataset.colorName}`);

        clone.dataset.flipped = "false";
      }
    });
  }

  // Delete button
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const confirmed = await openModal();
      if (!confirmed) return;
      const li = deleteBtn.closest(".card");
      if (li && li.parentNode) li.parentNode.removeChild(li);
    });
  }

  return clone;
}

export function renderDeckView(deck) {
  const cardsList = document.getElementById("cardsList");
  const deckView = document.getElementById("deck-view");
  const headerTitle = deckView?.querySelector(".gallery__title");

  if (headerTitle) headerTitle.textContent = deck.name;

  if (!cardsList) return;
  cardsList.innerHTML = "";

  // Convert deck.color hex → string name (e.g., "green")
  const deckColorName = hexToString(deck.color);

  deck.cards.forEach((card) => {
    const el = createFlashcardEl(card, deckColorName);
    if (el) cardsList.append(el);
  });
}
