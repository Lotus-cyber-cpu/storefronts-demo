/* ==========================================================================
   АвтоЦентр Брест — общие блоки (шапка, подвал, контакт-бар, избранное)
   Внедряются через JS, чтобы не дублировать разметку в 11 HTML-файлах.
   ========================================================================== */

(function () {
  const PHONE = '+375 29 123-45-67';
  const PHONE_HREF = 'tel:+375291234567';
  const WHATSAPP_HREF = 'https://wa.me/375291234567';
  const INSTAGRAM_HREF = 'https://instagram.com/avtocentr_brest';

  const NAV_ITEMS = [
    { href: 'catalog.html', label: 'Каталог' },
    { href: 'leasing.html', label: 'Лизинг' },
    { href: 'calculator.html', label: 'Калькулятор' },
    { href: 'order-abroad.html', label: 'Под заказ' },
    { href: 'trade-in.html', label: 'Оценка авто' },
    { href: 'contacts.html', label: 'Контакты' },
  ];

  const ICONS = {
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 21s-7.5-4.6-10-9C.3 8.4 2 4.5 6 4c2.3-.3 4.2 1 6 3.2C13.8 5 15.7 3.7 18 4c4 .5 5.7 4.4 4 8-2.5 4.4-10 9-10 9z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3A19.5 19.5 0 0 1 5 12.7 19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .4 2 .6 3 .7a2 2 0 0 1 1.7 2z"/></svg>',
    whatsapp: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.4.7 4.6 1.9 6.5L4 29l7.7-1.9a12 12 0 0 0 4.3.8c6.6 0 12-5.4 12-12S22.6 3 16 3zm7 17.1c-.3.8-1.7 1.6-2.4 1.7-.6.1-1.4.1-2.2-.1-.5-.2-1.2-.4-2-.8-3.5-1.5-5.8-5-6-5.3-.2-.3-1.4-1.9-1.4-3.6 0-1.7.9-2.6 1.2-2.9.3-.3.7-.4 1-.4h.7c.2 0 .5 0 .8.6.3.7 1 2.4 1.1 2.6.1.2.2.4 0 .7-.1.3-.2.4-.4.6-.2.3-.4.5-.6.7-.2.2-.4.5-.2.9.2.4 1 1.6 2.1 2.6 1.4 1.3 2.6 1.7 3 1.9.4.2.6.1.8-.1.2-.2.9-1 1.1-1.4.2-.4.5-.3.8-.2.3.1 2 1 2.4 1.1.4.2.6.3.7.5.1.2.1.9-.2 1.6z"/></svg>',
    burger: '<span></span><span></span><span></span>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
  };

  function headerHTML(active) {
    const nav = NAV_ITEMS.map(i => `<a href="${i.href}" class="${active === i.href ? 'active' : ''}">${i.label}</a>`).join('');
    return `
    <header class="site-header">
      <div class="container">
        <a href="index.html" class="brand">
          <img src="assets/logo.svg" alt="АвтоЦентр Брест">
          <span class="brand-name"><span>АвтоЦентр</span><span>Брест</span></span>
        </a>
        <nav class="main-nav" id="main-nav">${nav}</nav>
        <div class="header-actions">
          <button class="icon-btn burger" id="burger-btn" aria-label="Меню">${ICONS.burger}</button>
          <button class="icon-btn" id="fav-btn" aria-label="Избранное">${ICONS.heart}<span class="fav-count" id="fav-count" hidden>0</span></button>
          <div class="header-phone">
            <a href="${PHONE_HREF}">${PHONE}</a>
            <span>Ежедневно 9:00–20:00</span>
          </div>
        </div>
      </div>
    </header>`;
  }

  function footerHTML() {
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">
              <img src="assets/logo.svg" alt="АвтоЦентр Брест">
              <span class="brand-name font-serif"><span>АвтоЦентр</span><span>Брест</span></span>
            </div>
            <p style="color:var(--color-text-muted)">Автомобили с пробегом — из собственного наличия и под заказ из-за рубежа. Проверка, гарантия, лизинг.</p>
            <div class="social-row" style="margin-top:16px">
              <a href="${INSTAGRAM_HREF}" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.instagram}</a>
              <a href="${WHATSAPP_HREF}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICONS.whatsapp}</a>
            </div>
          </div>
          <div>
            <h4>Покупателям</h4>
            <ul>
              <li><a href="catalog.html">Каталог</a></li>
              <li><a href="leasing.html">Лизинг</a></li>
              <li><a href="calculator.html">Калькулятор</a></li>
              <li><a href="order-abroad.html">Заказ из-за рубежа</a></li>
              <li><a href="trade-in.html">Trade-in / оценка</a></li>
            </ul>
          </div>
          <div>
            <h4>Доверие</h4>
            <ul>
              <li><a href="vin-check.html">Проверка авто (VIN)</a></li>
              <li><a href="warranty.html">Гарантия</a></li>
              <li><a href="about.html">О салоне</a></li>
              <li><a href="reviews.html">Отзывы</a></li>
            </ul>
          </div>
          <div>
            <h4>Контакты</h4>
            <ul>
              <li><a href="${PHONE_HREF}">${PHONE}</a></li>
              <li><a href="${WHATSAPP_HREF}" target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href="contacts.html">г. Брест, ул. Примерная, 10</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} АвтоЦентр Брест. Реквизиты и юр. информация — по согласованию с клиентом.</span>
          <span>Демо-сборка сайта · не является публичной офертой</span>
        </div>
      </div>
    </footer>`;
  }

  function contactBarHTML() {
    return `
    <div class="contact-bar">
      <a class="fab fab-ig" href="${INSTAGRAM_HREF}" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.instagram}</a>
      <a class="fab fab-wa" href="${WHATSAPP_HREF}" target="_blank" rel="noopener" aria-label="Написать в WhatsApp">${ICONS.whatsapp}</a>
      <a class="fab fab-call" href="${PHONE_HREF}" aria-label="Позвонить">${ICONS.phone}</a>
    </div>
    <div class="contact-bar-mobile">
      <a class="btn btn-outline" href="${WHATSAPP_HREF}" target="_blank" rel="noopener">WhatsApp</a>
      <a class="btn btn-primary" href="${PHONE_HREF}">Позвонить</a>
    </div>`;
  }

  function paletteSwitcherHTML() {
    return `
    <div class="palette-switcher" role="group" aria-label="Выбор цветовой палитры">
      <button class="ps-toggle" id="ps-toggle" aria-label="Выбор палитры" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="7.5" cy="10.3" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="7.3" r="1.3" fill="currentColor" stroke="none"/><circle cx="16.5" cy="10.3" r="1.3" fill="currentColor" stroke="none"/><circle cx="10" cy="15.2" r="1.3" fill="currentColor" stroke="none"/></svg>
      </button>
      <div class="ps-panel">
        <span class="ps-label">Палитра (§5.1 ТЗ)</span>
        <div class="ps-options">
          <button class="ps-swatch ps-a" data-theme="a" title="A — Navy &amp; Gold" aria-pressed="false"></button>
          <button class="ps-swatch ps-b" data-theme="b" title="B — Cream &amp; Bronze" aria-pressed="false"></button>
          <button class="ps-swatch ps-c" data-theme="c" title="C — Charcoal &amp; Copper" aria-pressed="false"></button>
          <button class="ps-swatch ps-d" data-theme="d" title="D — Ivory, Emerald &amp; Brass" aria-pressed="false"></button>
        </div>
      </div>
    </div>`;
  }

  function drawerHTML() {
    return `
    <div class="drawer-backdrop" id="drawer-backdrop"></div>
    <aside class="drawer" id="fav-drawer" aria-label="Избранные автомобили">
      <div class="drawer-head">
        <h3 class="font-serif">Избранное</h3>
        <button class="icon-btn" id="drawer-close" aria-label="Закрыть">✕</button>
      </div>
      <div class="drawer-body" id="drawer-body"></div>
    </aside>`;
  }

  function mount(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  window.ACB = window.ACB || {};
  window.ACB.PHONE = PHONE;
  window.ACB.PHONE_HREF = PHONE_HREF;
  window.ACB.WHATSAPP_HREF = WHATSAPP_HREF;
  window.ACB.INSTAGRAM_HREF = INSTAGRAM_HREF;
  window.ACB.mountLayout = function (activePage) {
    mount('site-header', headerHTML(activePage));
    mount('site-footer', footerHTML());
    mount('contact-bar-root', contactBarHTML());
    mount('palette-switcher-root', paletteSwitcherHTML());
    mount('drawer-root', drawerHTML());
    document.dispatchEvent(new CustomEvent('acb:layout-mounted'));
  };
})();
