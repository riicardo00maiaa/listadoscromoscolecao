function setButtonState(btn, have) {
  btn.textContent = have ? "✓" : "✕";
  btn.className = "sticker-btn " + (have ? "have" : "missing");
}

function buildTableHeader() {
  const headerRow = document.getElementById("header-row");

  for (let i = 1; i <= STICKERS_PER_COUNTRY; i++) {
    const th = document.createElement("th");
    th.textContent = i;
    headerRow.appendChild(th);
  }
}

function buildTable() {
  const tbody = document.getElementById("tbody");

  COUNTRIES.forEach(country => {

    const tr = document.createElement("tr");
    tr.dataset.country = country;

    // Nome país
    const tdName = document.createElement("td");
    tdName.textContent = country;
    tr.appendChild(tdName);

    // Tenho
    const tdHave = document.createElement("td");
    tdHave.className = "td-have";
    tdHave.id = `have-${country}`;
    tr.appendChild(tdHave);

    // Faltam
    const tdMiss = document.createElement("td");
    tdMiss.className = "td-miss";
    tdMiss.id = `miss-${country}`;
    tr.appendChild(tdMiss);

    // Cromos
    for (let i = 1; i <= STICKERS_PER_COUNTRY; i++) {

      const td = document.createElement("td");

      const btn = document.createElement("button");

      btn.className = "sticker-btn";

      btn.dataset.country = country;
      btn.dataset.num = i;

      btn.setAttribute("aria-label", `${country} ${i}`);
      btn.title = `${country} ${i}`;

      btn.onclick = () => toggleSticker(country, i, btn);

      setButtonState(btn, state.countries[country][i]);

      td.appendChild(btn);
      tr.appendChild(td);
    }

    tbody.appendChild(tr);

    updateRowStats(country);
  });
}

function buildFWC() {

  const grid = document.getElementById("fwc-grid");

  for (let num = FWC_START; num <= FWC_END; num++) {

    const wrap = document.createElement("div");
    wrap.className = "fwc-item";

    const lbl = document.createElement("div");
    lbl.className = "fwc-lbl";
    lbl.textContent = num;

    const btn = document.createElement("button");

    btn.className = "sticker-btn";
    btn.dataset.fwc = num;

    btn.onclick = () => toggleFWC(num, btn);

    setButtonState(btn, state.fwc[num]);

    wrap.appendChild(lbl);
    wrap.appendChild(btn);

    grid.appendChild(wrap);
  }
}

function toggleSticker(country, num, btn) {

  state.countries[country][num] =
    !state.countries[country][num];

  setButtonState(
    btn,
    state.countries[country][num]
  );

  updateRowStats(country);
  updateGlobalStats();

  saveState();

  filterTable();
}

function toggleFWC(i, btn) {

  state.fwc[i] = !state.fwc[i];

  setButtonState(btn, state.fwc[i]);

  updateGlobalStats();

  saveState();
}

function updateRowStats(country) {

  const vals = Object.values(
    state.countries[country]
  );

  const have = vals.filter(v => v === true).length;

  document.getElementById(
    `have-${country}`
  ).textContent = have;

  document.getElementById(
    `miss-${country}`
  ).textContent = STICKERS_PER_COUNTRY - have;

  // linha completa
  const row = document.querySelector(
    `tr[data-country="${country}"]`
  );

  if (row) {
    row.classList.toggle(
      "completed",
      have === STICKERS_PER_COUNTRY
    );
  }
}

function updateGlobalStats() {

  let totalHave = 0;
  let totalMiss = 0;

  COUNTRIES.forEach(country => {

    const vals = Object.values(
      state.countries[country]
    );

    totalHave += vals.filter(v => v === true).length;

    totalMiss += vals.filter(v => v !== true).length;
  });

  const fwcHave =
    Object.values(state.fwc)
      .filter(v => v === true)
      .length;

  totalHave += fwcHave;
  totalMiss += FWC_COUNT - fwcHave;

  const total = totalHave + totalMiss;

  const pct = total
    ? Math.round((totalHave / total) * 100)
    : 0;

  document.getElementById("s-have").textContent =
    totalHave;

  document.getElementById("s-miss").textContent =
    totalMiss;

  document.getElementById("s-total").textContent =
    total;

  document.getElementById("s-pct").textContent =
    pct + "%";

  document.getElementById("progress-fill").style.width =
    pct + "%";
}

let currentFilter = "all";

function setFilter(filter, el) {

  currentFilter = filter;

  document
    .querySelectorAll(".filter-btn")
    .forEach(btn => {
      btn.classList.remove("active");
    });

  el.classList.add("active");

  filterTable();
}

function filterTable() {

  const query = document
    .getElementById("search")
    .value
    .toLowerCase();

  document.querySelectorAll("#tbody tr").forEach(tr => {

    const country = tr.dataset.country;

    const stickers = state.countries[country];

    if (!stickers) return;

    const have = Object.values(stickers)
      .filter(v => v === true)
      .length;

    let show = true;

    // pesquisa
    if (!country.toLowerCase().includes(query)) {
      show = false;
    }

    // só em falta
    if (
      currentFilter === "missing" &&
      have >= STICKERS_PER_COUNTRY
    ) {
      show = false;
    }

    // completos
    if (
      currentFilter === "complete" &&
      have < STICKERS_PER_COUNTRY
    ) {
      show = false;
    }

    tr.classList.toggle("hidden", !show);
  });
}