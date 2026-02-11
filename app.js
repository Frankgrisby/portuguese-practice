let currentMode=null;
let currentCategory=null;
let currentItem=null;
let streak=0;
let audioRate=1;
let earPhase=1;

const screens={
 main:document.getElementById("mainMenu"),
 vocab:document.getElementById("vocabCategories"),
 practice:document.getElementById("practiceSection")
};

const promptEl=document.getElementById("prompt");
const choicesEl=document.getElementById("choices");
const streakDisplay=document.getElementById("streakDisplay");
const nextBtn=document.getElementById("nextBtn");
const speakerBtn=document.getElementById("speakerBtn");

function show(screen){
 Object.values(screens).forEach(s=>s.classList.add("hidden"));
 screen.classList.remove("hidden");
}

function shuffle(a){return [...a].sort(()=>Math.random()-0.5)}

function updateStreak(){streakDisplay.textContent=`🔥 Streak: ${streak}`}

function speak(text){
 if(!text)return;
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);
 u.lang="pt-PT";
 u.rate=audioRate;
 speechSynthesis.speak(u);
}

function resetPractice(){
 streak=0;
 updateStreak();
 nextBtn.classList.add("hidden");
}

function loadQuestion(){
 choicesEl.innerHTML="";
 nextBtn.classList.add("hidden");

 if(currentMode==="ear"){
   loadEar();
   return;
 }

 let pool;
 if(currentMode==="vocabulary")pool=VOCABULARY[currentCategory];
 if(currentMode==="verbs")pool=VERBS;
 if(currentMode==="phrases")pool=PHRASES;
 if(currentMode==="conjugation")pool=VERBS;

 if(!pool||pool.length===0){
   promptEl.textContent="No data available.";
   return;
 }

 currentItem=pool[Math.floor(Math.random()*pool.length)];

 if(currentMode==="conjugation"){
   const tenseOptions=[...document.getElementById("tenseToggle").selectedOptions].map(o=>o.value);
   const tense=tenseOptions[Math.floor(Math.random()*tenseOptions.length)];
   const forms=currentItem.conjugations[tense];
   const pronouns=Object.keys(forms);
   const pronoun=pronouns[Math.floor(Math.random()*pronouns.length)];
   const correct=forms[pronoun];

   promptEl.innerHTML=`
   <div class="conj-stack">
     <div>${currentItem.infinitive}</div>
     <div>${currentItem.en}</div>
     <div>${pronoun} · ${tense}</div>
   </div>`;

   const options=shuffle(Object.values(forms)).slice(0,4);
   if(!options.includes(correct))options[3]=correct;

   shuffle(options).forEach(opt=>{
     const btn=document.createElement("button");
     btn.textContent=opt;
     btn.onclick=()=>{
       if(opt===correct){
         btn.classList.add("correct");
         streak++;updateStreak();
         speak(correct);
         setTimeout(loadQuestion,900);
       }else{
         btn.classList.add("wrong");
         highlightCorrect(correct);
         streak=0;updateStreak();
         nextBtn.classList.remove("hidden");
       }
     };
     choicesEl.appendChild(btn);
   });

   return;
 }

 promptEl.textContent=currentItem.pt;

 const options=shuffle(pool.filter(i=>i!==currentItem)).slice(0,3);
 options.push(currentItem);
 shuffle(options).forEach(opt=>{
   const btn=document.createElement("button");
   btn.textContent=opt.en;
   btn.onclick=()=>{
     if(opt===currentItem){
       btn.classList.add("correct");
       streak++;updateStreak();
       setTimeout(loadQuestion,600);
     }else{
       btn.classList.add("wrong");
       highlightCorrect(currentItem.en);
       streak=0;updateStreak();
       nextBtn.classList.remove("hidden");
     }
   };
   choicesEl.appendChild(btn);
 });
}

function highlightCorrect(correctText){
 [...choicesEl.children].forEach(b=>{
   if(b.textContent===correctText)b.classList.add("correct");
 });
}

function loadEar(){
 if(earPhase===1){
   currentItem=EAR_TRAINING[Math.floor(Math.random()*EAR_TRAINING.length)];
   promptEl.textContent="Listen carefully...";
   speak(currentItem.pt);

   const wrong=shuffle(EAR_TRAINING.filter(i=>i!==currentItem)).slice(0,3);
   const options=shuffle([currentItem,...wrong]);

   options.forEach(opt=>{
     const btn=document.createElement("button");
     btn.textContent=opt.en;
     btn.onclick=()=>{
       if(opt===currentItem){
         btn.classList.add("correct");
         earPhase=2;
         setTimeout(loadEar,600);
       }else{
         btn.classList.add("wrong");
         highlightCorrect(currentItem.en);
         streak=0;updateStreak();
         nextBtn.classList.remove("hidden");
       }
     };
     choicesEl.appendChild(btn);
   });
 }
 else{
   promptEl.textContent="Choose correct response:";
   const correct=currentItem.response.pt;
   const wrong=shuffle(EAR_TRAINING.map(i=>i.response.pt).filter(r=>r!==correct)).slice(0,3);
   const options=shuffle([correct,...wrong]);

   options.forEach(opt=>{
     const btn=document.createElement("button");
     btn.textContent=opt;
     btn.onclick=()=>{
       if(opt===correct){
         btn.classList.add("correct");
         streak++;updateStreak();
         earPhase=1;
         setTimeout(loadQuestion,900);
       }else{
         btn.classList.add("wrong");
         highlightCorrect(correct);
         streak=0;updateStreak();
         nextBtn.classList.remove("hidden");
       }
     };
     choicesEl.appendChild(btn);
   });
 }
}

document.getElementById("btnVocabulary").onclick=()=>{currentMode="vocabulary";show(screens.vocab)};
document.getElementById("btnVerbs").onclick=()=>{currentMode="verbs";resetPractice();show(screens.practice);loadQuestion()};
document.getElementById("btnPhrases").onclick=()=>{currentMode="phrases";resetPractice();show(screens.practice);loadQuestion()};
document.getElementById("btnConjugation").onclick=()=>{currentMode="conjugation";resetPractice();show(screens.practice);loadQuestion()};
document.getElementById("btnEar").onclick=()=>{currentMode="ear";resetPractice();earPhase=1;show(screens.practice);loadQuestion()};

document.querySelectorAll("#vocabCategories button[data-category]").forEach(b=>{
 b.onclick=()=>{
   currentCategory=b.dataset.category;
   currentMode="vocabulary";
   resetPractice();
   show(screens.practice);
   loadQuestion();
 };
});

document.getElementById("btnHome").onclick=()=>show(screens.main);
document.getElementById("btnBackFromVocab").onclick=()=>show(screens.main);
nextBtn.onclick=loadQuestion;
speakerBtn.onclick=()=>{if(currentItem)speak(currentItem.pt)};
document.getElementById("audioSpeed").onchange=e=>audioRate=parseFloat(e.target.value);
document.getElementById("settingsBtn").onclick=()=>document.getElementById("settingsPanel").classList.toggle("hidden");
