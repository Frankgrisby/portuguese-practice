/* =====================================================
   GLOBAL STATE
===================================================== */
let currentMode = null;
let currentCategory = null;
let currentItem = null;
let streak = 0;
let audioRate = 1;

// Conjugation-only settings
const CONJUGATION_SETTINGS = {
  tense: "present" // default
};

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
   LOAD QUESTION
===================================================== */
function loadQuestion() {
  choicesEl.innerHTML = "";
  nextBtn.classList.add("hidden");

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

  /* ================= CONJUGATION ================= */
  if (currentMode === "conjugation") {
    const tense = CONJUGATION_SETTINGS.tense;

    if (!currentItem.conjugations || !currentItem.conjugations[tense]) {
      loadQuestion();
      return;
    }

    const forms = currentItem.conjugations[tense];
    const pronouns = Object.keys(forms);
    const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    const correct = forms[pronoun];

    promptEl.innerHTML = `
      <div class="conj-stack">
        <div class="conj-infinitive">${currentItem.infinitive}</div>
        <div class="conj-english">${currentItem.en}</div>
        <div class="conj-pronoun">${pronoun} · ${tense}</div>
      </div>
    `;

    let options = shuffle(Object.values(forms)).slice(0, 4);
    if (!options.includes(correct)) options[3] = correct;
    options = shuffle(options);

    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;

      btn.onclick = () => {
        const buttons = document.querySelectorAll("#choices button");

        if (opt === correct) {
          btn.classList.add("correct");
          streak++;
          updateStreak();
          speak(opt);

          requestAnimationFrame(() => {
            setTimeout(loadQuestion, 900);
          });
        } else {
          btn.classList.add("wrong");
          buttons.forEach(b => {
            if (b.textContent === correct) {
              b.classList.add("correct");
            }
          });
          streak = 0;
          updateStreak();
          nextBtn.classList.remove("hidden");
        }
      };

      choicesEl.appendChild(btn);
    });

    return;
  }

  /* ================= VOCAB / VERBS / PHRASES ================= */
  let questionPT;
  let correctEN;

  if (currentMode === "verbs") {
    questionPT = currentItem.infinitive;
    correctEN = currentItem.en;
  } else {
    questionPT = currentItem.pt;
    correctEN = currentItem.en;
  }

  promptEl.textContent = questionPT;

  let options = shuffle(
    pool.filter(i => i.en !== correctEN)
  ).slice(0, 3);

  options.push(currentItem);
  options = shuffle(options);

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.en;

    btn.onclick = () => {
      const buttons = document.querySelectorAll("#choices button");

      if (opt.en === correctEN) {
        btn.classList.add("correct");
        streak++;
        updateStreak();

        requestAnimationFrame(() => {
          setTimeout(loadQuestion, 500);
        });
      } else {
        btn.classList.add("wrong");
        buttons.forEach(b => {
          if (b.textContent === correctEN) {
            b.classList.add("correct");
          }
        });
        streak = 0;
        updateStreak();
        nextBtn.classList.remove("hidden");
      }
    };

    choicesEl.appendChild(btn);
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

/* ================= SPEAKER ================= */
speakerBtn.onclick = () => {
  if (!currentItem) return;

  if (currentMode === "conjugation") {
    speak(currentItem.infinitive);
  } else if (currentMode === "verbs") {
    speak(currentItem.infinitive);
  } else {
    speak(currentItem.pt);
  }
};

/* ================= SETTINGS ================= */
document.getElementById("audioSpeed").onchange = e => {
  audioRate = parseFloat(e.target.value);
};

const tenseToggle = document.getElementById("tenseToggle");
if (tenseToggle) {
  CONJUGATION_SETTINGS.tense = tenseToggle.value;

  tenseToggle.addEventListener("change", e => {
    CONJUGATION_SETTINGS.tense = e.target.value;
  });
}

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");

settingsBtn.onclick = () => {
  settingsPanel.classList.toggle("hidden");
};
