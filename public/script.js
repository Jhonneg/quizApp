const TRIVIA_API_URL =
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple";
const PANTRY_API_URL = "https://quizapp-hnzg.onrender.com/test";

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
