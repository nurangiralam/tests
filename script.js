// ---------- Navigation ----------
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ---------- To-Do List ----------
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() { localStorage.setItem("tasks", JSON.stringify(tasks)); }

function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    if (filter === "completed" && !task.completed) return;
    if (filter === "pending" && task.completed) return;
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleTask(${index})">✅</button>
        <button class="delete-btn" onclick="deleteTask(${index})">🗑</button>
      </div>`;
    taskList.appendChild(li);
  });
}
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  taskInput.value = "";
  saveTasks(); renderTasks();
}
function toggleTask(i) { tasks[i].completed = !tasks[i].completed; saveTasks(); renderTasks(); }
function deleteTask(i) { tasks.splice(i, 1); saveTasks(); renderTasks(); }

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => { if (e.key === "Enter") addTask(); });
filterBtns.forEach(btn => btn.addEventListener("click", () => renderTasks(btn.dataset.filter)));
renderTasks();

// ---------- Quiz App ----------
const quizData = [
  { question: "Which company developed JavaScript?", options: ["Microsoft", "Netscape", "Google", "Sun Microsystems"], answer: "Netscape" },
  { question: "Which symbol is used for comments in JavaScript?", options: ["//", "<!-- -->", "#", "/* */"], answer: "//" },
  { question: "Which method converts JSON data to a JavaScript object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObject()"], answer: "JSON.parse()" },
  { question: "Which of the following is NOT a JavaScript data type?", options: ["Number", "String", "Boolean", "Character"], answer: "Character" },
  { question: "Which keyword is used to declare a constant in JavaScript?", options: ["var", "let", "const", "static"], answer: "const" }
];
let currentQuestion = 0, userAnswers = [], timer, timeRemaining;
const timeLimit = 15;
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const timerEl = document.getElementById("timer");
const reviewSection = document.getElementById("reviewSection");
const reviewEl = document.getElementById("review");
const finalSubmitBtn = document.getElementById("finalSubmit");
const resultSection = document.getElementById("resultSection");
const resultEl = document.querySelector(".result");
const correctAnswersEl = document.getElementById("correctAnswers");

function loadQuestion() {
  resetTimer();
  const q = quizData[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  q.options.forEach(opt => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="radio" name="option" value="${opt}"> ${opt}`;
    optionsEl.appendChild(label);
  });
  startTimer();
}
nextBtn.addEventListener("click", () => {
  const selected = document.querySelector("input[name='option']:checked");
  if (!selected) { alert("Please select an answer!"); return; }
  userAnswers[currentQuestion] = selected.value;
  clearInterval(timer);
  if (currentQuestion < quizData.length - 1) { currentQuestion++; loadQuestion(); }
  else { document.getElementById("quiz").classList.add("hidden"); reviewSection.classList.remove("hidden"); showReview(); }
});
function startTimer() {
  timeRemaining = timeLimit;
  timerEl.textContent = `Time left: ${timeRemaining}s`;
  timer = setInterval(() => {
    timeRemaining--; timerEl.textContent = `Time left: ${timeRemaining}s`;
    if (timeRemaining <= 0) { clearInterval(timer); nextBtn.click(); }
  }, 1000);
}
function resetTimer() { clearInterval(timer); timerEl.textContent = ""; }
function showReview() {
  reviewEl.innerHTML = "";
  quizData.forEach((q, i) => {
    const div = document.createElement("div");
    div.innerHTML = `<p><strong>Q${i+1}: ${q.question}</strong></p>
                     <p>Your answer: ${userAnswers[i] || "Not answered"}</p>
                     <p>Correct answer: ${q.answer}</p><hr>`;
    reviewEl.appendChild(div);
  });
}
finalSubmitBtn.addEventListener("click", () => {
  reviewSection.classList.add("hidden"); resultSection.classList.remove("hidden");
  let score = 0; quizData.forEach((q,i) => { if (userAnswers[i] === q.answer) score++; });
  resultEl.textContent = `Your Score: ${score} / ${quizData.length}`;
  correctAnswersEl.innerHTML = "<h4>Correct Answers:</h4>";
  quizData.forEach((q,i) => { correctAnswersEl.innerHTML += `<p>Q${i+1}: ${q.answer}</p>`; });
});
loadQuestion();
