
// go-i2p i18n module
(function() {
  const STORAGE_KEY = 'go-i2p-lang';
  const DEFAULT_LANG = 'en';
  
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
  function apply(t) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        el.textContent = t[key];
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) {
        el.setAttribute('placeholder', t[key]);
      }
    });
    // Update html lang attribute
    document.documentElement.lang = t._lang || 'en';
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
      ['eo','Esperanto'],['la','Latina']
    ];

    const container = document.getElementById('lang-selector');
    if (!container) return;
    
    const btn = document.createElement('button');
    btn.className = 'lang-btn';
    btn.textContent = langs.find(l => l[0] === currentLang)?.[1] || 'English';
    btn.innerHTML += ' <span class="lang-arrow">▾</span>';
    
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
    const t = await loadLang(lang);
    apply(t);
    buildSelector(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
