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

function checkAnswer(selectedAnswer, correctAnswer) {
  console.log(selectedAnswer, correctAnswer);
  const choices = document.querySelectorAll(".choice");
  choices.forEach((choice) => {
    if (choice.innerText === decodeHTML(correctAnswer)) {
      choice.classList.add("correct");
    } else {
      choice.classList.add("wrong");
    }
    choice.disabled = true;
  });
  nextBtn.disabled = false;
}
