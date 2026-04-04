const API_BASE_URL = "http://localhost:8080/api/giochi";

const state = {
  games: [],
  editingId: null,
  theme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",
};

const elements = {
  gameForm: document.getElementById("gameForm"),
  gameId: document.getElementById("gameId"),
  titolo: document.getElementById("titolo"),
  genere: document.getElementById("genere"),
  piattaforma: document.getElementById("piattaforma"),
  stato: document.getElementById("stato"),
  oreGiocate: document.getElementById("oreGiocate"),
  voto: document.getElementById("voto"),
  dataAcquisto: document.getElementById("dataAcquisto"),
  immagine: document.getElementById("immagine"),
  note: document.getElementById("note"),
  submitButton: document.getElementById("submitButton"),
  resetButton: document.getElementById("resetButton"),
  refreshButton: document.getElementById("refreshButton"),
  gamesContainer: document.getElementById("gamesContainer"),
  formStatus: document.getElementById("formStatus"),
  listStatus: document.getElementById("listStatus"),
  themeToggle: document.getElementById("themeToggle"),
  searchTitle: document.getElementById("searchTitle"),
  searchGenre: document.getElementById("searchGenre"),
  searchPlatform: document.getElementById("searchPlatform"),
};

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  if (elements.themeToggle) {
    elements.themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

function toggleTheme() {
  setTheme(state.theme === "dark" ? "light" : "dark");
}

function showStatus(target, message, type = "") {
  if (!target) return;
  target.textContent = message;
  target.className = "status-message";
  if (type) {
    target.classList.add(type);
  }
}

function clearStatus(target) {
  if (!target) return;
  target.textContent = "";
  target.className = "status-message";
}

function setSubmitLoading(isLoading) {
  elements.submitButton.disabled = isLoading;
  elements.submitButton.textContent = isLoading
    ? "Salvataggio..."
    : state.editingId !== null
    ? "Aggiorna gioco"
    : "Salva gioco";
}

function normalizeNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "N/D";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("it-IT").format(date);
}

function getFormData() {
  return {
    titolo: elements.titolo.value.trim(),
    genere: elements.genere.value.trim(),
    piattaforma: elements.piattaforma.value.trim(),
    stato: elements.stato.value.trim(),
    oreGiocate: normalizeNumber(elements.oreGiocate.value),
    voto: normalizeNumber(elements.voto.value),
    dataAcquisto: elements.dataAcquisto.value || null,
    immagine: elements.immagine.value.trim() || null,
    note: elements.note.value.trim() || null,
  };
}

function resetForm() {
  elements.gameForm.reset();
  elements.gameId.value = "";
  state.editingId = null;
  setSubmitLoading(false);
  clearStatus(elements.formStatus);
}

function fillForm(game) {
  state.editingId = Number(game.id);
  elements.gameId.value = game.id ?? "";
  elements.titolo.value = game.titolo ?? "";
  elements.genere.value = game.genere ?? "";
  elements.piattaforma.value = game.piattaforma ?? "";
  elements.stato.value = game.stato ?? "Da iniziare";
  elements.oreGiocate.value = game.oreGiocate ?? "";
  elements.voto.value = game.voto ?? "";
  elements.dataAcquisto.value = game.dataAcquisto ?? "";
  elements.immagine.value = game.immagine ?? "";
  elements.note.value = game.note ?? "";
  setSubmitLoading(false);
}

function getFilteredGames() {
  const titleQuery = elements.searchTitle.value.trim().toLowerCase();
  const genreQuery = elements.searchGenre.value.trim().toLowerCase();
  const platformQuery = elements.searchPlatform.value.trim().toLowerCase();

  return state.games.filter((game) => {
    const matchesTitle = (game.titolo ?? "").toLowerCase().includes(titleQuery);
    const matchesGenre = (game.genere ?? "").toLowerCase().includes(genreQuery);
    const matchesPlatform = (game.piattaforma ?? "")
      .toLowerCase()
      .includes(platformQuery);

    return matchesTitle && matchesGenre && matchesPlatform;
  });
}

