// --- START OF FILE content.js ---

(() => {
  console.log("[NoEnter] Extension loaded v1.7");

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
        } else if (event.target.isContentEditable || event.target.closest("[contenteditable='true']")) {
          const editableEl = event.target.closest("[contenteditable='true']") || event.target;
          const sel = window.getSelection();
          if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            
            const p = document.createElement("p");
            p.innerHTML = "<br>";
            range.insertNode(p);
            
            range.setStartAfter(p);
            range.setEndAfter(p);
            sel.removeAllRanges();
            sel.addRange(range);
            
            editableEl.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertParagraph" }));
          }
        }
      }
    }
  }

  function patchChatGPT() {
    const textarea = document.querySelector("#prompt-textarea");
    if (textarea && !textarea.dataset.enterPatchApplied) {
      textarea.addEventListener("keydown", handleEnterKey, true);
      textarea.dataset.enterPatchApplied = "true";
      console.log("[NoEnter] ChatGPT patched");
    }
  }

  function patchGemini() {
    const selectors = [
      "div.ql-editor.textarea[contenteditable='true']",
      "div.ql-editor[contenteditable='true']",
      "[contenteditable='true'].text-input-field",
      "rich-textarea [contenteditable='true']",
      ".input-area [contenteditable='true']",
      "[contenteditable='true'][aria-label*='prompt']",
      "[contenteditable='true'][data-placeholder]"
    ];
    for (const selector of selectors) {
      const inputDiv = document.querySelector(selector);
      if (inputDiv && !inputDiv.dataset.enterPatchApplied) {
        inputDiv.addEventListener("keydown", handleEnterKey, true);
        inputDiv.dataset.enterPatchApplied = "true";
        console.log("[NoEnter] Gemini patched with selector:", selector);
        return;
      }
    }
  }

  function patchClaude() {
    if (window.location.hostname !== "claude.ai" || window.__noEnterClaudePatched) return;
    window.__noEnterClaudePatched = true;
    
    const handler = (event) => {
      if (event.key !== "Enter") return;
      const target = event.target;
      if (!target.closest('[data-testid="chat-input"]') && !target.closest('.ProseMirror')) return;
      
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;
      
      if (ctrlOrCmd) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const sendBtn = document.querySelector('button[aria-label="Send message"]');
        if (sendBtn) sendBtn.click();
        return false;
      }
      
      if (!event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        document.execCommand("insertParagraph", false);
        console.log("[NoEnter] Claude: newline inserted");
        return false;
      }
    };
    
    document.addEventListener("keydown", handler, { capture: true, passive: false });
    window.addEventListener("keydown", handler, { capture: true, passive: false });
    console.log("[NoEnter] Claude patched (window+document level)");
  }

  const observer = new MutationObserver(() => {
    patchChatGPT();
    patchGemini();
    patchClaude();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  patchChatGPT();
  patchGemini();
  patchClaude();
})();

// --- END OF FILE content.js ---