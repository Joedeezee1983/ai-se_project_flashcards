// gallery.js
// Minimal gallery data and helper for the project (renamed from decks.js).

export const gallery = [
  {
    id: "card-1",
    name: "Biology Basics",
    color: "#6ab04c",
    cards: [
      {
        question: "What is a cell?",
        answer: "The basic structural unit of life.",
      },
      { question: "What carries genetic information?", answer: "DNA." },
    ],
  },
  {
    id: "card-2",
    name: "JavaScript",
    color: "#2f80ed",
    cards: [
      {
        question: "What is hoisting?",
        answer: "JavaScript's behavior of moving declarations to the top.",
      },
      {
        question: "What is a closure?",
        answer: "A function with access to its outer scope.",
      },
      {
        question: "Array method to map values?",
        answer: "Array.prototype.map()",
      },
    ],
  },
  {
    id: "card-3",
    name: "CSS Selectors",
    color: "#ff5b8a",
    cards: [
      { question: "Select by id?", answer: "Use #idName." },
      { question: "Select children?", answer: "> selector." },
    ],
  },
];

export function getGalleryByID(id) {
  return gallery.find((d) => d.id === id) || null;
}

export default gallery;