function renderGames() {
  const filteredGames = getFilteredGames();

  if (!filteredGames.length) {
    elements.gamesContainer.innerHTML = `
      <div class="empty-state">
        <h3>Nessun gioco trovato</h3>
        <p>Prova a cambiare i filtri oppure aggiungi un nuovo titolo.</p>
      </div>
    `;
    return;
  }

  elements.gamesContainer.innerHTML = filteredGames
    .map((game) => {
      const imageMarkup = game.immagine
        ? `<img class="game-cover" src="${escapeHtml(
            game.immagine
          )}" alt="${escapeHtml(
            game.titolo
          )}" onerror="this.outerHTML='<div class=&quot;game-cover placeholder&quot;>🎮</div>'">`
        : `<div class="game-cover placeholder">🎮</div>`;

      return `
        <article class="game-card">
          ${imageMarkup}
          <div class="game-content">
            <div class="game-top">
              <h3 class="game-title">${escapeHtml(game.titolo)}</h3>
              <span class="badge status">${escapeHtml(game.stato ?? "N/D")}</span>
            </div>

            <div class="game-meta">
              <span><strong>ID:</strong> ${escapeHtml(game.id ?? "N/D")}</span>
              <span><strong>Genere:</strong> ${escapeHtml(game.genere ?? "N/D")}</span>
              <span><strong>Piattaforma:</strong> ${escapeHtml(game.piattaforma ?? "N/D")}</span>
              <span><strong>Ore giocate:</strong> ${escapeHtml(game.oreGiocate ?? "0")}</span>
              <span><strong>Voto:</strong> ${escapeHtml(game.voto ?? "N/D")}</span>
              <span><strong>Acquistato:</strong> ${escapeHtml(formatDate(game.dataAcquisto))}</span>
            </div>

            ${
              game.note
                ? `<p class="game-note">${escapeHtml(game.note)}</p>`
                : ""
            }

            <div class="game-actions">
              <button class="btn btn-small btn-edit" type="button" onclick="handleEdit(${Number(
                game.id
              )})">
                Modifica
              </button>
              <button class="btn btn-small btn-delete" type="button" onclick="handleDelete(${Number(
                game.id
              )})">
                Elimina
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadGames() {
  showStatus(elements.listStatus, "Caricamento giochi in corso...", "warning");

  try {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}`);
    }

    const data = await response.json();
    state.games = Array.isArray(data) ? data : [];
    renderGames();

    showStatus(
      elements.listStatus,
      `${state.games.length} giochi caricati correttamente.`,
      "success"
    );
  } catch (error) {
    state.games = [];
    renderGames();
    showStatus(
      elements.listStatus,
      "Errore durante il caricamento dei giochi.",
      "error"
    );
  }
}

async function createGame(payload) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Errore creazione gioco: HTTP ${response.status} - ${text}`);
  }

  return text ? JSON.parse(text) : null;
}

async function updateGame(id, payload) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Errore aggiornamento gioco: HTTP ${response.status} - ${text}`);
  }

  return text ? JSON.parse(text) : null;
}

async function deleteGame(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Errore eliminazione gioco: HTTP ${response.status}`);
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const formId = elements.gameId.value ? Number(elements.gameId.value) : null;
  state.editingId = formId;

  const payload = {
    id: formId,
    ...getFormData(),
  };

  if (!payload.titolo || !payload.genere || !payload.piattaforma) {
    showStatus(
      elements.formStatus,
      "Titolo, genere e piattaforma sono obbligatori.",
      "error"
    );
    return;
  }

try {
  setSubmitLoading(true);

  if (state.editingId !== null && !Number.isNaN(state.editingId)) {
    await updateGame(state.editingId, payload);
    showStatus(
      elements.formStatus,
      "Gioco aggiornato con successo!",
      "success"
    );
  } else {
    delete payload.id;
    await createGame(payload);
    showStatus(
      elements.formStatus,
      "Gioco creato correttamente.",
      "success"
    );
  }

  resetForm();
  await loadGames();
} catch (error) {
  showStatus(
    elements.formStatus,
    "Operazione fallita. Controlla backend e dati inseriti.",
    "error"
  );
} finally {
  setSubmitLoading(false);
}
}

function handleEdit(id) {
  const selectedGame = state.games.find(
    (game) => Number(game.id) === Number(id)
  );

  if (!selectedGame) {
    showStatus(elements.formStatus, "Gioco non trovato.", "error");
    return;
  }

  fillForm(selectedGame);

  showStatus(
    elements.formStatus,
    "Modalità modifica attiva. L'ID è bloccato e non modificabile.",
    "warning"
  );

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function handleDelete(id) {
  const confirmed = window.confirm("Vuoi davvero eliminare questo gioco?");
  if (!confirmed) return;

  try {
    await deleteGame(id);

    if (Number(state.editingId) === Number(id)) {
      resetForm();
    }

    await loadGames();
    showStatus(elements.listStatus, "Gioco eliminato correttamente.", "success");
  } catch (error) {
    showStatus(
      elements.listStatus,
      "Impossibile eliminare il gioco.",
      "error"
    );
  }
}

function applyFilters() {
  renderGames();
}

function bindEvents() {
  elements.gameForm.addEventListener("submit", handleFormSubmit);
  elements.resetButton.addEventListener("click", resetForm);
  elements.refreshButton.addEventListener("click", loadGames);
  elements.themeToggle.addEventListener("click", toggleTheme);

  elements.searchTitle.addEventListener("input", applyFilters);
  elements.searchGenre.addEventListener("input", applyFilters);
  elements.searchPlatform.addEventListener("input", applyFilters);
}

window.handleEdit = handleEdit;
window.handleDelete = handleDelete;

function init() {
  setTheme(state.theme);
  bindEvents();
  resetForm();
  loadGames();
}

document.addEventListener("DOMContentLoaded", init);