import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
let displayMode = 0;

console.log(rightGuessString);

function lightMode() {
    let displayModeButton = document.getElementById("light-dark-mode");
    let settingsOverlay = document.getElementById("settings-menu");
    let bkg = document.getElementById("body");
    let pageTitle = document.getElementById("page-title");
    let settingsTitle = document.getElementById("settings-title");
    bkg.style.backgroundColor = "#FFFFFF";
    pageTitle.style.color = "#000000";
    settingsOverlay.style.backgroundColor = "#FFFFFF"
    settingsOverlay.style.boxShadow = "#EDEDED 1px 1px 15px 10px";
    settingsTitle.style.color = "#000000"

    for (const elem of document.getElementsByClassName("keyboard-button")) {
        elem.style.backgroundColor = "#D3D6DA";
        elem.style.color = "#000000"
    }

    return;

}

function darkMode() {
    let displayModeButton = document.getElementById("light-dark-mode");
    let settingsOverlay = document.getElementById("settings-menu");
    let bkg = document.getElementById("body");
    let pageTitle = document.getElementById("page-title");
    let settingsTitle = document.getElementById("settings-title");

    bkg.style.backgroundColor = "#121213";
    pageTitle.style.color = "#FFFFFF";
    settingsOverlay.style.backgroundColor = "#121213"
    settingsOverlay.style.boxShadow = "#080808 1px 1px 15px 10px";
    settingsTitle.style.color = "#FFFFFF"
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        elem.style.backgroundColor = "#818384";
        elem.style.color = "#FFFFFF"
    }

    return;

}

function openSettings() {
    let menu = document.getElementById("settings-menu");
    let bkg = document.getElementById("body");
    menu.style.visibility = "visible";
    menu.style.display = "block";
    if (bkg.style.backgroundColor == "#121213") {
        bkg.style.backgroundColor = "#090909";
    }
    if (bkg.style.backgroundColor == "#FFFFFF") {
        bkg.style.backgroundColor = "#FFFFFF";
    }
    animateCSS(menu, "fadeInUp");
    console.log("Opened settings menu");
    return;
}

function closeSettings() {
    let menu = document.getElementById("settings-menu");
    let bkg = document.getElementById("body");
    menu.style.visibility = "hidden";
    menu.style.display = "none";
    if (bkg.style.backgroundColor == "#090909") {
        bkg.style.backgroundColor = "#121213";
    }
    if (bkg.style.backgroundColor == "#FFFFFF") {
        bkg.style.backgroundColor == "#FFFFFF";
    }
    //animateCSS(menu, "fadeOutUp");
    console.log("Closed settings menu");
    return;
}

function initBoard() {
  let board = document.getElementById("game-board");

  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.createElement("div");
    row.className = "letter-row";

    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }

    board.appendChild(row);
  }
}

function shadeKeyBoard(letter, color) {
    letter = letter.toUpperCase();
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor;
      if (oldColor === "#538D4E") {
        return;
      }

      if (oldColor === "#B59F3B" && color !== "#538D4E") {
        return;
      }

      elem.style.backgroundColor = color;
      break;
    }
    
  }
}

function deleteLetter() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let box = row.children[nextLetter - 1];
  box.textContent = "";
  box.classList.remove("filled-box");
  currentGuess.pop();
  nextLetter -= 1;
}

function checkGuess() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let guessString = "";
  let rightGuess = Array.from(rightGuessString);

  for (const val of currentGuess) {
    guessString += val;
  }

  if (guessString.length != 5) {
    toastr.error("Not enough letters!");
    return;
  }

  if (!WORDS.includes(guessString)) {
    toastr.error("Word not in list!");
    return;
  }

  var letterColor = ["#3A3A3C", "#3A3A3C", "#3A3A3C", "#3A3A3C", "#3A3A3C"];

  //check green
  for (let i = 0; i < 5; i++) {
    if (rightGuess[i] == currentGuess[i]) {
      letterColor[i] = "#538D4E";
      rightGuess[i] = "#";
    }
  }

  //check yellow
  //checking guess letters
  for (let i = 0; i < 5; i++) {
    if (letterColor[i] == "#538D4E") continue;

    //checking right letters
    for (let j = 0; j < 5; j++) {
      if (rightGuess[j] == currentGuess[i]) {
        letterColor[i] = "#B59F3B";
        rightGuess[j] = "#";
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    let box = row.children[i];
    let delay = 250 * i;
    setTimeout(() => {
      //flip box
      animateCSS(box, "flipInX");
      //shade box
      box.style.backgroundColor = letterColor[i];
      shadeKeyBoard(guessString.charAt(i) + "", letterColor[i]);
      console.log(guessString.charAt(i) + "", letterColor[i]);
    }, delay);
  }

  if (guessString === rightGuessString) {
    toastr.success("You guessed right! Game over!");
    guessesRemaining = 0;
    return;
  } else {
    guessesRemaining -= 1;
    currentGuess = [];
    nextLetter = 0;

    if (guessesRemaining === 0) {
      toastr.error("You've run out of guesses! Game over!");
      toastr.info(`The right word was: "${rightGuessString}"`);
    }
  }
}

function insertLetter(pressedKey) {
  if (nextLetter === 5) {
    return;
  }
  pressedKey = pressedKey.toLowerCase();

  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let box = row.children[nextLetter];
  animateCSS(box, "pulse");
  box.textContent = pressedKey;
  box.classList.add("filled-box");
  currentGuess.push(pressedKey);
  nextLetter += 1;
}

const animateCSS = (element, animation, prefix = "animate__") =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

document.addEventListener("keyup", (e) => {
  if (guessesRemaining === 0) {
    return;
  }

  let pressedKey = String(e.key);
  if (pressedKey === "Backspace" && nextLetter !== 0) {
    deleteLetter();
    return;
  }

  if (pressedKey === "ENTER" || pressedKey === "Enter") {
    checkGuess();
    return;
  }

  let found = pressedKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
  }
});

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("keyboard-button")) {
    return;
  }
  let key = target.textContent;

  if (key === "DEL") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});


initBoard();

document.getElementById("settings-button").addEventListener("click", (e) => {
    let menu = document.getElementById("settings-menu");
    if (menu.style.visibility == "hidden") {
        openSettings();
    }
    else {
        closeSettings();
    }
    
    return;
 
 
 });

 document.getElementById("light-dark-mode").addEventListener("click", (e) => {
    if (displayMode == 0) {
        lightMode();
        displayMode = 1;
    }
    else if (displayMode == 1) {
        darkMode();
        displayMode = 0;
    }
    return;
 });
 
 