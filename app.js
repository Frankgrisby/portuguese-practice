/* =====================================================
   GLOBAL STATE
===================================================== */
let currentMode = null;
let currentCategory = null;
let currentItem = null;
let streak = 0;
let audioRate = 1;
let earPhase = 1; // 1 = translation, 2 = response

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
   LOAD QUESTION
===================================================== */
function loadQuestion() {
  choicesEl.innerHTML = "";
  nextBtn.classList.add("hidden");

  if (currentMode === "ear") {
    loadEarTraining();
    return;
  }

  let pool;
  if (currentMode === "vocabulary") pool = VOCABULARY[currentCategory];
  if (currentMode === "verbs") pool = VERBS;
  if (currentMode === "phrases") pool = PHRASES;
  if (currentMode === "conjugation") pool = VERBS;

  if (!pool || pool.length === 0) {
    promptEl.textContent = "No data available.";
    return;
  }

  currentItem = pool[Math.floor(Math.random() * pool.length)];

  /* ================= NORMAL MODES ================= */

  promptEl.textContent = currentItem.pt;

  let options = shuffle(
    pool.filter(i => i.en !== currentItem.en)
  ).slice(0, 3);

  options.push(currentItem);
  options = shuffle(options);

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.en;

    btn.onclick = () => {
      if (opt.en === currentItem.en) {
        btn.classList.add("correct");
        streak++;
        updateStreak();
        setTimeout(loadQuestion, 600);
      } else {
        btn.classList.add("wrong");
        highlightCorrect(currentItem.en);
        streak = 0;
        updateStreak();
        nextBtn.classList.remove("hidden");
      }
    };

    choicesEl.appendChild(btn);
  });
}

/* =====================================================
   EAR TRAINING MODE
===================================================== */
function loadEarTraining() {
  choicesEl.innerHTML = "";

  if (earPhase === 1) {
    currentItem = EAR_TRAINING[Math.floor(Math.random() * EAR_TRAINING.length)];
    promptEl.textContent = "Listen carefully...";
    speak(currentItem.pt);

    let options = shuffle(
      EAR_TRAINING.filter(i => i.en !== currentItem.en)
    ).slice(0, 3);

    options.push(currentItem);
    options = shuffle(options);

    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt.en;

      btn.onclick = () => {
        if (opt.en === currentItem.en) {
          btn.classList.add("correct");
          earPhase = 2;
          setTimeout(loadEarTraining, 700);
        } else {
          btn.classList.add("wrong");
          highlightCorrect(currentItem.en);
          streak = 0;
          updateStreak();
          nextBtn.classList.remove("hidden");
        }
      };

      choicesEl.appendChild(btn);
    });
  }

  else if (earPhase === 2) {
    promptEl.textContent = currentItem.pt;

    let options = shuffle(
      EAR_TRAINING.map(i => i.response)
        .filter(r => r !== currentItem.response)
    ).slice(0, 3);

    options.push(currentItem.response);
    options = shuffle(options);

    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;

      btn.onclick = () => {
        if (opt === currentItem.response) {
          btn.classList.add("correct");
          streak++;
          updateStreak();
          earPhase = 1;
          setTimeout(loadQuestion, 800);
        } else {
          btn.classList.add("wrong");
          highlightCorrect(currentItem.response);
          streak = 0;
          updateStreak();
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
  [...choicesEl.children].forEach(btn => {
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

document.getElementById("btnConjugation").onclick = () => {
  currentMode = "conjugation";
  resetPractice();
  showScreen(practiceSection);
  loadQuestion();
};

document.getElementById("btnEar").onclick = () => {
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

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");

settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("hidden");
});
