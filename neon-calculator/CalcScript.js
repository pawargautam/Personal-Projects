const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
let currentInput = "";

// Function to update display
function updateDisplay(value) {
  display.textContent = value || "0";
}

// Button clicks
buttons.forEach(button => {
  button.addEventListener("click", () => handleInput(button.textContent));
});

// Handle both button and keyboard inputs
function handleInput(value) {
  if (value === "C") {
    currentInput = "";
    updateDisplay(currentInput);
  } else if (value === "=" || value === "Enter") {
    try {
      currentInput = eval(currentInput).toString();
      updateDisplay(currentInput);
    } catch {
      updateDisplay("Error");
      currentInput = "";
    }
  } else if (value === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
  } else if ("0123456789+-*/.".includes(value)) {
    currentInput += value;
    updateDisplay(currentInput);
  }
}

// Keyboard input support
document.addEventListener("keydown", (event) => {
  handleInput(event.key);
});
