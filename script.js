let display = document.querySelector("#display");

const op = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
};

display.textContent = "";

// we need to put event listeners on each button i guess
const buttonIds = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "zero",
  "doublezero",
  "dec",
  "add",
  "subtract",
  "divide",
  "multiply",
  "clear",
  "equals",
];

const newState = () => {
  return {
    currentVal: "",
    storedVal: "",
    op: "",
    currentDecimal: true,
    storedDecimal: true,
    lockStoredVal: false,
    lockCurrentVal: false,
  };
};

let inputState = newState();

const isNumber = (val) => {
  if (isNaN(val)) {
    return false;
  }
  return true;
};

const isOperator = (val) => {
  if (val in op) {
    return true;
  }
  return false;
};

const handleNumber = (val) => {
  // if an operator is not defined we are editing storedVal
  if (inputState.op.length === 0 && !inputState.lockStoredVal) {
    // unlock decimal after something has been entered
    if (inputState.storedVal.toString().length === 0) {
      inputState.storedDecimal = false;
    }
    inputState.storedVal += val;
    updateDisplayText(inputState.storedVal);
  } else {
    // if an operator is defined, we are editing currentVal
    // currentVal gets locked when hit equals, this allows repeated tallying by tapping equals
    if (inputState.lockCurrentVal) {
      inputState.currentVal = val;
      inputState.currentDecimal = false;
      inputState.lockCurrentVal = false;
    } else {
      // unlock decimal once something is here
      if (inputState.currentVal.toString().length === 0) {
        inputState.currentDecimal = false;
      }
      inputState.currentVal += val;
    }
    updateDisplayText(inputState.currentVal);
  }
};

const handleOperator = (val) => {
  if (inputState.storedVal.toString().length > 0) {
    if (inputState.op.length > 0 && !inputState.lockStoredVal) {
      inputState.storedVal = op[inputState.op](
        +inputState.storedVal,
        +inputState.currentVal,
      );
    }
    inputState.lockStoredVal = false;
    inputState.currentVal = "";
    inputState.op = val;
  }
  updateDisplayText(inputState.op);
};

const handleEquals = () => {
  if (inputState.op.length === 0) {
    return;
  }
  // handle divide by 0
  if (inputState.op === "/" && +inputState.currentVal === 0) {
    updateDisplayText("^-.-^ < NO )");
    inputState = newState();
    return;
  }
  // if currentVal isn't defined when we calc, we set it to storedVal
  if (inputState.currentVal.toString().length === 0) {
    inputState.currentVal = inputState.storedVal;
  }

  inputState.storedVal = op[inputState.op](
    +inputState.storedVal,
    +inputState.currentVal,
  );

  inputState.currentDecimal = true;
  inputState.storedDecimal = true;
  inputState.lockStoredVal = true;
  updateDisplayText(inputState.storedVal);
};

const handleDecimal = () => {
  if (!isOperator(display.textContent)) {
    if (
      inputState.currentVal.toString().length > 0 &&
      !inputState.lockCurrentVal &&
      !inputState.currentDecimal
    ) {
      inputState.currentVal += ".";
      inputState.currentDecimal = true;
      updateDisplayText(inputState.currentVal);
    } else if (
      inputState.currentVal.toString().length === 0 &&
      !inputState.lockStoredVal &&
      !inputState.storedDecimal
    ) {
      inputState.storedVal += ".";
      inputState.storedDecimal = true;
      updateDisplayText(inputState.storedVal);
    }
  }
  console.log("decimcal");
};

// main state machine that switches behavior depending on input type
const handleInput = (e) => {
  const val = e.target.innerText;

  if (isNumber(val)) {
    handleNumber(val);
  } else if (isOperator(val)) {
    handleOperator(val);
  } else {
    switch (val) {
      case "C":
        inputState = newState();
        updateDisplayText(inputState.storedVal);
        break;
      case "=":
        handleEquals();
        break;
      case ".":
        handleDecimal();
        break;
    }
  }

  console.log(val);
};

const updateDisplayText = (text) => {
  display.textContent = text;
};

const handleKeyPress = (e) => {
  const key = e.key;
  const button = document.querySelector(`button[data-key="${key}"]`);
  if (button) {
    button.click();
  }
};

buttonIds.map((b) => {
  let butt = document.querySelector(`#${b}`);
  butt.addEventListener("click", (e) => handleInput(e));
});

document.addEventListener("keydown", handleKeyPress);
