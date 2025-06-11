// --- START OF FILE content.js ---

(() => {
  function handleEnterKey(event) {
    const isMac = navigator.platform.toUpperCase().includes("MAC");
    const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

    if (event.key === "Enter") {
      if (ctrlOrCmd) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const sendButton =
          document.querySelector('[data-testid="send-button"]') ||
          document.querySelector("button.send-button");
        if (sendButton) sendButton.click();
      } else if (!event.shiftKey) {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (event.target.tagName === "TEXTAREA") {
          const textarea = event.target;
          const { selectionStart, selectionEnd, value = "" } = textarea;
          const newValue = value.substring(0, selectionStart) + "\n" + value.substring(selectionEnd);
          textarea.value = newValue;
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
        } else if (event.target.isContentEditable) {
          const sel = window.getSelection();
          const range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode("\n"));
          range.collapse(false);
        }
      }
    }
  }

  function patchChatGPT() {
    const textarea = document.querySelector("#prompt-textarea");
    if (textarea && !textarea.dataset.enterPatchApplied) {
      textarea.addEventListener("keydown", handleEnterKey, true);
      textarea.dataset.enterPatchApplied = "true";
    }
  }

  function patchGemini() {
    const inputDiv = document.querySelector("div.ql-editor.textarea[contenteditable='true']");
    if (inputDiv && !inputDiv.dataset.enterPatchApplied) {
      inputDiv.addEventListener("keydown", handleEnterKey, true);
      inputDiv.dataset.enterPatchApplied = "true";
    }
  }

  const observer = new MutationObserver(() => {
    patchChatGPT();
    patchGemini();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  patchChatGPT();
  patchGemini();
})();

// --- END OF FILE content.js ---