/// <reference types="chrome"/>

import Fuse from "fuse.js";

chrome.runtime.onMessage.addListener((state) => {
  // Get all inputs
  const inputs = [...document.querySelectorAll("input")];
  // Map searchable properties in Fuse
  const fuse = new Fuse(inputs, {
    keys: ["name", "class", "id", "type", "placeholder", "aria-label"],
    // Add settings to adjust these
    minMatchCharLength: 4,
    distance: 4,
    threshold: 0.32,
    ignoreLocation: true,
  });

  [...document.querySelectorAll("select")].forEach((select) => {
    select.selectedIndex = Math.floor(Math.random() * select.length);
    const newEvent = new Event("change", { bubbles: true });
    select.dispatchEvent(newEvent);
  });

  inputs.forEach((input: any) => {
    if (input.type === "radio" || input.type === "checkbox") {
      input.click();
    }
  });

  // Search for each property given by the frontend and fill any matching input fields
  Object.keys(state).forEach((key) => {
    fuse.search(key).forEach(({ item: input }) => {
      input.value = state[key];
      const newEvent = new Event("input", { bubbles: true });
      input.dispatchEvent(newEvent);
    });
  });
  return true;
});

export default {};
