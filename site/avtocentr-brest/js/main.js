/* ==========================================================================
   АвтоЦентр Брест — интерактивность
   ========================================================================== */

(function () {
  const LS_FAV = 'acb_favorites';
  const LS_THEME = 'acb_theme';

  /* ---------------- Toast ---------------- */
  let toastTimer;
  function toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }
  window.ACB = window.ACB || {};
  window.ACB.toast = toast;

  /* ---------------- Palette switcher ---------------- */
  function initPalette() {
    const saved = localStorage.getItem(LS_THEME);
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    const swatches = document.querySelectorAll('.ps-swatch');
    const current = document.documentElement.getAttribute('data-theme') || 'a';
    swatches.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.theme === current)));
    swatches.forEach(btn => btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(LS_THEME, theme);
      swatches.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      const names = { a: 'A — Navy & Gold', b: 'B — Cream & Bronze', c: 'C — Charcoal & Copper', d: 'D — Ivory, Emerald & Brass' };
      toast('Палитра: ' + names[theme]);
    }));
  }

  /* ---------------- Mobile nav ---------------- */
  function initBurger() {
    const btn = document.getElementById('burger-btn');
    const nav = document.getElementById('main-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* ---------------- Favorites ---------------- */
  function getFavs() {
    try { return JSON.parse(localStorage.getItem(LS_FAV)) || []; } catch (e) { return []; }
  }
  function setFavs(list) {
    localStorage.setItem(LS_FAV, JSON.stringify(list));
    syncFavUI();
  }
  function isFav(id) { return getFavs().includes(id); }
  function toggleFav(id) {
    const favs = getFavs();
    const idx = favs.indexOf(id);
    if (idx > -1) { favs.splice(idx, 1); toast('Убрано из избранного'); }
    else { favs.push(id); toast('Добавлено в избранное'); }
    setFavs(favs);
  }
  function syncFavUI() {
    const favs = getFavs();
    document.querySelectorAll('[data-fav-toggle]').forEach(btn => {
      const id = btn.dataset.favToggle;
      btn.classList.toggle('active', favs.includes(id));
    });
    const countEl = document.getElementById('fav-count');
    if (countEl) {
      countEl.textContent = favs.length;
      countEl.hidden = favs.length === 0;
    }
    renderDrawer();
  }
  function renderDrawer() {
    const body = document.getElementById('drawer-body');
    if (!body) return;
    const favs = getFavs();
    const cars = (window.ACB.CARS || []).filter(c => favs.includes(c.id));
    if (!cars.length) {
      body.innerHTML = '<div class="drawer-empty">Пока пусто.<br>Нажмите на сердечко на карточке авто, чтобы сохранить его «на подумать».</div>';
      return;
    }
    body.innerHTML = cars.map(c => `
      <div class="drawer-item">
        <img src="${c.img}" alt="${c.title}">
        <div class="info">
          <div>${c.title}, ${c.year}</div>
          <div class="price">${window.ACB.formatPrice(c.price)}</div>
        </div>
        <button class="remove" data-remove-fav="${c.id}" aria-label="Убрать">✕</button>
      </div>`).join('') +
      `<a href="catalog.html" class="btn btn-primary btn-block" style="margin-top:8px">Смотреть в каталоге</a>`;
    body.querySelectorAll('[data-remove-fav]').forEach(b => b.addEventListener('click', () => toggleFav(b.dataset.removeFav)));
  }
  function initFavorites() {
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-fav-toggle]');
      if (btn) { e.preventDefault(); toggleFav(btn.dataset.favToggle); }
    });
    const favBtn = document.getElementById('fav-btn');
    const drawer = document.getElementById('fav-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close');
    function open() { drawer.classList.add('open'); backdrop.classList.add('open'); }
    function close() { drawer.classList.remove('open'); backdrop.classList.remove('open'); }
    if (favBtn) favBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    syncFavUI();
  }
  window.ACB.isFav = isFav;
  window.ACB.toggleFav = toggleFav;

  /* ---------------- Leasing calculator (reused: home, car, leasing page) ---------------- */
  function renderCalc(container) {
    const price = Number(container.dataset.price) || 40000;
    container.innerHTML = `
      <div class="calc-row">
        <label>Стоимость авто <span class="val" data-out="price">${window.ACB.formatPrice(price)}</span></label>
        <input type="range" min="5000" max="90000" step="500" value="${price}" data-inp="price">
      </div>
      <div class="calc-row">
        <label>Первый взнос <span class="val" data-out="down">30%</span></label>
        <input type="range" min="10" max="70" step="5" value="30" data-inp="down">
      </div>
      <div class="calc-row">
        <label>Срок лизинга <span class="val" data-out="months">36 мес.</span></label>
        <input type="range" min="12" max="60" step="6" value="36" data-inp="months">
      </div>
      <div class="calc-result">
        <div>
          <div class="cap">Платёж в месяц</div>
          <div class="num" data-out="payment">—</div>
        </div>
        <a href="leasing.html" class="btn btn-primary">Оставить заявку</a>
      </div>`;
    const priceInp = container.querySelector('[data-inp="price"]');
    const downInp = container.querySelector('[data-inp="down"]');
    const monthsInp = container.querySelector('[data-inp="months"]');
    function update() {
      const p = Number(priceInp.value), d = Number(downInp.value), m = Number(monthsInp.value);
      container.querySelector('[data-out="price"]').textContent = window.ACB.formatPrice(p);
      container.querySelector('[data-out="down"]').textContent = d + '%';
      container.querySelector('[data-out="months"]').textContent = m + ' мес.';
      const payment = window.ACB.calcLeasePayment(p, d, m, 12);
      container.querySelector('[data-out="payment"]').textContent = window.ACB.formatPrice(Math.round(payment)) + ' / мес.';
    }
    [priceInp, downInp, monthsInp].forEach(i => i.addEventListener('input', update));
    update();
  }
  function initCalculators() {
    document.querySelectorAll('[data-calc]').forEach(renderCalc);
  }
  window.ACB.renderCalc = renderCalc;

  /* ---------------- Photo hotspot viewer ---------------- */
  function initHotspotViewers() {
    document.querySelectorAll('[data-hotspot-viewer]').forEach(root => {
      const carId = root.dataset.hotspotViewer;
      const car = (window.ACB.CARS || []).find(c => c.id === carId);
      if (!car) return;
      const mainPhoto = root.querySelector('.main-photo img');
      const dotsLayer = root.querySelector('.dots-layer');
      const preview = root.querySelector('.hotspot-preview');
      const strip = root.querySelector('.hotspot-strip');
      mainPhoto.src = car.img;
      dotsLayer.innerHTML = car.hotspotPhotos.map((h, i) =>
        `<button class="hotspot-dot" style="left:${h.x}%;top:${h.y}%" data-i="${i}" aria-label="${h.label}">+</button>`).join('');
      strip.innerHTML = `<button class="active" data-i="main"><img src="${car.img}" alt="Общее фото"></button>` +
        car.hotspotPhotos.map((h, i) => `<button data-i="${i}"><img src="${h.img}" alt="${h.label}"></button>`).join('');

      function showPreview(h, x, y) {
        preview.innerHTML = `<img src="${h.img}" alt="${h.label}"><div class="cap">${h.label}</div>`;
        preview.style.left = Math.min(Math.max(x, 12), root.clientWidth - 232) + 'px';
        preview.style.top = Math.min(Math.max(y - 40, 12), root.clientHeight - 200) + 'px';
        preview.classList.add('show');
      }
      dotsLayer.querySelectorAll('.hotspot-dot').forEach(dot => {
        const h = car.hotspotPhotos[Number(dot.dataset.i)];
        dot.addEventListener('mouseenter', () => showPreview(h, dot.offsetLeft, dot.offsetTop));
        dot.addEventListener('mouseleave', () => preview.classList.remove('show'));
        dot.addEventListener('click', () => { mainPhoto.src = h.img; setActiveStrip(dot.dataset.i); });
      });
      function setActiveStrip(i) {
        strip.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.i === String(i)));
      }
      strip.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
        if (btn.dataset.i === 'main') { mainPhoto.src = car.img; }
        else { mainPhoto.src = car.hotspotPhotos[Number(btn.dataset.i)].img; }
        setActiveStrip(btn.dataset.i);
      }));
    });
  }

  /* ---------------- Booking widget (запись на просмотр) ---------------- */
  function initBooking() {
    document.querySelectorAll('[data-booking]').forEach(root => {
      const days = [];
      const dowNames = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
      const today = new Date();
      for (let i = 0; i < 10; i++) {
        const d = new Date(today.getTime() + i * 86400000);
        days.push(d);
      }
      const dayStrip = root.querySelector('.day-strip');
      const timeStrip = root.querySelector('.time-strip');
      const times = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:00'];
      dayStrip.innerHTML = days.map((d, i) => `
        <button class="day-chip ${i === 0 ? 'active' : ''}" data-i="${i}">
          <div class="dow">${dowNames[d.getDay()]}</div>
          <div class="dnum">${d.getDate()}</div>
        </button>`).join('');
      timeStrip.innerHTML = times.map((t, i) => `<button class="time-chip ${i === 1 ? 'active' : ''}" data-t="${t}">${t}</button>`).join('');
      dayStrip.querySelectorAll('.day-chip').forEach(c => c.addEventListener('click', () => {
        dayStrip.querySelectorAll('.day-chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
      }));
      timeStrip.querySelectorAll('.time-chip').forEach(c => c.addEventListener('click', () => {
        timeStrip.querySelectorAll('.time-chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
      }));
      const btn = root.querySelector('[data-booking-submit]');
      if (btn) btn.addEventListener('click', () => {
        const day = dayStrip.querySelector('.active .dnum').textContent;
        const time = timeStrip.querySelector('.active').dataset.t;
        toast(`Запись на просмотр: ${day} число, ${time}. Мы позвоним для подтверждения.`);
      });
    });
  }

  /* ---------------- Generic demo forms (show success block) ---------------- */
  function initForms() {
    document.querySelectorAll('form[data-demo-form]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const success = document.getElementById(form.dataset.demoForm);
        form.style.display = 'none';
        if (success) success.classList.add('show');
        toast('Заявка принята (демо)');
      });
    });
  }

  /* ---------------- Boot ---------------- */
  document.addEventListener('acb:layout-mounted', () => {
    initPalette();
    initBurger();
    initFavorites();
  });
  document.addEventListener('DOMContentLoaded', () => {
    initPalette();
    initCalculators();
    initHotspotViewers();
    initBooking();
    initForms();
  });
})();
