// colors.js
// Small color utilities for mapping hex colors to string names and cleaning classes.

const HEX_TO_NAME = {
  "#6ab04c": "green",
  "#2f80ed": "blue",
  "#ff5b8a": "pink",
  "#f2994a": "orange",
  "#f2c94c": "yellow",
  "#ffffff": "white",
};

export function hexToString(hex) {
  if (!hex) return "green";
  const lower = hex.toLowerCase();
  return HEX_TO_NAME[lower] || "green";
}

export function removeColorClasses(el) {
  if (!el || !el.classList) return;

  // Clone the class list using spread syntax
  const classes = [...el.classList];

  classes.forEach((cls) => {
    if (cls.includes("_color_")) {
      el.classList.remove(cls);
    }
  });
}

export function deckColorModifierFromHex(hex) {
  return `deck_color_${hexToString(hex)}`;
}

export default { hexToString, removeColorClasses, deckColorModifierFromHex };
