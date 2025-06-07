// --- START OF FILE content.js ---

(() => {
  /**
   * Intercepts the Enter key to prevent form submission and insert a newline instead.
   */
  function handleEnterKey(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      // Prevent the default action (form submission) immediately
      event.preventDefault();
      event.stopImmediatePropagation();

      const textarea = event.target;
      const { selectionStart, selectionEnd, value = "" } = textarea; // FIXED: Default value prevents crash

      // Manually insert a newline character at the cursor position
      const newValue = value.substring(0, selectionStart) + "\n" + value.substring(selectionEnd);
      textarea.value = newValue;

      // Move the cursor to after the inserted newline
      const newCursorPosition = selectionStart + 1;
      textarea.selectionStart = newCursorPosition;
      textarea.selectionEnd = newCursorPosition;

      // Notify React of the manual change
      textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    }
  }

  /**
   * Finds the ChatGPT textarea and attaches the Enter key listener if not already attached.
   */
  function patchTextarea() {
    const textarea = document.querySelector("#prompt-textarea");
    
    // Only proceed if the textarea exists and has not been patched yet
    if (textarea && !textarea.dataset.enterPatchApplied) {
      textarea.addEventListener("keydown", handleEnterKey, true); // Use capture phase
      textarea.dataset.enterPatchApplied = "true";
    }
  }

  // Set up an observer to re-apply the patch if the textarea is recreated dynamically
  const observer = new MutationObserver((mutations) => {
    // Check if any added nodes contain the textarea or if the textarea itself was added
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        // A simple re-run is efficient due to the check inside patchTextarea
        patchTextarea();
        // If we find it, we can stop checking other mutations in this batch
        if (document.querySelector("#prompt-textarea[data-enter-patch-applied='true']")) {
            break;
        }
      }
    }
  });

  // Start observing the document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Run once on initial script load
  patchTextarea();

})();

// --- END OF FILE content.js ---