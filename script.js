/* ==========================================================================
   AUDIO CONTROLLER (BGM จาก Catbox + SFX พิมพ์ดีดสังเคราะห์ 0.12)
   ========================================================================== */
const bgm = document.getElementById('bgm-player');
const btnAudio = document.getElementById('btn-audio');
let isMusicStarted = false;
let isMuted = false;

let audioCtx = null;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playDialogueBeep() {
  if (isMuted) return;
  initAudioContext();
  if (!audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(430 + (Math.random() * 30), audioCtx.currentTime);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (e) {}
}

function startAudioOnUserGesture() {
  initAudioContext();
  if (!isMusicStarted && bgm) {
    bgm.volume = 0.4;
    bgm.play().then(() => {
      isMusicStarted = true;
      btnAudio.innerText = '♫';
    }).catch(() => {});
  }
}

document.addEventListener('click', startAudioOnUserGesture, { once: true });
document.addEventListener('touchstart', startAudioOnUserGesture, { once: true });

btnAudio.addEventListener('click', (e) => {
  e.stopPropagation();
  isMuted = !isMuted;
  btnAudio.innerText = isMuted ? '✕' : '♫';

  if (bgm) {
    bgm.muted = isMuted;
    if (!isMusicStarted && !isMuted) {
      bgm.play().catch(() => {});
      isMusicStarted = true;
    }
  }
});

/* ==========================================================================
   GAME DATA
   ========================================================================== */
const stageOrder = ['prelude', 'stage1', 'stage2', 'stage3', 'stage4', 'stage5'];

const gameData = {
  glossary: {
    easy: [
      { jp: "女神様 (めがみさま)", th: "ท่านเทพธิดา" },
      { jp: "冒険者 (ぼうけんしゃ)", th: "นักผจญภัย" },
      { jp: "ギルド", th: "กิลด์ / สมาคม" },
      { jp: "そうじ (掃除)", th: "การทำความสะอาด" },
      { jp: "やくそう (薬草)", th: "สมุนไพร" },
      { jp: "言葉が通じない (ことばがつうじない)", th: "คุยกันไม่รู้เรื่อง / สื่อสารไม่ได้" }
    ],
    hard: [
      { jp: "一体何事 (いったいなにごと)", th: "เกิดเรื่องอะไรขึ้นกันแน่" },
      { jp: "降臨 (こうりん)", th: "การลงมาจุติ" },
      { jp: "登録手続き (とうろくてつづき)", th: "ขั้นตอนการลงทะเบียน" },
      { jp: "依頼 (いらい)", th: "คำขอร้อง / เควส" },
      { jp: "恐縮ですが (きょうしゅくですが)", th: "ขอประทานอภัยอย่างยิ่ง (Keigo)" },
      { jp: "報酬 (ほうしゅう)", th: "ค่าตอบแทน" }
    ]
  },

  stages: {
    // --- บทนำที่เปลี่ยนเป็นบทใหม่ตามที่เราแต่งร่วมกัน ---
    prelude: {
      name: "บทนำ",
      title: "บทนำ: ว้อดส์",
      easy: {
        dialogues: [
          { speaker: "บรรยาย", jp: "ตุบบบ\n.........." },
          { speaker: "เรา", jp: "โอ้ยเจ็บจะบ้า อะไรวะเนี่ย ตาลืมแทบไม่ขึ้นหูก็วิ้งฟังไม่รู้เรื่องเลย" },
          { speaker: "ชาวบ้าน A", jp: "おい、何があったんだ？" },
          { speaker: "ชาวบ้าน B", jp: "女神様じゃないのか？" },
          { speaker: "ชาวบ้าน C", jp: "お母さん、女神様も落ちて痛い痛いするの？" },
          { speaker: "???", jp: "おーい！大丈夫か？おい、君ーーっ！" },
          { speaker: "เรา", jp: "ห้ะ" },
          { speaker: "บรรยาย", jp: "// ลืมตา //\nเมื่อภาพตรงหน้าชัดขึ้น สิ่งที่ปรากฏคือสิ่งมีชีวิตตัวเล็กประหลาดพูดได้ลอยสูงจากพื้นจนอยู่ในระดับสายตา" },
          { 
            speaker: "เรา", 
            jp: ".............",
            quiz: {
              choices: [
                { text: "กรุงเทพเนทีฟเขามีสิ่งนี้หรอ", isCorrect: true },
                { text: "อ้ายบ่อยากเชื่อสายตาว่าภาพตรงหน้าสิเป็นความจริง", isCorrect: true },
                { text: "กูเป็นบ้ามั้ยเนี่ย //ตบหน้าตัวเอง", isCorrect: true },
                { text: "ฝันดี //หลับตานอนใหม่", isCorrect: true }
              ]
            }
          },
          { speaker: "???", jp: "おーい！聞こえてるか？…あれ？言葉が通じないのか？" },
          { speaker: "???", jp: "นี่แกนะ ได้ยินที่ข้าพูดใช่ไหมเนี่ย" },
          { speaker: "เรา", jp: "กำลังพูดไทยอยู่หรอ!!?!?!" },
          { speaker: "เรา", jp: "เดี๋ยวมาต่อท้อคำพี่ใครคิดได้ช่วยด้วย" }
        ]
      },
      hard: {
        dialogues: [
          { speaker: "บรรยาย", jp: "ตุบบบ\n.........." },
          { speaker: "เรา", jp: "โอ้ยเจ็บจะบ้า อะไรวะเนี่ย ตาลืมแทบไม่ขึ้นหูก็วิ้งฟังไม่รู้เรื่องเลย" },
          { speaker: "ชาวบ้าน A", jp: "おい、一体何事だ！？" },
          { speaker: "ชาวบ้าน B", jp: "空から降臨なさるはずの女神様…ではないのか？" },
          { speaker: "ชาวบ้าน C", jp: "おかあさん、天から落ちてきた女神様も痛がるの？" },
          { speaker: "???", jp: "おーい！息はあるか！？おいってば、あんたーーっ！" },
          { speaker: "เรา", jp: "ห้ะ" },
          { speaker: "บรรยาย", jp: "// ลืมตา //\nเมื่อภาพตรงหน้าชัดขึ้น สิ่งที่ปรากฏคือสิ่งมีชีวิตตัวเล็กประหลาดพูดได้ลอยสูงจากพื้นจนอยู่ในระดับสายตา" },
          { 
            speaker: "เรา", 
            jp: ".............",
            quiz: {
              choices: [
                { text: "กรุงเทพเนทีฟเขามีสิ่งนี้หรอ", isCorrect: true },
                { text: "อ้ายบ่อยากเชื่อสายตาว่าภาพตรงหน้าสิเป็นความจริง", isCorrect: true },
                { text: "กูเป็นบ้ามั้ยเนี่ย //ตบหน้าตัวเอง", isCorrect: true },
                { text: "ฝันดี //หลับตานอนใหม่", isCorrect: true }
              ]
            }
          },
          { speaker: "???", jp: "おいおい！話を聞いてるのか？…む、さては言葉が通じておらんのか？" },
          { speaker: "???", jp: "นี่แกนะ ได้ยินที่ข้าพูดใช่ไหมเนี่ย" },
          { speaker: "เรา", jp: "กำลังพูดไทยอยู่หรอ!!?!?!" },
          { speaker: "เรา", jp: "เดี๋ยวมาต่อท้อคักพี่ๆ ใครคิดได้ช่วยด้วย" }
        ]
      }
    },

    stage1: {
      name: "ตอนที่ 1",
      title: "ตอนที่ 1: ว้อดส์1",
      easy: {
        dialogues: [
          {
            speaker: "ギルド受付",
            jp: "いらっしゃいませ！お名前は何ですか？"
          },
          {
            speaker: "あなた",
            jp: "……",
            quiz: {
              choices: [
                {
                  text: "私はタイから来た者です。",
                  isCorrect: true
                },
                {
                  text: "タイは私です。",
                  isCorrect: false,
                  deathReason: "เรียงไวยากรณ์ผิดจนพูดว่า 'ประเทศเทศไทยคือฉัน' พนักงานคิดว่าเป็นคนบ้า ยามกิลด์เลยหวดด้วยกระบองจนสลบ!"
                }
              ]
            }
          }
        ]
      },
      hard: {
        dialogues: [
          {
            speaker: "ギルドマスター",
            jp: "見慣れない格好だな。身元を証明できるものはあるか？"
          },
          {
            speaker: "あなた",
            jp: "……",
            quiz: {
              choices: [
                {
                  text: "タイから参りました。事故で迷い込みました。",
                  isCorrect: true
                },
                {
                  text: "タイ人だけど、知らんわ。",
                  isCorrect: false,
                  deathReason: "ใช้ภาษาห้วนใส่หัวหน้ากิลด์ระดับสูง! ถูกเข้าใจผิดว่าเป็นสายลับจากอาณาจักรศัตรู โดนเวทมนตร์ไฟเผาวูบไปเลย!"
                }
              ]
            }
          }
        ]
      }
    },

    stage2: { name: "ตอนที่ 2", title: "ตอนที่ 2: ว้อดส์2" },
    stage3: { name: "ตอนที่ 3", title: "ตอนที่ 3: ว้อดส์3" },
    stage4: { name: "ตอนที่ 4", title: "ตอนที่ 4: ว้อดส์4" },
    stage5: { name: "ตอนที่ 5", title: "ตอนที่ 5: ว้อดส์5" }
  }
};

/* ==========================================================================
   SYSTEM STATE & CONTROLLER
   ========================================================================== */
let currentDifficulty = 'easy';
let currentStageId = 'prelude';
let currentDialogueIndex = 0;
let currentDialogueList = [];

let unlockedStageIndex = parseInt(localStorage.getItem('savedStageIndex')) || 0;

let typewriterTimer = null;
let isTyping = false;
let fullCurrentText = "";

function showGameNotification(text) {
  const toast = document.getElementById('game-toast');
  if (!toast) return;

  toast.innerText = text;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function selectDifficulty(diff) {
  currentDifficulty = diff;
  const badge = document.getElementById('diff-badge');
  if (badge) {
    badge.innerText = diff === 'easy' ? 'ระดับง่าย' : 'ระดับยาก';
  }
  updateGlossaryUI();
  updateStageMapUI();
  showScreen('screen-stage');
}

function updateStageMapUI() {
  stageOrder.forEach((stageKey, index) => {
    const nodeEl = document.getElementById(`node-${stageKey}`);
    if (!nodeEl) return;

    const lockIcon = nodeEl.querySelector('.lock-icon');

    if (index <= unlockedStageIndex) {
      nodeEl.classList.remove('locked');
      nodeEl.classList.add('unlocked');
      if (lockIcon) lockIcon.innerText = '';
    } else {
      nodeEl.classList.add('locked');
      nodeEl.classList.remove('unlocked');
      if (lockIcon) lockIcon.innerText = 'ล็อก';
    }
  });
}

function startStage(stageKey) {
  const targetIndex = stageOrder.indexOf(stageKey);

  if (targetIndex > unlockedStageIndex) {
    showGameNotification("ด่านนี้ยังถูกล็อกอยู่ เคลียร์ด่านก่อนหน้าก่อนนะ!");
    return;
  }

  currentStageId = stageKey;
  currentDialogueIndex = 0;
  
  const stage = gameData.stages[stageKey];
  if (!stage || (!stage.dialogues && !stage[currentDifficulty]?.dialogues)) {
    showGameNotification("ด่านนี้กำลังพัฒนาบทพูดอยู่!");
    return;
  }

  if (stage.dialogues) {
    currentDialogueList = stage.dialogues;
  } else {
    currentDialogueList = stage[currentDifficulty]?.dialogues || [];
  }

  showScreen('screen-gameplay');
  renderDialogue();
}

/* ==========================================================================
   TYPEWRITER LOGIC
   ========================================================================== */
function typeWriter(text, element, onComplete) {
  if (typewriterTimer) clearInterval(typewriterTimer);
  
  isTyping = true;
  fullCurrentText = text;
  element.innerText = "";
  let i = 0;

  typewriterTimer = setInterval(() => {
    if (i < text.length) {
      const char = text.charAt(i);
      element.innerText += char;
      
      if (char !== " " && char !== "\n") {
        playDialogueBeep();
      }

      i++;
    } else {
      clearInterval(typewriterTimer);
      isTyping = false;
      if (onComplete) onComplete();
    }
  }, 40);
}

function finishTypingInstantly() {
  if (typewriterTimer) clearInterval(typewriterTimer);
  const textEl = document.getElementById('dialogue-jp');
  textEl.innerText = fullCurrentText;
  isTyping = false;

  const dialogue = currentDialogueList[currentDialogueIndex];
  if (dialogue && dialogue.quiz) {
    showQuizChoices(dialogue.quiz);
  }
}

function showQuizChoices(quiz) {
  const quizContainer = document.getElementById('quiz-choices');
  const btnNext = document.getElementById('btn-next');
  
  quizContainer.innerHTML = '';
  quizContainer.classList.remove('hidden');
  btnNext.classList.add('hidden');

  quiz.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'btn-choice';
    btn.innerText = choice.text;
    btn.onclick = () => handleChoice(choice, btn);
    quizContainer.appendChild(btn);
  });
}

