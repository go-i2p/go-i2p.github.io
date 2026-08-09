
// go-i2p i18n module
(function() {
  const STORAGE_KEY = 'go-i2p-lang';
  const DEFAULT_LANG = 'en';
  const RTL_LANGS = ['ar', 'he', 'fa', 'ur', 'ps', 'ku', 'dv', 'yi'];
  
  // Detect browser language
  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    const nav = navigator.language || navigator.userLanguage || DEFAULT_LANG;
    const code = nav.split('-')[0].toLowerCase();
    return code;
  }

  // Load translation file
  async function loadLang(lang) {
    try {
      const resp = await fetch('lang/' + lang + '.json');
      if (!resp.ok) throw new Error('not found');
      return await resp.json();
    } catch {
      if (lang !== DEFAULT_LANG) {
        const resp = await fetch('lang/' + DEFAULT_LANG + '.json');
        return await resp.json();
      }
      return {};
    }
  }

  // Apply translations to DOM
  function apply(t, fallback) {
    const src = fallback || {};
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t[key] !== undefined && t[key] !== '' ? t[key] : src[key];
      if (val !== undefined) {
        el.textContent = val;
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = t[key] !== undefined && t[key] !== '' ? t[key] : src[key];
      if (val !== undefined) {
        el.setAttribute('placeholder', val);
      }
    });
    // Update html lang attribute
    document.documentElement.lang = t._lang || 'en';
    // Set text direction for RTL languages
    document.documentElement.dir = RTL_LANGS.includes(t._lang) ? 'rtl' : 'ltr';
  }

  // Dynamically adjust badge column width based on actual rendered text
  function fitBadges() {
    let maxW = 0;
    document.querySelectorAll('.badge').forEach(el => {
      el.style.whiteSpace = 'nowrap';
      const w = el.scrollWidth;
      if (w > maxW) maxW = w;
    });

    const colW = Math.min(Math.max(maxW + 24, 44), 100);

    let style = document.getElementById('i18n-badge-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'i18n-badge-style';
      document.head.appendChild(style);
    }

    style.textContent =
      `.row { grid-template-columns: 140px ${colW}px 1fr auto !important; }\n` +
      `@media (max-width: 700px) { .row { grid-template-columns: 120px ${Math.min(colW, 72)}px 1fr !important; } }\n` +
      `@media (max-width: 480px) { .row { grid-template-columns: 100px ${Math.min(colW, 64)}px 1fr !important; } }`;
  }

  // Build language selector with ARIA + keyboard navigation
  function buildSelector(currentLang) {
    const langs = [
      ['en','English'],['zh','中文'],['ru','Русский'],['es','Español'],['tr','Türkçe']
    ];

    const container = document.getElementById('lang-selector');
    if (!container) return;
    
    // Button with ARIA
    const btn = document.createElement('button');
    btn.className = 'lang-btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Select language');
    const currentName = langs.find(l => l[0] === currentLang)?.[1] || 'English';
    btn.textContent = currentName;
    const arrow = document.createElement('span');
    arrow.className = 'lang-arrow';
    arrow.textContent = ' ▾';
    arrow.setAttribute('aria-hidden', 'true');
    btn.appendChild(arrow);
    
    // Dropdown with ARIA
    const dropdown = document.createElement('div');
    dropdown.className = 'lang-dropdown';
    dropdown.setAttribute('role', 'listbox');
    dropdown.setAttribute('aria-label', 'Language options');
    dropdown.style.display = 'none';
    
    langs.forEach(([code, name]) => {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = name;
      a.setAttribute('role', 'option');
      a.setAttribute('aria-selected', code === currentLang ? 'true' : 'false');
      if (code === currentLang) a.className = 'lang-active';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.setItem(STORAGE_KEY, code);
        window.location.reload();
      });
      dropdown.appendChild(a);
    });
    
    // Toggle dropdown
    btn.addEventListener('click', () => {
      const isOpen = dropdown.style.display !== 'none';
      dropdown.style.display = isOpen ? 'none' : 'block';
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      if (!isOpen) {
        const active = dropdown.querySelector('.lang-active');
        if (active) active.focus();
      }
    });
    
    // Keyboard navigation
    dropdown.addEventListener('keydown', (e) => {
      const items = Array.from(dropdown.querySelectorAll('a'));
      const current = document.activeElement;
      const idx = items.indexOf(current);
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = idx < items.length - 1 ? idx + 1 : 0;
        items[next].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = idx > 0 ? idx - 1 : items.length - 1;
        items[prev].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (current && current.tagName === 'A') current.click();
      } else if (e.key === 'Escape') {
        dropdown.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
    
    // Make dropdown items focusable
    dropdown.querySelectorAll('a').forEach(a => {
      a.setAttribute('tabindex', '-1');
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
      }
    });
    
    container.appendChild(btn);
    container.appendChild(dropdown);
  }

  // Init
  async function init() {
    const lang = detectLang();
    const enT = await loadLang(DEFAULT_LANG);
    let t = enT;
    if (lang !== DEFAULT_LANG) {
      t = await loadLang(lang);
    }
    apply(t, enT);
    fitBadges();
    buildSelector(lang);
    // Dynamic build date
    const dateEl = document.getElementById('build-date');
    if (dateEl) dateEl.textContent = new Date().toISOString().slice(0, 10);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
