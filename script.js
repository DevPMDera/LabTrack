// ===============================
// LABTRACK TEST DATABASE
// ===============================

const TESTS = {
  "FBC": {
    tat: 45,
    sop: [
      { stage: "Collect Sample (EDTA)", duration: 3 },
      { stage: "Mix Sample (8–10 inversions)", duration: 1 },
      { stage: "Check Sample (clots/hemolysis)", duration: 2 },
      { stage: "Prepare Analyzer (background check)", duration: 3 },
      { stage: "Run QC (Low, Normal, High)", duration: 5 },
      { stage: "Process Sample (Load & Run)", duration: 7 },
      { stage: "Review Results & Flags", duration: 3 },
      { stage: "Blood Film (if flagged)", duration: 3 },
      { stage: "Validate Results", duration: 2 },
      { stage: "Release & Notify Critical Values", duration: 16 }
    ]
  }
};


let sampleCounter = 24; 
// Since you already have A23 in your HTML,
// we start at 24

const addBtn = document.querySelector(".add-sample");
const modal = document.getElementById("sampleModal");
const cancelBtn = document.getElementById("cancelModal");
const form = document.getElementById("sampleForm");

const sampleCodeInput = document.getElementById("sampleCode");
const patientIdInput = document.getElementById("patientId");
const testTypeInput = document.getElementById("testType");
const testTimeInput = document.getElementById("testTime");

const sampleReceivedColumn = document.querySelector(".column.sample-received");

// OPEN MODAL
addBtn.addEventListener("click", () => {
  sampleCodeInput.value = "A" + sampleCounter;
  modal.classList.remove("hidden");
});

// CLOSE MODAL
cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// SUBMIT FORM
form.addEventListener("submit", function(e) {
  e.preventDefault();

  if (!patientIdInput.value || !testTypeInput.value || !testTimeInput.value) {
    alert("Please fill all fields.");
    return;
  }

  const newCard = document.createElement("div");
  newCard.classList.add("card", "sample-received");

  newCard.innerHTML = `
    <span class="card-number">${sampleCodeInput.value}</span> |
    <span class="card-id">ID: ${patientIdInput.value}</span>
    <br>
    <span class="card-test">${testTypeInput.value}</span>
    <span class="card-timing received">${testTimeInput.value} min</span>
  `;

  sampleReceivedColumn.appendChild(newCard);

  sampleCounter++;
  form.reset();
  modal.classList.add("hidden");
});
  
function updateMetrics() {
  const overdueCards = document.querySelectorAll(".card.overdue").length;
  const warningCards = document.querySelectorAll(".card.warning").length;
  const validationCards = document.querySelectorAll(".column.validation .card").length;
  const completedCards = document.querySelectorAll(".column.history .card").length;

  document.getElementById("overdueCount").textContent = overdueCards;
  document.getElementById("dueSoonCount").textContent = warningCards;
  document.getElementById("validationCount").textContent = validationCards;
  document.getElementById("completedCount").textContent = completedCards;
}

// Run once when page loads
updateMetrics();
  
  
  
const analysisModal = document.getElementById("analysisModal");
const confirmAnalysis = document.getElementById("confirmAnalysis");
const cancelAnalysis = document.getElementById("cancelAnalysis");
const analysisColumn = document.querySelector(".column.analysis");

let selectedCard = null;
let activeTimers = new Map();

/* ------------------------------------
   MAKE SAMPLE RECEIVED CARDS CLICKABLE
------------------------------------ */

//Removed from here line 107

document.addEventListener("click", function(e) {

  const card = e.target.closest(".card");
  if (!card) return;

  const parentColumn = card.closest(".column");
  if (!parentColumn) return;

  // SAMPLE RECEIVED → OPEN ANALYSIS MODAL
  if (parentColumn.classList.contains("sample-received")) {
    selectedCard = card;
    analysisModal.classList.remove("hidden");
  }

  // ANALYSIS → OPEN SOP MODAL
  else if (parentColumn.classList.contains("analysis")) {
    const testName = card.querySelector(".card-test").textContent.trim();
    openSOPModal(testName, card);
  }

}); 

/* ------------------------------------
   CONFIRM START ANALYSIS
------------------------------------ */

