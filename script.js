const wrongLetters = document.getElementById('wrong-letters');
const word = document.getElementById('word');
const modalContainer = document.getElementById('modal-container');
const notificationContainer = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const bodyParts = document.querySelectorAll('.figure-part');
const playAgainButton = document.getElementById('play-button');

///////////////////////////////////////////////////// Load

const criteria = /^[A-Za-z]+$/;
const apiString = 'https://uselessfacts.jsph.pl/random.json?language=en';
const availableWords = ['programming', 'wizard', 'hangman', 'javascript'];
const correctInputLetters = [];
const wrongInputLetters = [];
let selectedWord = '';

getRandomWord();

playAgainButton.addEventListener('click', () => location.reload());
window.addEventListener('keydown', (event) => {
  if (event.keyCode >= 65 && event.keyCode <= 90) checkLetter(event.key);
});

///////////////////////////////////////////////////// Helper Functions

function getRandomWord() {
  fetch(apiString)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.text);
      let allWords = data.text
        .toLowerCase()
        .split(' ')
        .filter((literal) => isValidWord(literal));

      selectedWord = allWords[getRandomInt(allWords.length)];
      updateCorrectLetterElements();
    })
    .catch((error) => {
      selectedWord = availableWords[getRandomInt(availableWords.length)];
      updateCorrectLetterElements();
    });
}

function checkLetter(letter) {
  if (modalContainer.classList.contains('show-modal')) return;

  letter = letter.toLowerCase();
  if (
    correctInputLetters.includes(letter) ||
    wrongInputLetters.includes(letter)
  ) {
    notificationContainer.classList.add('show-notification');
  } else {
    notificationContainer.classList.remove('show-notification');
    if (selectedWord.includes(letter)) {
      correctInputLetters.push(letter);
      updateCorrectLetterElements();
    } else {
      wrongInputLetters.push(letter);
      updateWrongLetterElements();
    }
  }
}

function updateCorrectLetterElements() {
  let selectedWordLetters = [...selectedWord];

  //Building the placeholders for the letter with the correct entered letters displayed.
  let formattedWord = selectedWordLetters
    .map((letter) => {
      if (correctInputLetters.includes(letter))
        return `<span class="letter">${letter}</span>`;
      else return '<span class="letter"></span>';
    })
    .join('');
  word.innerHTML = formattedWord;

  //Checking if the user entered all the correct letters of the word.
  let missingLetters = selectedWordLetters.filter(
    (letter) => !correctInputLetters.includes(letter)
  );
  if (missingLetters.length == 0) {
    finalMessage.innerHTML = 'Congratulations! You Won! &#128515;';
    modalContainer.classList.add('show-modal');
  }
}

function updateWrongLetterElements() {
  let errors = wrongInputLetters.length;

  //Updating the displayed wrong letters.
  wrongLetters.innerHTML = wrongInputLetters.join(', ');

  //Updating body parts display according to the number of errors.
  bodyParts.forEach((part, index) => {
    if (index < errors) part.style.display = 'block';
    else part.style.display = 'none';
  });

  //Displaying the message box if the user lost.
  if (errors === bodyParts.length) {
    finalMessage.innerHTML = 'Unfortunately, you lost! &#128530;';
    modalContainer.classList.add('show-modal');
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function isValidWord(literal) {
  return literal.match(criteria) && literal.length > 4;
}
