// Select the input (adjust selector if needed)
const selector = 'input.answer-text';

// Run every 50ms to remove paste restrictions
const intervalId = setInterval(() => {
  const input = document.querySelector(selector);
  if (!input) return;

  // Remove any inline onpaste attribute
  input.onpaste = null;

  // Remove event listeners that block paste
  input.addEventListener('paste', e => {
    e.stopImmediatePropagation();
  }, true);

  // Optional: remove readonly or disabled if any
  input.removeAttribute('readonly');
  input.removeAttribute('disabled');
}, 50);

// To stop it later:
function stopAntiPasteFix() {
  clearInterval(intervalId);
  console.log("Anti-paste override stopped.");
}
//PASTE THIS IN CONSOLE, IT WILL LET YOU PASTE IN TEXT
