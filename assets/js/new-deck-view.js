import { addDeck } from "./api.js";
import { fetchedDecks } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const formEl = document.getElementById("new-deck-form");
const submitBtn = document.getElementById("new-deck-submit");
const textareaEl = document.getElementById("new-deck-json");
const errorModalEl = document.getElementById("error-modal");
const errorModalCloseBtnEl = document.getElementById("error-modal-dismiss");
const errorMessageEl = document.getElementById("error-modal-message");

/**
 * Returns a consistent lowercase hex color string with a leading "#".
 * Accepts values with or without a leading "#". Returns "#64d583" as a
 * fallback if the value is missing or not a valid 6-digit hex.
 *
 * @param {string|undefined} color
 * @returns {string}
 */
function normalizeColor(color) {
  if (!color) return "#64d583";
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (!HEX_DIGITS.test(hex)) return "#64d583";
  return "#" + hex.toLowerCase();
}

/**
 * Safely parses JSON and returns null for invalid JSON.
 *
 * @param {string} jsonString - JSON text from the form.
 * @returns {Object|null} Parsed value or null when parsing fails.
 */
function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

/**
 * Validates the deck name according to project constraints.
 *
 * @param {unknown} name - Value to validate.
 * @returns {string|null} Valid name as string or null.
 */
function validateName(name) {
  if (typeof name !== "string" || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

/**
 * Shows the shared error modal with a message.
 *
 * @param {string} message - Human-readable error text.
 */
export function showError(message) {
  if (!errorModalEl || !errorMessageEl) return;
  errorMessageEl.textContent = message;
  errorModalEl.classList.add("modal_visible");
}

/**
 * Closes and clears the shared error modal.
 */
function closeErrorModal() {
  if (!errorModalEl || !errorMessageEl) return;
  errorModalEl.classList.remove("modal_visible");
  errorMessageEl.textContent = "";
}

if (errorModalCloseBtnEl) {
  errorModalCloseBtnEl.addEventListener("click", closeErrorModal);
}

/**
 * Enables the new deck submit button when the form view is shown.
 */
export function disableSubmitBtn() {
  if (!submitBtn) return;
  submitBtn.disabled = false;
}

if (formEl && textareaEl) {
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData);

    const jsonData = parseJSON(values["cards-json"]);
    if (jsonData === null) {
      showError("Invalid JSON syntax. Please fix the JSON and try again.");
      return;
    }

    const validName = validateName(jsonData?.name);
    if (!validName) {
      showError(
        "Deck name is required and must be between 2 and 80 characters.",
      );
      return;
    }

    if (!Array.isArray(jsonData?.cards)) {
      showError("Cards are required and must be provided as an array.");
      return;
    }

    const color = normalizeColor(values["deck-color"]);
    if (
      typeof jsonData?.color === "string" &&
      jsonData.color.toLowerCase() !== color
    ) {
      showError(
        "The JSON color does not match the selected deck color. Please make them match.",
      );
      return;
    }

    const name = validName.trim();
    const cards = jsonData.cards;

    addDeck({
      name,
      color,
      cards,
    })
      .then((newDeck) => {
        fetchedDecks.push(newDeck);
        window.location.hash = `deck/${newDeck._id}`;
      })
      .catch(showError);
  });
}
