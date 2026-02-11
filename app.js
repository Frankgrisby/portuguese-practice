/* =====================================================
   SAFE INITIALIZATION
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

let currentMode = null;
let currentCategory = null;
let currentItem = null;
let streak = 0;
let audioRate = 1;
let earPhase = 1;

/* =====================================================
   DOM (SAFE)
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
  if (streakDisplay)
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
   SCREEN CONTROL
===================================================== */
function showScreen(screen) {
  [mainMenu, vocabCategories, practiceSection].forEach(s => {
    if (s) s.classList.add("hidden");
  });
  if (screen) screen.classList.remove("hidden");
}

function resetPractice() {
  streak = 0;
  updateStreak();
  if (nextBtn) nextBtn.classList.add("hidden");
}

/* =====================================================
   MAIN LOADER
===================================================== */
function loadQuestion() {

  if (!choicesEl || !promptEl) return;

  choicesEl.innerHTML = "";
  if (nextBtn) nextBtn.classList.add("hidden");

  if (currentMode === "ear") {
    loadEarTraining();
    return;
  }

  let pool;

  if (currentMode === "vocabulary")
    pool = VOCABULARY?.[currentCategory];

  if (currentMode === "verbs")
    pool = VERBS;

  if (currentMode === "phrases")
    pool = PHRASES;

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
        btn.classList.add("correct");
        streak++;
        updateStreak();
        setTimeout(loadQuestion, 500);
      } else {
        btn.classList.add("wrong");
        highlightCorrect(currentItem.en);
        streak = 0;
        updateStreak();
        if (nextBtn) nextBtn.classList.remove("hidden");
      }
    };

    choicesEl.appendChild(btn);
  });
}

/* =====================================================
   EAR TRAINING
===================================================== */
function loadEarTraining() {

  if (!EAR_TRAINING || EAR_TRAINING.length === 0) {
    promptEl.textContent = "No ear training data.";
    return;
  }

  choicesEl.innerHTML = "";

  if (earPhase === 1) {

    currentItem =
      EAR_TRAINING[Math.floor(Math.random() * EAR_TRAINING.length)];

    promptEl.textContent = "🎧 Listen carefully...";
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
          btn.classList.add("correct");
          streak++;
          updateStreak();
          earPhase = 2;
          setTimeout(loadEarTraining, 500);
        } else {
          btn.classList.add("wrong");
          highlightCorrect(currentItem.en);
          streak = 0;
          updateStreak();
          if (nextBtn) nextBtn.classList.remove("hidden");
        }
      };

      choicesEl.appendChild(btn);
    });
  }

  else {

    promptEl.textContent = "💬 Choose the correct response";

    let options = shuffle(
      EAR_TRAINING.map(i => i.response.pt)
    ).slice(0, 3);

    if (!options.includes(currentItem.response.pt))
      options[0] = currentItem.response.pt;

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
          btn.classList.add("wrong");
          highlightCorrect(currentItem.response.pt);
          streak = 0;
          updateStreak();
          if (nextBtn) nextBtn.classList.remove("hidden");
        }
      };

      choicesEl.appendChild(btn);
    });
  }
}

/* =====================================================
   HIGHLIGHT
===================================================== */
function highlightCorrect(correctText) {
  document.querySelectorAll(".answer-btn").forEach(btn => {
    if (btn.textContent === correctText) {
      btn.classList.add("correct");
    }
  });
}

/* =====================================================
   BUTTON EVENTS (SAFE)
===================================================== */

document.getElementById("btnVocabulary")?.addEventListener("click", () => {
  currentMode = "vocabulary";
  showScreen(vocabCategories);
});

document.getElementById("btnVerbs")?.addEventListener("click", () => {
  currentMode = "verbs";
  resetPractice();
  showScreen(practiceSection);
  loadQuestion();
});

document.getElementById("btnPhrases")?.addEventListener("click", () => {
  currentMode = "phrases";
  resetPractice();
  showScreen(practiceSection);
  loadQuestion();
});

document.getElementById("btnEarTraining")?.addEventListener("click", () => {
  currentMode = "ear";
  earPhase = 1;
  resetPractice();
  showScreen(practiceSection);
  loadQuestion();
});

document.querySelectorAll("#vocabCategories button[data-category]")
  .forEach(btn => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;
      currentMode = "vocabulary";
      resetPractice();
      showScreen(practiceSection);
      loadQuestion();
    });
  });

document.getElementById("btnHome")
  ?.addEventListener("click", () => showScreen(mainMenu));

document.getElementById("btnBackFromVocab")
  ?.addEventListener("click", () => showScreen(mainMenu));

nextBtn?.addEventListener("click", loadQuestion);

speakerBtn?.addEventListener("click", () => {
  if (currentItem?.pt) speak(currentItem.pt);
});

document.getElementById("audioSpeed")
  ?.addEventListener("change", e => {
    audioRate = parseFloat(e.target.value);
  });

document.getElementById("settingsBtn")
  ?.addEventListener("click", () => {
    document.getElementById("settingsPanel")
      ?.classList.toggle("hidden");
  });

});