confirmAnalysis.addEventListener("click", function() {

  if (!selectedCard) return;

  // Move to Analysis column
  selectedCard.classList.remove("sample-received");
  selectedCard.classList.add("analysis");
  analysisColumn.appendChild(selectedCard);

  // Extract time (e.g "5 min")
  const timingEl = selectedCard.querySelector(".card-timing");
  let minutes = parseInt(timingEl.textContent);

  startCountdown(selectedCard, minutes);

  analysisModal.classList.add("hidden");
  updateMetrics();
});

/* ------------------------------------
   CANCEL
------------------------------------ */

cancelAnalysis.addEventListener("click", function() {
  analysisModal.classList.add("hidden");
});

/* ------------------------------------
   COUNTDOWN FUNCTION
------------------------------------ */

function startCountdown(card, minutes) {

  let totalSeconds = minutes * 60;

  // Store original TAT on card
  card.dataset.total = totalSeconds;
  card.dataset.remaining = totalSeconds;

  const timingEl = card.querySelector(".card-timing");

  timingEl.classList.remove("received");
  timingEl.classList.add("analysis");

  const interval = setInterval(() => {

    totalSeconds--;

    // 🔥 Update remaining time on card
    card.dataset.remaining = totalSeconds;

    let min = Math.floor(totalSeconds / 60);
    let sec = totalSeconds % 60;

    timingEl.textContent =
      `${min}m ${sec < 10 ? "0"+sec : sec}s`;

    if (totalSeconds <= 1800 && totalSeconds > 0) {
      card.classList.add("warning");
    }

    if (totalSeconds <= 0) {
      clearInterval(interval);
      card.classList.remove("warning");
      card.classList.add("overdue");
      timingEl.textContent = "Overdue";
      card.dataset.remaining = 0;
    }

    updateMetrics();

  }, 1000);

  activeTimers.set(card, interval);
}

/* ------------------------------------
   MAKE NEWLY ADDED SAMPLES CLICKABLE
------------------------------------ */

// Modify your existing form submit logic:
const originalSubmit = form.onsubmit;


  
  
const testModal = document.getElementById("testModal");
const openTestModalBtn = document.getElementById("openTestModal");
const closeTestModalBtn = document.getElementById("closeTestModal");

const testTATMap = { 
    "FBC": 45,
    "CBC": 40,
    "PCV": 15,
    "ESR": 60,
    "Reticulocyte Count": 90,
    "Peripheral Blood Film": 120,
    "Blood Group & Genotype": 30,
    "Crossmatching": 60,
    "Coagulation Profile": 60,
    "PT": 45,
    "APTT": 45,
    "INR": 30,
    "D-Dimer": 60,
    "Sickle Cell Screening": 30,
  
    "Glucose (RBS/FBS)": 10,
    "HbA1c": 120,
    "Urea": 60,
    "Creatinine": 60,
    "Electrolytes (Na⁺, K⁺, Cl⁻, HCO₃⁻)": 60,
    "LFT": 90,
    "Lipid Profile": 120,
    "CRP": 30,
    "Uric Acid": 45,
    "Bilirubin (Total/Direct)": 45,
    "Total Protein": 45,
    "Albumin": 45,
    "CK-MB": 45,
    "Troponin": 45,
    "Amylase": 60,
    "Lipase": 60,
    "PSA": 120,
    "TSH": 180,
    "T3": 180,
    "T4": 180,
    "Prolactin": 120,
    "β-hCG": 60,
    "Calcium": 45,
    "Phosphate": 45,
    "Magnesium": 45,
  
    "Malaria Parasite": 20,
    "Widal": 30,
    "Blood Culture": 2880,
    "Urine MCS": 1440,
    "Stool MCS": 1440,
    "Sputum MCS": 1440,
    "HVS MCS": 1440,
    "Semen Analysis": 60,
    "Gram Stain": 30,
    "Ziehl-Neelsen (AFB)": 60,
    "GeneXpert (TB)": 120,
    "RVS": 30,
    "HIV I & II": 30,
    "HBsAg": 25,
    "HCV": 25,
    "VDRL": 30,
    "COVID Antigen": 20,
    "Typhoid Culture": 1440,
  
    "Biopsy": 4320,        // 3 days
    "FNAC": 1440,
    "Pap Smear": 2880,
    "Frozen Section": 60,
  
    "Rheumatoid Factor": 60,
    "ANA": 240,
    "Anti-dsDNA": 240,
    "ASO Titre": 90,
  
    "Stool Microscopy": 30,
    "Urine Microscopy": 20,
    "Occult Blood": 20
  
};

