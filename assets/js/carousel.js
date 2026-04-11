import { hexToString, removeColorClasses } from "./colors.js";

let currentIndex = 0;
let showingQuestion = true;

function getCarouselTitleString(deck, currentIndex) {
  return `${deck.name} · ${currentIndex + 1}/${deck.cards.length}`;
}

export function renderCarouselView(deck) {
  const carouselSection = document.getElementById("carousel");
  if (!carouselSection) return;

  const titleEl = carouselSection.querySelector(".carousel__title");
  let leftBtn = carouselSection.querySelector(".carousel__btn_type_left");
  let rightBtn = carouselSection.querySelector(".carousel__btn_type_right");
  let flipBtn = carouselSection.querySelector(".carousel__btn_type_flip");
  const cardEl = carouselSection.querySelector(".carousel__card");
  const cardText = carouselSection.querySelector(".carousel__card-text");

  currentIndex = 0;
  showingQuestion = true;

  function updateTitle() {
    if (!titleEl) return;
    titleEl.textContent = getCarouselTitleString(deck, currentIndex);
  }

  function updateColor() {
    if (!cardEl) return;
    removeColorClasses(cardEl);
    const colorName = hexToString(deck.color);
    cardEl.classList.add(`carousel__card_color_${colorName}`);
    if (!showingQuestion) {
      cardEl.classList.add("carousel__card_color_white");
    }
  }

  function updateButtons() {
    if (!leftBtn || !rightBtn) return;

    if (currentIndex === 0) {
      leftBtn.disabled = true;
      leftBtn.classList.add("carousel__btn_disabled");
    } else {
      leftBtn.disabled = false;
      leftBtn.classList.remove("carousel__btn_disabled");
    }

    if (currentIndex === deck.cards.length - 1) {
      rightBtn.disabled = true;
      rightBtn.classList.add("carousel__btn_disabled");
    } else {
      rightBtn.disabled = false;
      rightBtn.classList.remove("carousel__btn_disabled");
    }
  }

  function updateDisplay() {
    updateTitle();
    updateColor();
    updateButtons();

    const card = deck.cards[currentIndex];
    if (!cardText) return;

    cardText.textContent = showingQuestion ? card.question : card.answer;
  }

  // Remove previous listeners by replacing buttons with clones
  if (leftBtn && leftBtn.parentNode) {
    const newLeft = leftBtn.cloneNode(true);
    leftBtn.parentNode.replaceChild(newLeft, leftBtn);
    leftBtn = newLeft;
  }

  if (rightBtn && rightBtn.parentNode) {
    const newRight = rightBtn.cloneNode(true);
    rightBtn.parentNode.replaceChild(newRight, rightBtn);
    rightBtn = newRight;
  }

  if (flipBtn && flipBtn.parentNode) {
    const newFlip = flipBtn.cloneNode(true);
    flipBtn.parentNode.replaceChild(newFlip, flipBtn);
    flipBtn = newFlip;
  }

  // Ensure icons are visible by setting explicit background images and size
  if (leftBtn) {
    leftBtn.style.backgroundImage = "url('./assets/images/left.svg')";
    leftBtn.style.backgroundSize = "20px 20px";
  }

  if (rightBtn) {
    rightBtn.style.backgroundImage = "url('./assets/images/right.svg')";
    rightBtn.style.backgroundSize = "20px 20px";
  }

  if (flipBtn) {
    flipBtn.style.backgroundImage = "url('./assets/images/flip.svg')";
    flipBtn.style.backgroundSize = "20px 20px";
  }

  // Handlers
  if (leftBtn) {
    leftBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        showingQuestion = true;
        updateDisplay();
      }
    });
  }

  if (rightBtn) {
    rightBtn.addEventListener("click", () => {
      if (currentIndex < deck.cards.length - 1) {
        currentIndex += 1;
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

  // Initial display
  updateDisplay();
}

export default { renderCarouselView };
