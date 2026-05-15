
function defaultState() {
  const s = { countries: {}, fwc: {} };

  COUNTRIES.forEach(country => {
    s.countries[country] = {};
    for (let i = 1; i <= STICKERS_PER_COUNTRY; i++) {
      s.countries[country][i] = false; 
    }
  });

  for (let i = FWC_START; i <= FWC_END; i++) {
    s.fwc[i] = false;
  }

  return s;
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Erro ao carregar progresso:", e);
  }
  return defaultState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));


  const badge = document.getElementById("save-badge");
  badge.classList.add("show");
  setTimeout(() => badge.classList.remove("show"), 1500);
}

function resetAll() {
  if (!confirm("Tens a certeza? Isto apaga TODO o progresso!")) return;

  
  state = defaultState();


  document.querySelectorAll(".sticker-btn[data-country]").forEach(btn => {
    setButtonState(btn, false);
  });

 
  document.querySelectorAll(".sticker-btn[data-fwc]").forEach(btn => {
    setButtonState(btn, false);
  });

  COUNTRIES.forEach(c => updateRowStats(c));
  updateGlobalStats();
  saveState();
}

let state = loadState();