# chatgpt-no-enter

A Chrome extension that prevents accidental message sending in ChatGPT and Gemini by disabling Enter as a send trigger.

## Features

- Enter adds a newline instead of sending the message
- Ctrl+Enter (Windows/Linux) or Cmd+Enter (macOS) sends the message
- Supports:
  - chat.openai.com
  - chatgpt.com
  - gemini.google.com

## Installation

1. Download or clone this repository
2. Open Chrome and go to chrome://extensions
3. Enable Developer Mode (top right)
4. Click "Load unpacked"
5. Select the folder containing this extension

## How it works

The extension injects a script that:

- Listens for keydown events on the input field
- Blocks Enter from submitting unless Ctrl or Cmd is held
- Allows Shift+Enter or plain Enter to insert newlines

## Compatibility

Tested on:

- ChatGPT (chat.openai.com, chatgpt.com)
- Google Gemini (gemini.google.com)

## License

MIT
