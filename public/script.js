const TRIVIA_API_URL =
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple";
const PANTRY_API_URL = "https://quizapp-hnzg.onrender.com/quiz-scores";

const quizBox = document.querySelector("#quiz-box");
const questionNumber = document.querySelector("#question-number");
const questionText = document.querySelector("#question-text");
const timerDisplay = document.querySelector("#time-left");
const choicesContainer = document.querySelector("#choices-container");
const nextBtn = document.querySelector("#next-btn");
const loader = document.querySelector("#loader");
const highScoreContainer = document.querySelector("#high-score-container");
const highScoreList = document.querySelector("#high-scores-list");
const playAgainBtn = document.querySelector("#play-again-btn");

let currentQuestion = 9;
let questions = [];
let totalScore = 0;
let timerInterval;
let startTime;
let highScores = [];
const totalTime = 10000;

(async () => {
  try {
    const response = await fetch(TRIVIA_API_URL);
    const data = await response.json();
    questions = data.results;
    loadQuestion();
  } catch (error) {
    console.error("Error fetching questions: ", error);
    questionText.innerText = "Failed to load question. Please try again later.";
  }
})();

function loadQuestion() {
  if (currentQuestion >= questions.length) {
    endGame();
    return;
  }

  const question = questions[currentQuestion];
  questionText.innerText = decodeHTML(question.question);
  questionNumber.innerText = `Question ${currentQuestion + 1}`;

  choicesContainer.innerText = "";
  nextBtn.disabled = true;

  const choices = [...question.incorrect_answers, question.correct_answer].sort(
    () => Math.random() - 0.5
  );

  choices.forEach((choice) => {
    choice = choice.trim();
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("choice");
    button.innerText = decodeHTML(choice);
    button.onclick = () => checkAnswer(choice, question.correct_answer.trim());
    choicesContainer.appendChild(button);
  });
  resetTimer();
  startTimer();
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  loadQuestion();
});

function decodeHTML(html) {
  const txt = document.createElement("div");
  txt.innerHTML = html;
  return txt.textContent;
}

function startTimer() {
  startTime = Date.now();
  let timeLeft = totalTime;
  updateTimerDisplay(timeLeft);

  timerInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    timeLeft = totalTime - elapsedTime;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeLeft = 0;
      updateTimerDisplay(timeLeft);
      disableChoices();
      nextBtn.disabled = false;
      const correctAnswer = questions[currentQuestion].correct_answer;
      highlightCorrectAnswer(correctAnswer);
    } else {
      updateTimerDisplay(timeLeft);
    }
  }, 50);
}

function resetTimer() {
  clearInterval(timerInterval);
  updateTimerDisplay(totalTime);
}

function updateTimerDisplay(timeLeft) {
  const seconds = (timeLeft / 1000).toFixed(2);
  timerDisplay.innerText = seconds;
}

function checkAnswer(selectedAnswer, correctAnswer) {
  clearInterval(timerInterval);
  disableChoices();
  highlightCorrectAnswer(correctAnswer);

  if (selectedAnswer === correctAnswer) {
    const elapsedTime = Date.now() - startTime;
    const timeLeft = totalTime - elapsedTime;
    const weighedScore = Math.floor((timeLeft / totalTime) * 1000);
    totalScore += weighedScore;
  }
  nextBtn.disabled = false;
}

function disableChoices() {
  const choices = document.querySelectorAll(".choice");
  choices.forEach((choice) => {
    choice.disabled = true;
  });
}

function highlightCorrectAnswer(correctAnswer) {
  const choices = document.querySelectorAll(".choice");
  choices.forEach((choice) => {
    if (choice.innerText === decodeHTML(correctAnswer)) {
      choice.classList.add("correct");
    } else {
      choice.classList.add("wrong");
    }
  });
}

function endGame() {
  quizBox.style.display = "none";
  saveHighScore();
}

async function saveHighScore() {
  const name = prompt("Enter your name for the scoreboard");
  const date = new Date().toLocaleDateString();
  const newScore = { name, score: totalScore, date };
  loader.style.display = "block";

  try {
    const response = await fetch(PANTRY_API_URL);
    if (response.ok) {
      const data = await response.json();
      highScores = data.highScores || [];
    }
  } catch (error) {
    console.log("Basket not found, creating new one");
    highScores = [];
  }
  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores = highScores.slice(0, 10);
  try {
    await fetch(PANTRY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ highScores }),
    });
  } catch (error) {
    console.error("Error saving high score: ", error);
  }
}
