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

// Convert a hex value to a color name used in CSS modifiers
export function hexToString(hex) {
  if (!hex) return "green";
  const lower = hex.toLowerCase();
  return HEX_TO_NAME[lower] || "green";
}

// Remove all color modifier classes from a card element
export function removeColorClasses(el) {
  if (!el || !el.classList) return;

  const classes = [...el.classList];
  classes.forEach((cls) => {
    if (cls.includes("_color_")) {
      el.classList.remove(cls);
    }
  });
}

// Build a card color modifier class from a hex value
export function cardColorModifierFromHex(hex) {
  return `card_color_${hexToString(hex)}`;
}