function renderDialogue() {
  const dialogue = currentDialogueList[currentDialogueIndex];
  
  if (!dialogue) {
    completeCurrentStage();
    return;
  }

  document.getElementById('speaker-name').innerText = dialogue.speaker;
  
  const textEl = document.getElementById('dialogue-jp');
  const quizContainer = document.getElementById('quiz-choices');
  const btnNext = document.getElementById('btn-next');

  quizContainer.classList.add('hidden');
  btnNext.classList.remove('hidden');

  typeWriter(dialogue.jp, textEl, () => {
    if (dialogue.quiz) {
      showQuizChoices(dialogue.quiz);
    }
  });
}

function handleChoice(choice, clickedBtn) {
  if (choice.isCorrect) {
    document.querySelectorAll('.btn-choice').forEach(b => b.disabled = true);
    
    if (clickedBtn) {
      clickedBtn.style.backgroundColor = '#d8e8b0';
      clickedBtn.style.borderColor = '#24472e';
      clickedBtn.style.color = '#24472e';
    }

    setTimeout(() => {
      currentDialogueIndex++;
      renderDialogue();
    }, 600);

  } else {
    triggerGameOver(choice.deathReason || "ใช้ไวยากรณ์ผิดพลาดจนเกิดเรื่องใหญ่!");
  }
}

