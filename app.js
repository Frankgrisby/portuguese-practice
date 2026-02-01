// ================= GLOBAL SETUP =================

// Force-hide any legacy inputs (safety)
window.onload = () => {
  const input = document.getElementById("textInput");
  const submit = document.getElementById("submitBtn");
  if (input) input.style.display = "none";
  if (submit) submit.style.display = "none";
};

// ================= DATA =================

const pronouns = ["eu", "tu", "ele", "nós", "vocês", "eles"];

// ================= COMMON PHRASES =================

const phrases = [
  { pt: "Olá", en: "Hello" },
  { pt: "Bom dia", en: "Good morning" },
  { pt: "Boa tarde", en: "Good afternoon" },
  { pt: "Boa noite", en: "Good evening" },
  { pt: "Tudo bem?", en: "How are you?" },
  { pt: "Obrigado", en: "Thank you" },
  { pt: "Por favor", en: "Please" },
  { pt: "Desculpa", en: "Sorry" },
  { pt: "Com licença", en: "Excuse me" },
  { pt: "Não sei", en: "I don't know" },
  { pt: "Pode repetir?", en: "Can you repeat?" },
  { pt: "Não entendo", en: "I don't understand" },
  { pt: "Quanto custa?", en: "How much does it cost?" },
  { pt: "Onde fica a casa de banho?", en: "Where is the bathroom?" },
  { pt: "Preciso de ajuda", en: "I need help" },
  { pt: "Até logo", en: "See you later" },
  { pt: "Até amanhã", en: "See you tomorrow" },
  { pt: "Boa sorte", en: "Good luck" },
  { pt: "Sem problema", en: "No problem" },
  { pt: "Estou cansado", en: "I am tired" },
  { pt: "Estou com fome", en: "I am hungry" },
  { pt: "Vamos", en: "Let's go" }
];

// ================= PROGRESS =================

let progress = JSON.parse(localStorage.getItem("ptProgress")) || {};

[...verbs.map(v => v.pt), ...phrases.map(p => p.pt)].forEach(key => {
  if (!progress[key]) {
    progress[key] = { seen: 0, correct: 0, wrong: 0 };
  }
});

function saveProgress() {
  localStorage.setItem("ptProgress", JSON.stringify(progress));
}

// ================= STATE =================

let mode = "";
let currentItem = null;
let correctAnswer = "";

// ================= SCREEN CONTROL =================

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ================= START MODES =================

function startVocab() {
  mode = "vocab";
  show("practice");
  nextQuestion();
}

function startConjugation() {
  mode = "conjugation";
  show("practice");
  nextQuestion();
}

function startPhrases() {
  mode = "phrases";
  show("practice");
  nextQuestion();
}

function goBack() {
  show("menu");
}

// ================= HELPERS =================

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ================= NEXT QUESTION =================

function nextQuestion() {
  document.getElementById("choices").innerHTML = "";
  document.getElementById("feedback").innerText = "";

  if (mode === "vocab") vocabQuestion();
  else if (mode === "conjugation") conjugationQuestion();
  else if (mode === "phrases") phrasesQuestion();

  updateStats();
}

// ================= VOCAB =================

function vocabQuestion() {
  currentItem = pick(verbs);
  correctAnswer = currentItem.en;
  progress[currentItem.pt].seen++;

  document.getElementById("word").innerText =
    `What does "${currentItem.pt}" mean?`;

  makeChoices(verbs.map(v => v.en), correctAnswer);
}

// ================= CONJUGATION =================

function conjugationQuestion() {
  currentItem = pick(verbs);
  const pronoun = pick(pronouns);
  correctAnswer = currentItem.forms[pronoun];
  progress[currentItem.pt].seen++;

  document.getElementById("word").innerText =
    `Conjugate "${currentItem.pt}"\nPronoun: ${pronoun}`;

  makeChoices(
    pronouns.map(p => currentItem.forms[p]),
    correctAnswer
  );
}

// ================= PHRASES =================

function phrasesQuestion() {
  currentItem = pick(phrases);
  correctAnswer = currentItem.en;
  progress[currentItem.pt].seen++;

  document.getElementById("word").innerText =
    `What does "${currentItem.pt}" mean?`;

  makeChoices(phrases.map(p => p.en), correctAnswer);
}

// ================= MULTIPLE CHOICE =================

function makeChoices(pool, correct) {
  const options = [correct];
  while (options.length < 4) {
    const o = pick(pool);
    if (!options.includes(o)) options.push(o);
  }

  options.sort(() => Math.random() - 0.5);

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => grade(opt);
    document.getElementById("choices").appendChild(btn);
  });
}

// ================= GRADING =================

function grade(answer) {
  const key = currentItem.pt;
  const isCorrect = answer === correctAnswer;

  if (isCorrect) {
    progress[key].correct++;
    document.getElementById("feedback").innerText = "✅ Correct!";

    // 🔊 AUTO PLAY AUDIO FOR CORRECT CONJUGATION
    if (mode === "conjugation") {
      const u = new SpeechSynthesisUtterance(answer);
      u.lang = "pt-PT";
      speechSynthesis.speak(u);
    }

  } else {
    progress[key].wrong++;
    document.getElementById("feedback").innerText =
      `❌ Wrong — ${correctAnswer}`;
  }

  saveProgress();
}

// ================= STATS =================

function updateStats() {
  const values = Object.values(progress);
  const seen = values.reduce((s, v) => s + v.seen, 0);
  const correct = values.reduce((s, v) => s + v.correct, 0);
  const acc = seen ? Math.round((correct / seen) * 100) : 0;

  document.getElementById("feedback").innerText +=
    `\n📊 Accuracy: ${acc}% | Seen: ${seen}`;
}

// ================= AUDIO (MANUAL BUTTON) =================

function playAudio() {
  if (!currentItem) return;
  const u = new SpeechSynthesisUtterance(currentItem.pt);
  u.lang = "pt-PT";
  speechSynthesis.speak(u);
}