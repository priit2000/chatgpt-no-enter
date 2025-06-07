// The core function to block the Enter key.
// It stops the event before it reaches ChatGPT's own handlers.
function blockEnter(event) {
  // Target the "Enter" key, but only when "Shift" is not pressed.
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); // Prevent the default action (submitting the form).
    event.stopImmediatePropagation(); // Stop any other event listeners on this element from running.
  }
}

// Finds the ChatGPT textarea and applies the event listener if it hasn't been applied yet.
function patchTextarea() {
  // Use the specific ID for the textarea to be more robust.
  const textarea = document.querySelector("#prompt-textarea");

  // Check if the textarea exists and if we haven't already patched it.
  if (textarea && !textarea.dataset.enterBlocked) {
    // Add the event listener in the "capture" phase (the `true` argument).
    // This ensures our listener runs before the default page listeners.
    textarea.addEventListener("keydown", blockEnter, true);

    // Mark the textarea as patched to avoid adding the listener multiple times.
    textarea.dataset.enterBlocked = "true";
  }
}

// ChatGPT is a single-page application (SPA), which means it dynamically
// adds and removes elements from the page. A MutationObserver is the
// best way to detect when the textarea is added to the DOM.
const observer = new MutationObserver((mutations) => {
  // We can optimize by checking if new nodes were added, but simply
  // running patchTextarea() is effective and simple.
  patchTextarea();
});

// Start observing the entire document for changes to the element tree.
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Run the patch function once on script load, in case the
// textarea is already present when the script is injected.
patchTextarea();