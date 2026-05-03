// deck-view.js
// Responsible for rendering the deck (card group) view and its flashcards.

import { addCard, deleteCard, updateCard } from "./api.js";
import { hexToString, removeColorClasses } from "./colorMap.js";
import { openModal } from "./modal.js";
import { showError } from "./new-deck-view.js";

/**
 * Validates and normalizes card text values from form inputs.
 *
 * @param {string} question - Question text.
 * @param {string} answer - Answer text.
 * @returns {{question: string, answer: string}|null} Sanitized payload or null.
 */
function validateCardPayload(question, answer) {
  const safeQuestion = String(question || "").trim();
  const safeAnswer = String(answer || "").trim();

  if (!safeQuestion || !safeAnswer) {
    return null;
  }

  return {
    question: safeQuestion,
    answer: safeAnswer,
  };
}

/**
 * Removes any temporary in-progress card editor in the deck list.
 *
 * @param {HTMLElement|null} cardsList - Deck cards list element.
 */
function clearActiveEditor(cardsList) {
  if (!cardsList) return;
  const activeEditor = cardsList.querySelector(".card_editor");
  if (activeEditor) {
    activeEditor.remove();
  }
}

/**
 * Creates an inline two-stage editor card for create/edit operations.
 *
 * @param {{deck: Object, cardsList: HTMLElement, deckColorName: string, existingCard?: Object, onDone: () => void}} config - Editor config.
 * @returns {HTMLLIElement} Editable card list item.
 */
function createCardEditorEl(config) {
  const { deck, cardsList, deckColorName, existingCard, onDone } = config;

  const item = document.createElement("li");
  item.className = `card card_color_${deckColorName} card_editor`;

  const form = document.createElement("form");
  form.className = "card__editor-form";

  const questionInput = document.createElement("input");
  questionInput.className = "card__editor-input";
  questionInput.type = "text";
  questionInput.name = "question";
  questionInput.placeholder = "Question";
  questionInput.required = true;
  questionInput.value = existingCard?.question || "";

  const answerInput = document.createElement("input");
  answerInput.className = "card__editor-input card__editor-input_hidden";
  answerInput.type = "text";
  answerInput.name = "answer";
  answerInput.placeholder = "Answer";
  answerInput.required = true;
  answerInput.value = existingCard?.answer || "";

  const row = document.createElement("div");
  row.className = "card__row card__row_editor";

  const flipBtn = document.createElement("button");
  flipBtn.type = "button";
  flipBtn.className = "card__btn card__btn_type_flip";
  flipBtn.setAttribute("aria-label", "Switch side");

  const checkBtn = document.createElement("button");
  checkBtn.type = "submit";
  checkBtn.className = "card__btn card__btn_type_check";
  checkBtn.setAttribute("aria-label", "Save card");

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "card__btn card__btn_type_delete";
  cancelBtn.setAttribute("aria-label", "Cancel editing");

  row.append(flipBtn, checkBtn, cancelBtn);
  form.append(questionInput, answerInput, row);
  item.append(form);

  let showingQuestion = true;

  /**
   * Toggles the visible editor input and its card color state.
   */
  function renderEditorSide() {
    const showQuestion = showingQuestion;

    questionInput.classList.toggle("card__editor-input_hidden", !showQuestion);
    answerInput.classList.toggle("card__editor-input_hidden", showQuestion);

    removeColorClasses(item);
    if (showQuestion) {
      item.classList.add(`card_color_${deckColorName}`);
      questionInput.focus();
    } else {
      item.classList.add("card_color_white");
      answerInput.focus();
    }
  }

  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;
    renderEditorSide();
  });

  cancelBtn.addEventListener("click", () => {
    item.remove();
    onDone();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = validateCardPayload(questionInput.value, answerInput.value);
    if (!payload) {
      showError("Both question and answer are required.");
      return;
    }

    if (existingCard?._id) {
      updateCard(existingCard._id, payload)
        .then((updatedCard) => {
          const index = deck.cards.findIndex(
            (card) => card._id === existingCard._id,
          );
          if (index !== -1) {
            deck.cards[index] = updatedCard;
          }
          onDone();
        })
        .catch(showError);
      return;
    }

    addCard(deck._id, payload)
      .then((newCard) => {
        deck.cards.push(newCard);
        onDone();
      })
      .catch(showError);
  });

  renderEditorSide();
  return item;
}

