// colorMap.js
// Utilities for mapping hex colors to modifier names and cleaning color classes.

export const HEX_TO_NAME = {
  "#64d583": "green",
  "#91a8f9": "blue",
  "#ee92d7": "pink",
  "#aa8ef0": "purple",
  "#ee955e": "orange",
  "#f5d770": "yellow",
  "#ffffff": "white",
};

/**
 * Converts a hex color to its known modifier name.
 *
 * @param {string} hex - Hex color string.
 * @returns {string} Known color name, defaulting to "green".
 */
export function hexToString(hex) {
  if (!hex) return "green";
  const lower = hex.toLowerCase();
  return HEX_TO_NAME[lower] || "green";
}

/**
 * Removes all BEM color modifier classes from an element.
 *
 * @param {Element|null} el - Element to clean.
 */
export function removeColorClasses(el) {
  if (!el || !el.classList) return;

  const classes = [...el.classList];
  classes.forEach((cls) => {
    if (cls.includes("_color_")) {
      el.classList.remove(cls);
    }
  });
}

/**
 * Builds a card color class name from a hex color.
 *
 * @param {string} hex - Hex color string.
 * @returns {string} Card color class name.
 */
export function cardColorModifierFromHex(hex) {
  return `card_color_${hexToString(hex)}`;
}
