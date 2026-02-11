/* =====================================================
   GLOBAL STATE
===================================================== */
let currentMode = null;
let currentCategory = null;
let currentItem = null;
let streak = 0;
let audioRate = 1;

let earPhase = 1; // 1 = translate to English, 2 = choose Portuguese response

/* =====================================================
   DOM
===================================================== */
const mainMenu = document.getElementById("mainMenu");
const vocabCategories = document.getElementById("vocabCategories");
const practiceSection = document.getElementById("practiceSection");

const promptEl = document.getElementById("prompt");
const choicesEl = document.getElementById("choices");
const streakDisplay = document.getElementById("streakDisplay");
const nextBtn = document.getElementById("nextBtn");
const speakerBtn = document.getElementById("speakerBtn");

/* =====================================================
   HELPERS
===================================================== */
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function updateStreak() {
  streakDisplay.textContent = `🔥 Streak: ${streak}`;
}

/* =====================================================
   AUDIO
===================================================== */
const synth = window.speechSynthesis;

function speak(text) {
  if (!text) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "pt-PT";
  u.rate = audioRate;
  synth.speak(u);
}

/* =====================================================
   NAVIGATION
===================================================== */
function showScreen(screen) {
  [mainMenu, vocabCategories, practiceSection].forEach(s =>
    s.classList.add("hidden")
  );
  screen.classList.remove("hidden");
}

function resetPractice() {
  streak = 0;
  updateStreak();
  nextBtn.classList.add("hidden");
}

/* =====================================================
   MAIN QUESTION LOADER
===================================================== */
function loadQuestion() {
  choicesEl.innerHTML = "";
  nextBtn.classList.add("hidden");

  if (currentMode === "ear") {
    loadEarTraining();
    return;
  }

  /* ================= VOCAB / VERBS / PHRASES ================= */

  let pool;
  if (currentMode === "vocabulary") pool = VOCABULARY[currentCategory];
  if (currentMode === "verbs") pool = VERBS;
  if (currentMode === "phrases") pool = PHRASES;

  if (!pool || pool.length === 0) {
    promptEl.textContent = "No data available.";
    return;
  }

  currentItem = pool[Math.floor(Math.random() * pool.length)];
  promptEl.textContent = currentItem.pt;

  let options = shuffle(
    pool.filter(i => i.en !== currentItem.en)
  ).slice(0, 3);

  options.push(currentItem);
  shuffle(options);

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = opt.en;

    btn.onclick = () => {
      if (opt.en === currentItem.en) {
        streak++;
        updateStreak();
        loadQuestion();
      } else {
        streak = 0;
        updateStreak();
        btn.classList.add("wrong");
        highlightCorrect(currentItem.en);
        nextBtn.classList.remove("hidden");
      }
    };

    choicesEl.appendChild(btn);
  });
}

/* =====================================================
   EAR TRAINING
===================================================== */
function loadEarTraining() {
  choicesEl.innerHTML = "";

  if (!EAR_TRAINING || EAR_TRAINING.length === 0) {
    promptEl.textContent = "No ear training data.";
    return;
  }

  if (earPhase === 1) {
    currentItem =
      EAR_TRAINING[Math.floor(Math.random() * EAR_TRAINING.length)];

    promptEl.innerHTML = "🎧 Listen carefully...";
    speak(currentItem.pt);

    let options = shuffle(
      EAR_TRAINING.filter(i => i.en !== currentItem.en)
    ).slice(0, 3);

    options.push(currentItem);
    shuffle(options);

    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.textContent = opt.en;

      btn.onclick = () => {
        if (opt.en === currentItem.en) {
          streak++;
          updateStreak();
          earPhase = 2;
          loadEarTraining();
        } else {
          streak = 0;
          updateStreak();
          btn.classList.add("wrong");
          highlightCorrect(currentItem.en);
          nextBtn.classList.remove("hidden");
        }
      };

      choicesEl.appendChild(btn);
    });
  }

  /* ================= PHASE 2 ================= */

  else if (earPhase === 2) {
    promptEl.innerHTML = "💬 Choose the correct response";

    // ONLY Portuguese response options
    let options = shuffle(
      EAR_TRAINING.map(i => i.response.pt)
    ).slice(0, 3);

    if (!options.includes(currentItem.response.pt)) {
      options[0] = currentItem.response.pt;
    }

    shuffle(options);

    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.textContent = opt;

      btn.onclick = () => {
        if (opt === currentItem.response.pt) {
          btn.classList.add("correct");
          speak(opt);

          setTimeout(() => {
            streak++;
            updateStreak();
            earPhase = 1;
            loadEarTraining();
          }, 900);

        } else {
          streak = 0;
          updateStreak();
          btn.classList.add("wrong");
          highlightCorrect(currentItem.response.pt);
          nextBtn.classList.remove("hidden");
        }
      };

      choicesEl.appendChild(btn);
    });
  }
}

/* =====================================================
   HIGHLIGHT CORRECT
===================================================== */
function highlightCorrect(correctText) {
  document.querySelectorAll(".answer-btn").forEach(btn => {
    if (btn.textContent === correctText) {
      btn.classList.add("correct");
    }
  });
}

/* =====================================================
   EVENTS
===================================================== */
document.getElementById("btnVocabulary").onclick = () => {
  currentMode = "vocabulary";
  showScreen(vocabCategories);
};

document.getElementById("btnVerbs").onclick = () => {
  currentMode = "verbs";
  resetPractice();
  showScreen(practiceSection);
  loadQuestion();
};

document.getElementById("btnPhrases").onclick = () => {
  currentMode = "phrases";
  resetPractice();
  showScreen(practiceSection);
  loadQuestion();
};

document.getElementById("btnEarTraining").onclick = () => {
  currentMode = "ear";
  earPhase = 1;
  resetPractice();
  showScreen(practiceSection);
  loadQuestion();
};

document.querySelectorAll("#vocabCategories button[data-category]").forEach(b => {
  b.onclick = () => {
    currentCategory = b.dataset.category;
    currentMode = "vocabulary";
    resetPractice();
    showScreen(practiceSection);
    loadQuestion();
  };
});

document.getElementById("btnHome").onclick = () => showScreen(mainMenu);
document.getElementById("btnBackFromVocab").onclick = () => showScreen(mainMenu);
nextBtn.onclick = loadQuestion;

speakerBtn.onclick = () => {
  if (currentMode === "ear") {
    speak(currentItem.pt);
  } else {
    speak(currentItem.pt);
  }
};

document.getElementById("audioSpeed").onchange = e => {
  audioRate = parseFloat(e.target.value);
};

document.getElementById("settingsBtn").addEventListener("click", () => {
  document.getElementById("settingsPanel").classList.toggle("hidden");
});