/**
 * Creates a deck-view flashcard list element.
 *
 * @param {{question: string, answer: string}} flashcardData - Card content.
 * @param {string} deckColorName - Color modifier name for the question side.
 * @param {{onDelete?: (cardId: string) => void}} [options] - Optional callbacks.
 * @returns {HTMLLIElement|null} Flashcard list item or null when template missing.
 */
export function createFlashcardEl(flashcardData, deckColorName, options = {}) {
  const { onDelete } = options;
  const cardTemplate = document.getElementById("card-template");
  if (!cardTemplate) return null;

  const clone = cardTemplate.content.firstElementChild.cloneNode(true);

  const titleEl = clone.querySelector(".card__title");
  const flipBtn = clone.querySelector(".card__btn_type_flip");
  const editBtn = clone.querySelector(".card__btn_type_edit");
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

      if (!flashcardData?._id) {
        const li = deleteBtn.closest(".card");
        if (li && li.parentNode) li.parentNode.removeChild(li);
        return;
      }

      deleteCard(flashcardData._id)
        .then(() => {
          const li = deleteBtn.closest(".card");
          if (li && li.parentNode) li.parentNode.removeChild(li);
          if (onDelete) onDelete(flashcardData._id);
        })
        .catch(showError);
    });
  }

  if (editBtn) {
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      clone.dispatchEvent(
        new CustomEvent("card:edit", {
          bubbles: true,
          detail: { card: flashcardData },
        }),
      );
    });
  }

  return clone;
}

/**
 * Renders all cards for a deck in the deck view.
 *
 * @param {{name: string, color: string, cards: Array<{question: string, answer: string}>}} deck - Deck data.
 */
export function renderDeckView(deck) {
  const cardsList = document.getElementById("cardsList");
  const deckView = document.getElementById("deck-view");
  const newCardBtn = cardsList?.querySelector(".gallery__new-card-btn");
  const headerTitle = deckView?.querySelector(".gallery__title");
  const newCardBtnLi = cardsList
    ?.querySelector(".gallery__new-card-btn")
    ?.closest(".gallery__new-card-item");

  if (headerTitle) headerTitle.textContent = deck.name;

  if (!cardsList) return;

  // Remove only card elements, preserve the "+ New Card" button <li>
  [...cardsList.querySelectorAll(".card")].forEach((el) => el.remove());

  // Convert deck.color hex → string name (e.g., "green")
  const deckColorName = hexToString(deck.color);

  const rerender = () => renderDeckView(deck);

  if (newCardBtn) {
    const safeNewCardBtn = newCardBtn.cloneNode(true);
    newCardBtn.parentNode.replaceChild(safeNewCardBtn, newCardBtn);
    safeNewCardBtn.addEventListener("click", () => {
      clearActiveEditor(cardsList);
      const editor = createCardEditorEl({
        deck,
        cardsList,
        deckColorName,
        onDone: rerender,
      });

      if (newCardBtnLi) {
        cardsList.insertBefore(editor, newCardBtnLi);
      } else {
        cardsList.append(editor);
      }
    });
  }

  deck.cards.forEach((card) => {
    const el = createFlashcardEl(card, deckColorName, {
      onDelete: (cardId) => {
        const index = deck.cards.findIndex(
          (deckCard) => deckCard._id === cardId,
        );
        if (index !== -1) {
          deck.cards.splice(index, 1);
        }
      },
    });
    if (el) {
      el.addEventListener("card:edit", (e) => {
        e.stopPropagation();
        clearActiveEditor(cardsList);

        const editor = createCardEditorEl({
          deck,
          cardsList,
          deckColorName,
          existingCard: e.detail.card,
          onDone: rerender,
        });

        cardsList.replaceChild(editor, el);
      });

      if (newCardBtnLi) {
        cardsList.insertBefore(el, newCardBtnLi);
      } else {
        cardsList.append(el);
      }
    }
  });
}
