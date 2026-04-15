// deck-view.js
// Responsible for rendering the deck (card group) view and its flashcards.

export function createFlashcardEl(flashcardData) {
  const cardTemplate = document.getElementById("card-template");
  if (!cardTemplate) return null;

  const clone = cardTemplate.content.firstElementChild.cloneNode(true);

  const titleEl = clone.querySelector(".card__title");
  const actionBtn = clone.querySelector(".card__action-btn");
  const deleteBtn = clone.querySelector(".card__btn_type_delete"); // FIXED

  if (titleEl) titleEl.textContent = flashcardData.question;

  if (actionBtn) {
    actionBtn.addEventListener("click", () => {
      if (actionBtn.dataset.showing === "answer") {
        if (titleEl) titleEl.textContent = flashcardData.question;
        actionBtn.textContent = "Show answer";
        actionBtn.dataset.showing = "question";
      } else {
        if (titleEl) titleEl.textContent = flashcardData.answer;
        actionBtn.textContent = "Show question";
        actionBtn.dataset.showing = "answer";
      }
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
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

  deck.cards.forEach((card) => {
    const el = createFlashcardEl(card);
    if (el) cardsList.prepend(el);
  });
}

export default { createFlashcardEl, renderDeckView };
