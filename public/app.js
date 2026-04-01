const promptEl = document.querySelector('#prompt');
const runBtn = document.querySelector('#runBtn');
const clearBtn = document.querySelector('#clearBtn');
const outputEl = document.querySelector('#output');
const statusEl = document.querySelector('#status');
const historyEl = document.querySelector('#history');
const template = document.querySelector('#historyItemTemplate');
const themeToggle = document.querySelector('#themeToggle');

const HISTORY_KEY = 'thought-forge-history';
const THEME_KEY = 'thought-forge-theme';

const setStatus = (type, label) => {
  statusEl.className = `status ${type}`;
  statusEl.textContent = label;
};

const renderOutput = (result) => {
  outputEl.innerHTML = `
    <h3>Proposition B</h3>
    <p>${result.solution}</p>
    <h3>Contradictions / dissensus</h3>
    <p>${result.challenges}</p>
    <h3>Arbitrage C</h3>
    <p>${result.decision}</p>
  `;
};

const fakeAnalyze = async (text) => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const short = text.slice(0, 120);
  return {
    solution: `Créer une feuille de route en 3 étapes basée sur: “${short}”.`,
    challenges: 'Risque de sous-estimer les dépendances externes, le coût humain et la maintenance.',
    decision: 'Valider un MVP sur 2 semaines avec critères de succès mesurables puis itérer.'
  };
};

const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveHistory = (items) => localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 8)));

const rerenderHistory = () => {
  const items = getHistory();
  historyEl.innerHTML = '';

  if (!items.length) {
    historyEl.innerHTML = '<li class="muted">Aucun historique pour le moment.</li>';
    return;
  }

  items.forEach((item) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const button = node.querySelector('.history-btn');
    button.textContent = item;
    button.addEventListener('click', () => {
      promptEl.value = item;
      promptEl.focus();
    });
    historyEl.appendChild(node);
  });
};

runBtn.addEventListener('click', async () => {
  const text = promptEl.value.trim();

  if (!text) {
    setStatus('error', 'Saisis un contexte avant de lancer.');
    outputEl.innerHTML = '<p class="placeholder">Le champ contexte est vide.</p>';
    promptEl.focus();
    return;
  }

  setStatus('loading', 'Analyse en cours...');
  runBtn.disabled = true;

  try {
    const result = await fakeAnalyze(text);
    renderOutput(result);
    setStatus('done', 'Analyse terminée');

    const history = [text, ...getHistory().filter((entry) => entry !== text)];
    saveHistory(history);
    rerenderHistory();
  } catch (error) {
    setStatus('error', 'Erreur pendant l’analyse');
    outputEl.innerHTML = `<p class="placeholder">${error?.message || 'Erreur inconnue.'}</p>`;
  } finally {
    runBtn.disabled = false;
  }
});

clearBtn.addEventListener('click', () => {
  promptEl.value = '';
  outputEl.innerHTML = '<p class="placeholder">Aucun résultat pour le moment.</p>';
  setStatus('idle', 'En attente');
  promptEl.focus();
});

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
  themeToggle.textContent = isLight ? '🌞 Thème' : '🌙 Thème';
});

(() => {
  const theme = localStorage.getItem(THEME_KEY);
  if (theme === 'light') {
    document.body.classList.add('light');
    themeToggle.textContent = '🌞 Thème';
  }
  rerenderHistory();
})();