function triggerGameOver(reasonText) {
  document.getElementById('gameover-reason').innerText = reasonText;
  showScreen('screen-gameover');
}

function completeCurrentStage() {
  const currentIndex = stageOrder.indexOf(currentStageId);
  const isFinalStage = (currentIndex >= stageOrder.length - 1);
  
  if (currentIndex === unlockedStageIndex && !isFinalStage) {
    unlockedStageIndex++;
    localStorage.setItem('savedStageIndex', unlockedStageIndex);
  }

  updateStageMapUI();

  const stageInfo = gameData.stages[currentStageId];
  const stageName = stageInfo?.name || "ด่านนี้";
  document.getElementById('cleared-title').innerText = `${stageName} สำเร็จ!`;
  document.getElementById('cleared-subtitle').innerText = stageInfo?.title || "";

  const btnNextChapter = document.getElementById('btn-next-chapter');
  if (isFinalStage) {
    btnNextChapter.innerText = "พิชิตครบทุกภารกิจแล้ว";
    btnNextChapter.onclick = () => {
      showGameNotification("คุณผ่านการทดสอบครบทั้งหมดแล้ว!");
    };
  } else {
    btnNextChapter.innerText = "เล่นตอนถัดไป";
    btnNextChapter.onclick = () => {
      const nextStageKey = stageOrder[currentIndex + 1];
      startStage(nextStageKey);
    };
  }

  showScreen('screen-cleared');
}

