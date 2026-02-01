let mode = "";
let vocabCategory = null;
let currentItem = null;
let currentVerb = null;
let correctAnswer = "";

// 🔥 FIREBASE CONFIG (PASTE YOUR OWN VALUES)
const firebaseConfig = {
  apiKey: "AIzaSyCzgcE1oPTmAmwdAKJ8vC9TkzS1Dw1TLJ0",
  authDomain: "portuguese-practice-app.firebaseapp.com",
  projectId: "portuguese-practice-app",
  storageBucket: "portuguese-practice-app.firebasestorage.app",
  messagingSenderId: "409360223884",
  appId: "1:409360223884:web:f23eac2ba51a483f7ff5a9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// USER DATA
let userId = null;
let username = localStorage.getItem("username") || "";
auth.signInAnonymously()
  .then(result => {
    userId = result.user.uid;
    checkUsername();
  })
  .catch(error => {
    console.error("Auth error:", error);
  });


/* GLOBAL AUDIO SETTINGS */
let audioRate = 1;

/* STREAK */
let streak = 0;

/* ELEMENTS */
const menu = document.getElementById("menu");
const practice = document.getElementById("practice");
const settings = document.getElementById("settings");

const wordDiv = document.getElementById("word");
const choicesDiv = document.getElementById("choices");
const feedbackDiv = document.getElementById("feedback");
const streakDiv = document.getElementById("streak");

/* DATA */
const safeVerbs = verbs.filter(v => v.forms && Object.keys(v.forms).length >= 4);

const celebrations = [
  { pt: "Excelente!", en: "Excellent!" },
  { pt: "Muito bem!", en: "Very good!" },
  { pt: "Fantástico!", en: "Fantastic!" },
  { pt: "Estás a arrasar!", en: "You're crushing it!" },
  { pt: "Continua assim!", en: "Keep it up!" }
];

/* ---------- NAVIGATION ---------- */

function show(screen) {
  menu.classList.remove("active");
  practice.classList.remove("active");
  settings.classList.remove("active");
  screen.classList.add("active");
}

function openSettings() {
  show(settings);document.getElementById("usernameInput").value = username || "";
}

function closeSettings() {
  show(menu);
}

function goBack() {
  show(menu);
  vocabCategory = null;
}

/* ---------- SETTINGS ---------- */

function setSpeed(rate) {
  audioRate = rate;

  document.querySelectorAll("#settings button")
    .forEach(b => b.classList.remove("active"));

  event.target.classList.add("active");
}

/* ---------- STREAK ---------- */

function resetStreak() {
  streak = 0;
  streakDiv.textContent = `🔥 Streak: ${streak}`;
}

/* ---------- START MODES ---------- */

function startVerbs() {
  mode = "verbs";
  resetStreak();
  show(practice);
  nextQuestion();
}

function startVocabulary() {
  mode = "vocabulary";
  resetStreak();
  show(practice);
  showVocabCategories();
}

function startConjugation() {
  mode = "conjugation";
  resetStreak();
  show(practice);
  nextQuestion();
}

function startPhrases() {
  mode = "phrases";
  resetStreak();
  show(practice);
  nextQuestion();
}

/* ---------- VOCAB CATEGORIES ---------- */

function showVocabCategories() {
  wordDiv.innerHTML = "<strong>Select a category</strong>";
  choicesDiv.innerHTML = "";
  feedbackDiv.textContent = "";

  Object.keys(vocabulary).forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.onclick = () => {
      vocabCategory = cat;
      nextQuestion();
    };
    choicesDiv.appendChild(btn);
  });
}

/* ---------- NEXT ---------- */

function nextQuestion() {
  feedbackDiv.textContent = "";
  choicesDiv.innerHTML = "";

  if (mode === "verbs") loadVerbVocab();
  if (mode === "vocabulary" && vocabCategory) loadCategoryVocab();
  if (mode === "conjugation") loadConjugation();
  if (mode === "phrases") loadPhrase();
}

