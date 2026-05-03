import { hexToString, removeColorClasses } from "./colorMap.js";

/**
 * Renders and wires the practice carousel for a deck.
 *
 * @param {{name: string, color: string, cards: Array<{question: string, answer: string}>}} cardGroup - Deck data.
 */
export function renderCarouselView(cardGroup) {
  let currentIndex = 0;
  let showingQuestion = true;

  /**
   * Builds the title text for the current card position.
   *
   * @returns {string} Carousel title text.
   */
  function getCarouselTitle() {
    return `${cardGroup.name} · ${currentIndex + 1}/${cardGroup.cards.length}`;
  }

  const carousel = document.getElementById("carousel");
  if (!carousel) return;

  const titleEl = carousel.querySelector(".carousel__title");
  const cardEl = carousel.querySelector(".carousel__card");
  const cardText = carousel.querySelector(".carousel__card-text");

  let leftBtn = carousel.querySelector(".carousel__btn_type_left");
  let rightBtn = carousel.querySelector(".carousel__btn_type_right");
  let flipBtn = carousel.querySelector(".carousel__btn_type_flip");

  // -----------------------------
  // INTERNAL UPDATE FUNCTIONS
  // -----------------------------
  /**
   * Updates the carousel title element.
   */
  function updateTitle() {
    if (titleEl) titleEl.textContent = getCarouselTitle();
  }

  /**
   * Updates the card color based on side and deck color.
   */
  function updateColor() {
    if (!cardEl) return;

    removeColorClasses(cardEl);

    const colorName = hexToString(cardGroup.color);
    cardEl.classList.add(`carousel__card_color_${colorName}`);

    if (!showingQuestion) {
      cardEl.classList.add("carousel__card_color_white");
    }
  }

  /**
   * Updates disabled styles and states for navigation buttons.
   */
  function updateButtons() {
    if (!leftBtn || !rightBtn) return;

    const atStart = currentIndex === 0;
    const atEnd = currentIndex === cardGroup.cards.length - 1;

    leftBtn.disabled = atStart;
    rightBtn.disabled = atEnd;

    leftBtn.classList.toggle("carousel__btn_disabled", atStart);
    rightBtn.classList.toggle("carousel__btn_disabled", atEnd);
  }

  /**
   * Re-renders card text and button states for the current index.
   */
  function updateDisplay() {
    updateTitle();
    updateColor();
    updateButtons();

    const flashcard = cardGroup.cards[currentIndex];
    if (cardText) {
      cardText.textContent = showingQuestion
        ? flashcard.question
        : flashcard.answer;
    }
  }

  // -----------------------------
  // REMOVE OLD LISTENERS SAFELY
  // -----------------------------
  /**
   * Clones and replaces a button to remove any existing event listeners.
   *
   * @template {Element} T
   * @param {T|null} oldBtn - Existing button element.
   * @returns {T|null} Fresh clone that replaced the original.
   */
  function replaceBtn(oldBtn) {
    if (!oldBtn || !oldBtn.parentNode) return oldBtn;
    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    return newBtn;
  }

  leftBtn = replaceBtn(leftBtn);
  rightBtn = replaceBtn(rightBtn);
  flipBtn = replaceBtn(flipBtn);

  // -----------------------------
  // EVENT LISTENERS
  // -----------------------------
  if (leftBtn) {
    leftBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        showingQuestion = true;
        updateDisplay();
      }
    });
  }

  if (rightBtn) {
    rightBtn.addEventListener("click", () => {
      if (currentIndex < cardGroup.cards.length - 1) {
        currentIndex++;
        showingQuestion = true;
        updateDisplay();
      }
    });
  }

  if (flipBtn) {
    flipBtn.addEventListener("click", () => {
      showingQuestion = !showingQuestion;
      updateDisplay();
    });
  }

  // -----------------------------
  // INITIAL RENDER
  // -----------------------------
  updateDisplay();
}
