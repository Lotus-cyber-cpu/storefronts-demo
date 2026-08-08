/* ==========================================================================
   АвтоЦентр Брест — админ-панель, общая логика (демо, §6 ТЗ)
   Полностью статично: данные живут в localStorage браузера,
   ничего никуда не отправляется. Для показа клиенту концепции модуля.
   ========================================================================== */

(function (global) {
  const LS = {
    cars: 'acb_admin_cars',
    leads: 'acb_admin_leads',
    tradein: 'acb_admin_tradein',
    users: 'acb_admin_users',
    content: 'acb_admin_content',
    role: 'acb_admin_role',
  };

  const ROLES = {
    admin: { label: 'Администратор / владелец', sections: ['dashboard', 'cars', 'leads', 'leasing-docs', 'trade-in', 'users', 'content'] },
    manager: { label: 'Менеджер', sections: ['dashboard', 'cars', 'leads', 'trade-in', 'content'] },
    accountant: { label: 'Бухгалтер', sections: ['leasing-docs'] },
  };

  const NAV = [
    { key: 'dashboard', href: 'index.html', label: 'Дашборд', icon: 'grid' },
    { key: 'cars', href: 'cars.html', label: 'Автомобили', icon: 'car' },
    { key: 'leads', href: 'leads.html', label: 'Заявки', icon: 'inbox' },
    { key: 'leasing-docs', href: 'leasing-docs.html', label: 'Лизинг и документы', icon: 'doc' },
    { key: 'trade-in', href: 'trade-in.html', label: 'Оценка авто', icon: 'camera' },
    { key: 'users', href: 'users.html', label: 'Пользователи и роли', icon: 'users' },
    { key: 'content', href: 'content.html', label: 'Контент сайта', icon: 'edit' },
  ];

  const ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    car: '<path d="M3 13l1.5-5A2 2 0 0 1 6.4 6.5h11.2A2 2 0 0 1 19.5 8L21 13"/><rect x="2" y="13" width="20" height="6" rx="2"/><circle cx="7" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/>',
    inbox: '<path d="M4 4h16l-1.5 10H5.5L4 4z"/><path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
    doc: '<path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v4h4"/>',
    camera: '<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="14" r="3.5"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="9" r="2.6"/><path d="M15 14.2c2.6.3 4.5 2.4 4.5 5.8"/>',
    edit: '<path d="M4 20h4l11-11-4-4L4 16v4z"/>',
  };

  function icon(key) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[key] || ''}</svg>`;
  }

  /* ---------------- Seed data ---------------- */
  function seed() {
    if (!localStorage.getItem(LS.cars)) {
      const base = (global.ACB && global.ACB.CARS) || [];
      localStorage.setItem(LS.cars, JSON.stringify(base.map(c => ({
        id: c.id, title: c.title, brand: c.brand, model: c.model, year: c.year, price: c.price,
        mileage: c.mileage, country: c.country, status: c.status, img: c.img, hasReport: true,
      }))));
    }
    if (!localStorage.getItem(LS.leads)) {
      localStorage.setItem(LS.leads, JSON.stringify([
        { id: 'l1', type: 'Лизинг', name: 'Виктор Шевченко', phone: '+375 29 555-11-22', subject: 'Skoda Octavia, 2021', status: 'new', date: '2026-08-07' },
        { id: 'l2', type: 'Запись на просмотр', name: 'Наталья Ковалёва', phone: '+375 33 444-22-11', subject: 'BMW 520d, 2018 — сегодня 15:00', status: 'progress', date: '2026-08-07' },
        { id: 'l3', type: 'Заказ из-за рубежа', name: 'Игорь Петров', phone: '+375 29 111-22-33', subject: 'Volkswagen Tiguan, бюджет 45 000 р.', status: 'progress', date: '2026-08-06' },
        { id: 'l4', type: 'Trade-in', name: 'Светлана Мороз', phone: '+375 25 777-88-99', subject: 'Toyota Corolla 2018 в зачёт', status: 'new', date: '2026-08-06' },
        { id: 'l5', type: 'Лизинг', name: 'Дмитрий Азаров', phone: '+375 29 222-33-44', subject: 'Kia Sportage, 2022', status: 'closed', date: '2026-08-04' },
        { id: 'l6', type: 'Обратная связь', name: 'Ольга Волкова', phone: '+375 44 666-55-44', subject: 'Вопрос по гарантии', status: 'closed', date: '2026-08-02' },
      ]));
    }
    if (!localStorage.getItem(LS.tradein)) {
      localStorage.setItem(LS.tradein, JSON.stringify([
        { id: 't1', name: 'Светлана Мороз', phone: '+375 25 777-88-99', car: 'Toyota Corolla, 2018', mileage: '95 000 км', status: 'new', date: '2026-08-06', photos: 3 },
        { id: 't2', name: 'Андрей Ким', phone: '+375 29 999-00-11', car: 'Renault Megane, 2016', mileage: '142 000 км', status: 'review', date: '2026-08-05', photos: 5 },
        { id: 't3', name: 'Павел Гуров', phone: '+375 33 111-99-22', car: 'Ford Focus, 2015', mileage: '168 000 км', status: 'approved', date: '2026-08-01', photos: 4 },
      ]));
    }
    if (!localStorage.getItem(LS.users)) {
      localStorage.setItem(LS.users, JSON.stringify([
        { id: 'u1', name: 'Валик', role: 'admin', email: 'owner@avtocentr-brest.by' },
        { id: 'u2', name: 'Марина Соколова', role: 'manager', email: 'marina@avtocentr-brest.by' },
        { id: 'u3', name: 'Егор Липский', role: 'manager', email: 'egor@avtocentr-brest.by' },
        { id: 'u4', name: 'Анна Ткачук', role: 'accountant', email: 'buh@avtocentr-brest.by' },
      ]));
    }
    if (!localStorage.getItem(LS.content)) {
      localStorage.setItem(LS.content, JSON.stringify({
        homeBanner: 'Привезём под заказ из-за рубежа — подбор, проверка, доставка',
        hotOffer: 'Skoda Octavia 2021 — с проверкой и гарантией, от 560 р./мес в лизинг',
        aboutText: 'Продаём автомобили с пробегом в Бресте — из собственного наличия и под индивидуальный заказ из-за рубежа.',
        leasingText: 'Первый взнос от 10%, платёж — фиксированный каждый месяц.',
        orderAbroadText: 'Подбираем автомобиль под ваш бюджет и требования в Европе, проверяем и доставляем в Брест.',
        warrantyText: '6 месяцев гарантии на основные узлы и агрегаты каждого автомобиля.',
      }));
    }
    if (!localStorage.getItem(LS.role)) localStorage.setItem(LS.role, 'admin');
  }

  function get(key) { try { return JSON.parse(localStorage.getItem(LS[key])) || []; } catch (e) { return []; } }
  function set(key, val) { localStorage.setItem(LS[key], JSON.stringify(val)); }
  function getRole() { return localStorage.getItem(LS.role) || 'admin'; }
  function setRole(r) { localStorage.setItem(LS.role, r); }

  /* ---------------- Toast ---------------- */
  let toastTimer;
  function toast(msg) {
    let el = document.querySelector('.a-toast');
    if (!el) { el = document.createElement('div'); el.className = 'a-toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  /* ---------------- Sidebar ---------------- */
  function renderSidebar(activeKey) {
    const role = getRole();
    const allowed = ROLES[role].sections;
    const items = NAV.filter(n => allowed.includes(n.key));
    return `
    <aside class="admin-side">
      <a href="index.html" class="admin-brand">
        <img src="../assets/logo.svg" alt="АвтоЦентр Брест">
        <span><b>АвтоЦентр Брест</b><span>Админ-панель · демо</span></span>
      </a>
      <div class="side-group-label">Разделы</div>
      ${items.map(n => `<a class="side-link ${n.key === activeKey ? 'active' : ''}" href="${n.href}">${icon(n.icon)}${n.label}</a>`).join('')}
      <div class="side-foot">Публичный сайт: <a href="../index.html">← вернуться</a></div>
    </aside>`;
  }

  function renderTopbar(title, sub) {
    const role = getRole();
    return `
    <div class="admin-topbar">
      <div>
        <h1>${title}</h1>
        ${sub ? `<p>${sub}</p>` : ''}
      </div>
      <div class="role-switch">
        <label>Роль (демо)</label>
        <select id="role-select">
          ${Object.entries(ROLES).map(([k, v]) => `<option value="${k}" ${k === role ? 'selected' : ''}>${v.label}</option>`).join('')}
        </select>
      </div>
    </div>`;
  }

  function bindRoleSwitch() {
    const sel = document.getElementById('role-select');
    if (!sel) return;
    sel.addEventListener('change', () => {
      setRole(sel.value);
      location.reload();
    });
  }

  function mount(activeKey, title, sub) {
    seed();
    const shell = document.getElementById('admin-shell');
    shell.innerHTML = `${renderSidebar(activeKey)}<main class="admin-main" id="admin-main"></main>`;
    document.getElementById('admin-main').innerHTML =
      `<div class="demo-notice-admin"></div>${renderTopbar(title, sub)}<div id="admin-content"></div>`;
    bindRoleSwitch();

    const role = getRole();
    if (!ROLES[role].sections.includes(activeKey)) {
      const first = ROLES[role].sections[0];
      const target = NAV.find(n => n.key === first);
      document.getElementById('admin-content').innerHTML = `
        <div class="role-gate">
          <h2>Недостаточно прав</h2>
          <p>Роль «${ROLES[role].label}» не имеет доступа к разделу «${NAV.find(n => n.key === activeKey).label}».</p>
          ${target ? `<p style="margin-top:16px"><a class="a-btn a-btn-primary" href="${target.href}">Перейти в «${target.label}»</a></p>` : ''}
        </div>`;
      return false;
    }
    return true;
  }

  function pill(status, map) {
    return `<span class="pill pill-${status}">${map[status] || status}</span>`;
  }

  global.ACBAdmin = { LS, ROLES, NAV, get, set, getRole, setRole, toast, mount, pill, seed };
})(window);
