// --- START OF FILE content.js ---

(() => {
  console.log("[NoEnter] Extension loaded v1.10");

  function patchChatGPT() {
    if (!window.location.hostname.includes("chatgpt.com") && !window.location.hostname.includes("chat.openai.com")) return;
    if (window.__noEnterChatGPTPatched) return;
    window.__noEnterChatGPTPatched = true;

    const handler = (event) => {
      if (event.key !== "Enter") return;
      
      const target = event.target;
      const isProseMirror = target.classList?.contains("ProseMirror") || target.closest(".ProseMirror");
      const isPromptTextarea = target.id === "prompt-textarea" || target.closest("#prompt-textarea");
      if (!isProseMirror && !isPromptTextarea) return;

      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      if (ctrlOrCmd) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        const editor = target.closest(".ProseMirror") || target;
        const html = editor.innerHTML;
        const fixedHtml = html.replace(/<br\s*\/?>/gi, '</p><p><br class="ProseMirror-trailingBreak">');
        editor.innerHTML = fixedHtml;
        editor.dispatchEvent(new InputEvent("input", { bubbles: true }));
        
        setTimeout(() => {
          const sendButton = document.querySelector('[data-testid="send-button"]') || document.querySelector("button.send-button");
          if (sendButton) sendButton.click();
        }, 10);
        return false;
      }

      if (!event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }
    };

    const insertNewline = (event) => {
      if (event.key !== "Enter") return;
      const target = event.target;
      const isProseMirror = target.classList?.contains("ProseMirror") || target.closest(".ProseMirror");
      const isPromptTextarea = target.id === "prompt-textarea" || target.closest("#prompt-textarea");
      if (!isProseMirror && !isPromptTextarea) return;
      
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;
      
      if (!ctrlOrCmd && !event.shiftKey) {
        const editor = target.closest(".ProseMirror") || target;
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const br = document.createElement("br");
          range.insertNode(br);
          range.setStartAfter(br);
          range.setEndAfter(br);
          sel.removeAllRanges();
          sel.addRange(range);
          editor.dispatchEvent(new InputEvent("input", { bubbles: true }));
          console.log("[NoEnter] ChatGPT: newline inserted via keyup");
        }
      }
    };

    document.addEventListener("keydown", handler, { capture: true, passive: false });
    document.addEventListener("keyup", insertNewline, { capture: true, passive: false });
    console.log("[NoEnter] ChatGPT patched (window+document level)");
  }

  function patchGemini() {
    if (!window.location.hostname.includes("gemini.google.com")) return;
    if (window.__noEnterGeminiPatched) return;
    window.__noEnterGeminiPatched = true;

    const handler = (event) => {
      if (event.key !== "Enter") return;
      
      const target = event.target;
      const isGeminiInput = target.closest(".ql-editor") || 
                            target.closest("rich-textarea") || 
                            target.closest(".input-area") ||
                            (target.isContentEditable && target.closest("[data-placeholder]"));
      if (!isGeminiInput) return;

      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      if (ctrlOrCmd) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const sendButton = document.querySelector('[aria-label="Send message"]') || 
                          document.querySelector('button.send-button') ||
                          document.querySelector('[data-test-id="send-button"]');
        if (sendButton) sendButton.click();
        return false;
      }

      if (!event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        document.execCommand("insertParagraph", false);
        console.log("[NoEnter] Gemini: newline inserted");
        return false;
      }
    };

    document.addEventListener("keydown", handler, { capture: true, passive: false });
    window.addEventListener("keydown", handler, { capture: true, passive: false });
    console.log("[NoEnter] Gemini patched (window+document level)");
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

  function patchCopilot() {
    if (!window.location.hostname.includes("copilot.microsoft.com")) return;
    if (window.__noEnterCopilotPatched) return;
    window.__noEnterCopilotPatched = true;

    const handler = (event) => {
      if (event.key !== "Enter") return;

      const target = event.target;
      const isCopilotInput = target.id === "userInput" ||
                             target.closest('[data-testid="composer-input"]') ||
                             target.closest('[data-testid="composer-content"]');
      if (!isCopilotInput) return;

      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      if (ctrlOrCmd) {
        // No send button in Copilot - let the native Enter through by not blocking
        return;
      }

      if (!event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const textarea = target.tagName === "TEXTAREA" ? target : document.getElementById("userInput");
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const value = textarea.value;
          textarea.value = value.substring(0, start) + "\n" + value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 1;
          textarea.dispatchEvent(new InputEvent("input", { bubbles: true }));
          console.log("[NoEnter] Copilot: newline inserted");
        }
        return false;
      }
    };

    document.addEventListener("keydown", handler, { capture: true, passive: false });
    window.addEventListener("keydown", handler, { capture: true, passive: false });
    console.log("[NoEnter] Copilot patched (window+document level)");
  }

  patchChatGPT();
  patchGemini();
  patchClaude();
  patchCopilot();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      patchChatGPT();
      patchGemini();
      patchClaude();
      patchCopilot();
    });
  }
})();

// --- END OF FILE content.js ---
