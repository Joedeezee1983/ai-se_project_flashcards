import { gallery } from "./decks.js";

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

const formEl = document.getElementById("new-deck-form");
const submitBtn = document.getElementById("new-deck-submit");
const textareaEl = document.getElementById("new-deck-json");
const errorModalEl = document.getElementById("error-modal");
const errorModalCloseBtnEl = document.getElementById("error-modal-dismiss");
const errorMessageEl = document.getElementById("error-modal-message");

/**
 * Converts a string to a URL-safe slug: lowercase with any run of
 * non-alphanumeric characters replaced by a single hyphen, and no leading or
 * trailing hyphens.
 *
 * @param {string} str
 * @returns {string}
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

function validateName(name) {
  if (typeof name !== "string" || name.length < 2 || name.length > 80) {
    return null;
  }
  return name;
}

function showError(message) {
  if (!errorModalEl || !errorMessageEl) return;
  errorMessageEl.textContent = message;
  errorModalEl.classList.add("modal_visible");
}

function closeErrorModal() {
  if (!errorModalEl || !errorMessageEl) return;
  errorModalEl.classList.remove("modal_visible");
  errorMessageEl.textContent = "";
}

if (errorModalCloseBtnEl) {
  errorModalCloseBtnEl.addEventListener("click", closeErrorModal);
}

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
    const id = `${slugify(name)}-${Date.now()}`;

    const deck = {
      id,
      color,
      name,
      cards,
    };

    gallery.push(deck);
    window.location.hash = `gallery/${id}`;
  });
}