// OPEN TEST MODAL
openTestModalBtn.addEventListener("click", () => {
  testModal.classList.remove("hidden");
});

// CLOSE
closeTestModalBtn.addEventListener("click", () => {
  testModal.classList.add("hidden");
});

// HANDLE TEST SELECTION
document.querySelectorAll(".test-option").forEach(button => {
  button.addEventListener("click", () => {

    const selectedTest = button.dataset.test;

    testTypeInput.value = selectedTest;
    openTestModalBtn.textContent = selectedTest;

    if (selectedTest === "Manual") {
      testTimeInput.disabled = false;
      testTimeInput.value = "";
      testTimeInput.placeholder = "Enter minutes";
    } else {
      testTimeInput.disabled = true;
      testTimeInput.value = testTATMap[selectedTest];
    }

    testModal.classList.add("hidden");
  });
});



let activeTimer = null;
let elapsedSeconds = 0;
let totalSeconds = 0;
let stageThresholds = [];

function openSOPModal(testName, card) {

  const test = TESTS[testName];
  if (!test) return;

  selectedCard = card;

  document.getElementById("sopTestTitle").innerText = testName;

  const stagesContainer = document.getElementById("sopStages");
  stagesContainer.innerHTML = "";

  stageThresholds = [];
  let cumulative = 0;

  test.sop.forEach((step, index) => {
    cumulative += step.duration * 60;
    stageThresholds.push(cumulative);

    stagesContainer.innerHTML += `
      <div class="stage" id="stage-${index}">
        <input type="checkbox" disabled />
        ${step.stage} (${step.duration} min)
      </div>
    `;
  });

  // 🔥 Sync directly to card timer
totalSeconds = parseInt(card.dataset.total);
let remainingFromCard = parseInt(card.dataset.remaining);

elapsedSeconds = totalSeconds - remainingFromCard;
  document.getElementById("sopModal").classList.remove("hidden");

  startTimer();
}

function startTimer() {

  clearInterval(activeTimer);

  activeTimer = setInterval(() => {

    if (!selectedCard) return;

    let remaining = parseInt(selectedCard.dataset.remaining);
    let total = parseInt(selectedCard.dataset.total);

    elapsedSeconds = total - remaining;

    if (remaining <= 0) {
      remaining = 0;
      clearInterval(activeTimer);
    }

    updateDisplay(remaining);
    updateStages();
    updateProgressBar();

  }, 1000);
}

function updateDisplay(remaining) {
  document.getElementById("countdown").innerText = formatTime(remaining);
  document.getElementById("elapsed").innerText = formatTime(elapsedSeconds);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

function updateStages() {
  stageThresholds.forEach((threshold, index) => {
    if (elapsedSeconds >= threshold) {
      const stageDiv = document.getElementById(`stage-${index}`);
      stageDiv.classList.add("completed");
      stageDiv.querySelector("input").checked = true;
    }
  });
}

function updateProgressBar() {
  const percent = (elapsedSeconds / totalSeconds) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

function closeSOPModal() {
  clearInterval(activeTimer);
  document.getElementById("sopModal").classList.add("hidden");
}


function initMobileAutoSlide() {

  const slider = document.getElementById("mobileSlider");
  if (!slider) return;
  if (window.innerWidth > 768) return;

  let index = 0;
  const slides = slider.children;
  const totalSlides = slides.length;

  let autoSlide = setInterval(nextSlide, 2000);

  function nextSlide() {
    index = (index + 1) % totalSlides;

    slider.scrollTo({
      left: slider.clientWidth * index,
      behavior: "smooth"
    });
  }

  // Pause when user interacts
  slider.addEventListener("touchstart", () => {
    clearInterval(autoSlide);
  });

  slider.addEventListener("touchend", () => {
    autoSlide = setInterval(nextSlide, 2000);
  });
}

window.addEventListener("load", initMobileAutoSlide);
