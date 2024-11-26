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

let currentQuestion = 0;
let questions = [];

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
  const question = questions[currentQuestion];
  questionText.innerText = question.question;
  questionNumber.innerText = `Question ${currentQuestion + 1}`;
}