/* ---------- MODES ---------- */

function loadVerbVocab() {
  currentItem = randomItem(verbs);
  correctAnswer = currentItem.en;

  wordDiv.innerHTML = `
    ${currentItem.pt}
    <span class="speaker" onclick="speak('${currentItem.pt}')">🔊</span>
  `;

  renderChoices(makeOptions(correctAnswer, verbs.map(v => v.en)));
}

function loadCategoryVocab() {
  const list = vocabulary[vocabCategory];
  currentItem = randomItem(list);
  correctAnswer = currentItem.en;

  wordDiv.innerHTML = `
    ${currentItem.pt}
    <span class="speaker" onclick="speak('${currentItem.pt}')">🔊</span>
  `;

  renderChoices(makeOptions(correctAnswer, list.map(v => v.en)));
}

function loadConjugation() {
  currentVerb = randomItem(safeVerbs);
  const pronouns = Object.keys(currentVerb.forms);
  const pronoun = randomItem(pronouns);

  correctAnswer = currentVerb.forms[pronoun];

  wordDiv.innerHTML = `
    <strong>${currentVerb.pt}</strong>
    <span class="speaker" onclick="speak('${currentVerb.pt}')">🔊</span><br>
    <em>${currentVerb.en}</em><br>
    ${pronoun} — Present
  `;

  renderChoices(makeOptions(
    correctAnswer,
    pronouns.map(p => currentVerb.forms[p])
  ));
}

function loadPhrase() {
  currentItem = randomItem(phrases);
  correctAnswer = currentItem.english;

  wordDiv.innerHTML = `
    ${currentItem.portuguese}
    <span class="speaker" onclick="speak('${currentItem.portuguese}')">🔊</span>
  `;

  renderChoices(makeOptions(
    correctAnswer,
    phrases.map(p => p.english)
  ));
}

/* ---------- ANSWERS ---------- */

function renderChoices(options) {
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt);
    choicesDiv.appendChild(btn);
  });
}

function checkAnswer(answer) {
  if (answer === correctAnswer) {
    streak++;
    streakDiv.textContent = `🔥 Streak: ${streak}`;
    feedbackDiv.textContent = "✅ Correct!";

    if (mode === "conjugation") speak(correctAnswer);
    if (streak % 10 === 0) celebrate();
  } else {
    resetStreak();
    feedbackDiv.textContent = `❌ Correct answer:\n${correctAnswer}`;
  }
}

/* ---------- CELEBRATION ---------- */

function celebrate() {
  const msg = randomItem(celebrations);
  feedbackDiv.textContent = `🎉 ${msg.pt}\n${msg.en}`;
  speak(msg.pt);
}

/* ---------- AUDIO ---------- */

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "pt-PT";
  utter.rate = audioRate;
  speechSynthesis.speak(utter);
}

/* ---------- UTIL ---------- */

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeOptions(correct, pool) {
  const others = pool.filter(p => p !== correct);
  return shuffle([correct, ...shuffle(others).slice(0, 3)]);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
function checkUsername() {
  if (!username) {
    const name = prompt("Choose a username (3–15 characters):");
    if (name && name.length >= 3) {
      username = name.trim();
      localStorage.setItem("username", username);
      saveUserToFirebase();
    }
  }
}

function saveUsername() {
  const input = document.getElementById("usernameInput").value.trim();
  if (input.length < 3) {
    alert("Username must be at least 3 characters.");
    return;
  }
  username = input;
  localStorage.setItem("username", username);
  saveUserToFirebase();
  alert("Username saved!");
}

function saveUserToFirebase() {
  if (!userId) return;

  db.collection("users").doc(userId).set({
    username: username,
    bestStreaks: {
      verbs: 0,
      vocabulary: 0,
      conjugation: 0,
      phrases: 0
    },
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}
