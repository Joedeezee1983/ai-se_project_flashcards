// modal.js
// Shared confirmation modal utility.

const modal = document.getElementById("confirm-modal");
const confirmBtn = document.getElementById("modal-confirm");
const cancelBtn = document.getElementById("modal-cancel");
const overlay = modal?.querySelector(".modal__overlay");

let _resolveFn = null;

/**
 * Opens the confirmation modal and resolves to true/false based on user choice.
 *
 * @returns {Promise<boolean>} User confirmation result.
 */
function openModal() {
  if (!modal) return Promise.resolve(false);
  modal.classList.add("modal_open");

  return new Promise((resolve) => {
    _resolveFn = resolve;
  });
}

/**
 * Closes the confirmation modal and resolves the pending modal promise.
 *
 * @param {boolean} result - Confirmation result to resolve with.
 */
function closeModal(result) {
  if (!modal) return;
  modal.classList.remove("modal_open");
  if (_resolveFn) {
    _resolveFn(result);
    _resolveFn = null;
  }
}

if (confirmBtn) confirmBtn.addEventListener("click", () => closeModal(true));
if (cancelBtn) cancelBtn.addEventListener("click", () => closeModal(false));
if (overlay) overlay.addEventListener("click", () => closeModal(false));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal?.classList.contains("modal_open")) {
    closeModal(false);
  }
});

export { openModal };
