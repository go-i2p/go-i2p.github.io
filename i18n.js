
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
    // Measure the widest badge
    let maxW = 0;
    document.querySelectorAll('.badge').forEach(el => {
      // Temporarily let it expand freely
      el.style.whiteSpace = 'nowrap';
      const w = el.scrollWidth;
      if (w > maxW) maxW = w;
    });

    // Add padding (left+right ~20px) + some breathing room
    const colW = Math.min(Math.max(maxW + 24, 44), 100);

    // Inject a style rule to override .row grid-template-columns
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

  // Build language selector
  function buildSelector(currentLang) {
    const langs = [
      ['en','English'],['zh','中文'],['es','Español'],['ar','العربية'],['hi','हिन्दी'],
      ['bn','বাংলা'],['pt','Português'],['ru','Русский'],['ja','日本語'],['de','Deutsch'],
      ['fr','Français'],['tr','Türkçe'],['vi','Tiếng Việt'],['ko','한국어'],['it','Italiano'],
      ['th','ไทย'],['pl','Polski'],['nl','Nederlands'],['uk','Українська'],['ro','Română'],
      ['el','Ελληνικά'],['cs','Čeština'],['hu','Magyar'],['sv','Svenska'],['da','Dansk'],
      ['fi','Suomi'],['nb','Norsk'],['he','עברית'],['id','Bahasa Indonesia'],['ms','Bahasa Melayu'],
      ['tl','Filipino'],['sw','Kiswahili'],['am','አማርኛ'],['ne','नेपाली'],['si','සිංහල'],
      ['km','ភាសាខ្មែរ'],['my','မြန်မာဘာသာ'],['lo','ລາວ'],['ka','ქართული'],['hy','Հայերեն'],
      ['az','Azərbaycanca'],['uz','Oʻzbekcha'],['kk','Қазақша'],['tg','Тоҷикӣ'],['ky','Кыргызча'],
      ['tk','Türkmençe'],['mn','Монгол'],['bo','བོད་སྐད'],['dz','རྫོང་ཁ'],
      ['ha','Hausa'],['yo','Yorùbá'],['ig','Igbo'],['zu','isiZulu'],['af','Afrikaans'],
      ['xh','isiXhosa'],['cy','Cymraeg'],['ga','Gaeilge'],['gd','Gàidhlig'],['br','Brezhoneg'],
      ['eu','Euskara'],['ca','Català'],['gl','Galego'],['sq','Shqip'],['mk','Македонски'],
      ['bg','Български'],['sr','Српски'],['hr','Hrvatski'],['bs','Bosanski'],['sl','Slovenščina'],
      ['sk','Slovenčina'],['lt','Lietuvių'],['lv','Latviešu'],['et','Eesti'],['mt','Malti'],
      ['is','Íslenska'],['fa','فارسی'],['ps','پښتو'],['ku','Kurdî'],['ur','اردو'],
      ['so','Soomaali'],['mg','Malagasy'],['mi','Te Reo Māori'],['haw','ʻŌlelo Hawaiʻi'],
      ['sm','Gagana Samoa'],['to','Lea faka-Tonga'],['fj','Vosa Vakaviti'],
      ['eo','Esperanto'],['la','Latina'],['fo','Føroyskt'],['kl','Kalaallisut'],
      ['se','Davvisámegiella'],['lb','Lëtzebuergesch'],['rm','Rumantsch'],['be','Беларуская'],
      ['sn','Shona'],['rw','Kinyarwanda'],['ny','Chinyanja'],['st','Sesotho'],
      ['tn','Setswana'],['ts','Xitsonga'],['ln','Lingála']
    ];

    const container = document.getElementById('lang-selector');
    if (!container) return;
    
    const btn = document.createElement('button');
    btn.className = 'lang-btn';
    const currentName = langs.find(l => l[0] === currentLang)?.[1] || 'English';
    btn.textContent = currentName;
    const arrow = document.createElement('span');
    arrow.className = 'lang-arrow';
    arrow.textContent = ' ▾';
    btn.appendChild(arrow);
    
    const dropdown = document.createElement('div');
    dropdown.className = 'lang-dropdown';
    dropdown.style.display = 'none';
    
    langs.forEach(([code, name]) => {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = name;
      if (code === currentLang) a.className = 'lang-active';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.setItem(STORAGE_KEY, code);
        window.location.reload();
      });
      dropdown.appendChild(a);
    });
    
    btn.addEventListener('click', () => {
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
    
    container.appendChild(btn);
    container.appendChild(dropdown);
  }

  // Init
  async function init() {
    const lang = detectLang();
    // Always load English as fallback for missing keys
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