/* Event Listeners */
document.getElementById('btn-start').addEventListener('click', () => {
  showScreen('screen-difficulty');
});

const btnEasy = document.getElementById('btn-diff-easy');
if (btnEasy) btnEasy.onclick = () => selectDifficulty('easy');

const btnHard = document.getElementById('btn-diff-hard');
if (btnHard) btnHard.onclick = () => selectDifficulty('hard');

document.getElementById('btn-next').addEventListener('click', () => {
  if (isTyping) {
    finishTypingInstantly();
  } else {
    currentDialogueIndex++;
    renderDialogue();
  }
});

document.getElementById('btn-retry').addEventListener('click', () => {
  startStage(currentStageId);
});

const btnBackMap = document.getElementById('btn-back-map');
if (btnBackMap) {
  btnBackMap.addEventListener('click', () => {
    showScreen('screen-stage');
  });
}

// Stage Nodes Click Listeners
stageOrder.forEach(stageKey => {
  const node = document.getElementById(`node-${stageKey}`);
  if (node) {
    node.addEventListener('click', () => {
      startStage(stageKey);
    });
  }
});

// Glossary Modal
document.getElementById('btn-glossary').addEventListener('click', () => {
  document.getElementById('modal-glossary').classList.remove('hidden');
});
document.getElementById('btn-close-glossary').addEventListener('click', () => {
  document.getElementById('modal-glossary').classList.add('hidden');
});

function updateGlossaryUI() {
  const listEl = document.getElementById('glossary-list');
  if (!listEl) return;
  listEl.innerHTML = '';
  const vocabs = gameData.glossary[currentDifficulty] || [];
  vocabs.forEach(item => {
    const li = document.createElement('li');
    li.className = 'vocab-item';
    li.innerHTML = `<strong>${item.jp}</strong> <span>${item.th}</span>`;
    listEl.appendChild(li);
  });
}
