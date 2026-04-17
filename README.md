⭐ Flashcard App
GitHub Repository:  
https://github.com/Joedeezee1983/ai-se_project_flashcards (github.com in Bing)

My first project in TripleTen’s AI‑Assisted Software Engineering program.
This application displays decks of flashcards that users can flip through in a clean, interactive carousel interface. It’s designed to help users study concepts quickly and intuitively.

🎥 Project Pitch Video
Watch my walkthrough and explanation of the project:
https://drive.google.com/file/d/1Gm-LD4Efb7RP9dXfixpdAVFwYk4SmH12/view?usp=sharing

🚀 Live Demo
View the deployed project:
https://joedeezee1983.github.io/ai-se_project_flashcards

🧩 Features
Core Features
Interactive flashcard carousel

Clean, responsive layout

Simple navigation between cards

Beginner‑friendly code structure for future expansion

🆕 Features Added in Parts 4 & 5

1. Deck View (New Section)
   A dedicated Deck View now displays all flashcards belonging to a selected deck.

Key behaviors:

Renders cards using an HTML <template>

Displays the deck’s name as the section title

Supports deleting individual cards

Uses textContent for safe rendering

Prevents duplicated cards when revisiting

Avoids duplicate event listeners with a single global Practice button listener

2. Flashcard Interactions
   Each flashcard now supports:

Flip behavior (question ↔ answer)

Dynamic background colors

Question side uses the deck’s color

Answer side uses white

Delete button removes the card from the DOM

3. Carousel (Practice Mode)
   A fully interactive practice carousel with:

Left/right navigation with disabled states

Flip button to toggle between question and answer

Background color matching the deck

Clean rendering using <template>

No duplicate listeners thanks to cloneNode(true)

Hash‑based routing (#carousel/:id)

4. Dynamic Hash Router
   Supports:

#home — Home/Gallery view

#gallery/:id — Deck View

#carousel/:id — Practice Carousel

#notfound — 404 fallback

Router behavior:

Hides all sections by default

Shows only the active one

Applies a special layout class during carousel mode

5. Responsive Improvements
   Mobile‑friendly layout:

Carousel buttons pinned to the bottom on small screens

Carousel card shrinks to fit mobile view

Media queries added at max-width: 480px

Matches the Figma mobile design

6. Code Quality Improvements
   Replaced the “magic number” 300 with a named constant

Removed stray desktop.ini

Moved renderDeckView() into its own module

Ensured all new IDs are unique and BEM‑compliant

Organized CSS by BEM blocks

Added hover states to all interactive elements

7. Security & Best Practices
   All dynamic text uses textContent

Event listeners attached only once

DOM cleared before re‑rendering

Templates ensure safe, consistent markup

🛠 Technologies Used
HTML — structure

CSS — layout, BEM organization, responsive design

JavaScript — interactivity, routing, rendering

Prettier — consistent formatting

▶️ How to Run the Project
Clone or download the repository

Open index.html in any modern browser

No additional setup required

🔮 Future Improvements
Add multiple decks with category selection

Add animations for card flips

Add local storage to save progress

Add keyboard navigation for accessibility
