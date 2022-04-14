/// <reference types="chrome"/>

import Fuse from "fuse.js";

chrome.runtime.onMessage.addListener((state) => {
  // Get all inputs
  const inputs = [...document.querySelectorAll("input")];
  // Map searchable properties in Fuse
  const fuse = new Fuse(inputs, {
    keys: ["name", "class", "id", "type", "placeholder"],
    minMatchCharLength: 4,
    findAllMatches: true,
    distance: 0,
    threshold: 0.4,
  });
  // Search for each property given by the frontend and fill any matching input fields
  Object.keys(state).forEach((key) => {
    fuse.search(key).forEach(({ item: input }) => {
      input.value = state.email;
      const newEvent = new Event("input", { bubbles: true });
      input.dispatchEvent(newEvent);
    });
  });
  return true;
});
