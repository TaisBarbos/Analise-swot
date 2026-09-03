import './style.css';

type CategoryKey = 'strengths' | 'opportunities' | 'weaknesses' | 'threats';

type Item = { id: number; text: string };
type BoardState = Record<CategoryKey, Item[]>;

const STORAGE_KEY = 'clareza-swot-board';
const categoryMeta: Record<CategoryKey, { title: string; label: string; hint: string; className: string; icon: string }> = {
  strengths: { title: 'Strengths', label: 'Forças', hint: 'O que fazemos muito bem?', className: 'strengths', icon: '+' },
  opportunities: { title: 'Opportunities', label: 'Oportunidades', hint: 'Onde podemos avançar?', className: 'opportunities', icon: '↗' },
  weaknesses: { title: 'Weaknesses', label: 'Fraquezas', hint: 'O que precisa melhorar?', className: 'weaknesses', icon: '−' },
  threats: { title: 'Threats', label: 'Ameaças', hint: 'O que pode nos afetar?', className: 'threats', icon: '!' },
};

const defaultState: BoardState = { strengths: [], opportunities: [], weaknesses: [], threats: [] };
let state: BoardState = loadState();
let nextId = Math.max(0, ...Object.values(state).flat().map((item) => item.id)) + 1;

function loadState(): BoardState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultState, ...JSON.parse(stored) } : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const status = document.querySelector<HTMLSpanElement>('#save-status');
  if (status) {
    status.textContent = 'Salvo agora';
    window.setTimeout(() => { status.textContent = 'Salvo automaticamente'; }, 1800);
  }
}

function totalItems(): number { return Object.values(state).reduce((total, items) => total + items.length, 0); }

function render(): void {
  const cards = (Object.keys(categoryMeta) as CategoryKey[]).map((key) => {
    const meta = categoryMeta[key];
    const items = state[key];
    return `<section class="swot-card ${meta.className}" data-category="${key}">
      <div class="card-heading">
        <div class="category-mark">${meta.icon}</div>
        <div><p class="eyebrow">${meta.label}</p><h2>${meta.title}</h2></div>
        <span class="count">${items.length}</span>
      </div>
      <p class="hint">${meta.hint}</p>
      <div class="items" data-items="${key}">${items.map((item) => `<div class="item-row"><span>${escapeHtml(item.text)}</span><button class="icon-button remove-item" data-id="${item.id}" aria-label="Remover item">×</button></div>`).join('')}</div>
      <form class="add-form" data-form="${key}"><input name="item" maxlength="120" placeholder="Adicionar um ponto..." autocomplete="off" /><button type="submit" class="add-button" aria-label="Adicionar item">+</button></form>
    </section>`;
  }).join('');

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<main class="shell">
    <header class="topbar"><div class="brand"><span class="brand-dot"></span><span>CLAREZA</span></div><div class="top-actions"><span id="save-status">Salvo automaticamente</span><button id="export-button" class="text-button">Exportar <span>↓</span></button></div></header>
    <section class="intro"><div><p class="kicker">MAPA ESTRATÉGICO / 01</p><h1>Veja o todo.<br /><em>Decida melhor.</em></h1></div><div class="intro-note"><span class="note-line"></span><p>Organize o cenário atual da sua ideia, projeto ou negócio em quatro perspectivas essenciais.</p></div></section>
    <div class="board-header"><div><h3>Matriz SWOT</h3><p>Adicione os pontos que definem o seu momento.</p></div><div class="board-tools"><span><strong id="total-count">${totalItems()}</strong> itens</span><button id="clear-button" class="clear-button">Limpar quadro</button></div></div>
    <div class="swot-grid">${cards}</div>
    <footer><span>CLAREZA <b>×</b> ESTRATÉGIA</span><span>SEU PRÓXIMO PASSO COMEÇA AQUI</span></footer>
  </main>`;

  bindEvents();
}

function escapeHtml(text: string): string { return text.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] ?? char)); }

function bindEvents(): void {
  document.querySelectorAll<HTMLFormElement>('.add-form').forEach((form) => form.addEventListener('submit', (event) => {
    event.preventDefault();
    const category = form.dataset.form as CategoryKey;
    const input = form.elements.namedItem('item') as HTMLInputElement;
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    state[category].push({ id: nextId++, text });
    saveState(); render();
    const nextInput = document.querySelector<HTMLInputElement>(`[data-form="${category}"] input`);
    nextInput?.focus();
  }));
  document.querySelectorAll<HTMLButtonElement>('.remove-item').forEach((button) => button.addEventListener('click', () => {
    const card = button.closest<HTMLElement>('[data-category]');
    const category = card?.dataset.category as CategoryKey;
    state[category] = state[category].filter((item) => item.id !== Number(button.dataset.id));
    saveState(); render();
  }));
  document.querySelector<HTMLButtonElement>('#clear-button')?.addEventListener('click', () => {
    if (totalItems() === 0 || window.confirm('Deseja limpar todos os itens da análise?')) {
      state = structuredClone(defaultState); saveState(); render();
    }
  });
  document.querySelector<HTMLButtonElement>('#export-button')?.addEventListener('click', () => {
    const content = JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'analise-swot.json'; anchor.click(); URL.revokeObjectURL(url);
  });
}

render();
