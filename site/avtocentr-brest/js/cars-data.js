/* ==========================================================================
   АвтоЦентр Брест — демо-данные автомобилей
   Реальные фото и цены — открытый вопрос к клиенту (см. ТЗ §9).
   До получения материалов каталог наполнен плейсхолдерами, сгенерированными
   на лету (SVG), чтобы витрина выглядела живой уже на этапе согласования.
   ========================================================================== */

(function (global) {
  const CAR_SILHOUETTE = `
    <g fill="rgba(255,255,255,.94)">
      <path d="M50 210 L50 175 Q50 158 66 152 L128 138 Q158 90 212 78 L308 78 Q356 82 380 130 L432 148 Q460 152 468 178 L468 210 Z"/>
      <path d="M128 138 L155 100 Q163 90 176 90 L296 90 Q312 90 322 104 L352 138 Z" fill="rgba(20,25,45,.82)"/>
      <rect x="236" y="90" width="8" height="48" fill="rgba(255,255,255,.94)"/>
    </g>
    <g fill="rgba(20,25,45,.5)">
      <rect x="58" y="188" width="26" height="16" rx="5"/>
      <rect x="424" y="182" width="30" height="18" rx="5"/>
    </g>
    <g>
      <circle cx="140" cy="216" r="42" fill="rgba(20,25,45,.65)"/>
      <circle cx="140" cy="216" r="19" fill="rgba(255,255,255,.92)"/>
      <circle cx="378" cy="216" r="42" fill="rgba(20,25,45,.65)"/>
      <circle cx="378" cy="216" r="19" fill="rgba(255,255,255,.92)"/>
    </g>`;

  function svgPlaceholder({ hueA, hueB, label, w = 800, h = 600, icon = 'car' }) {
    let inner = '', nativeW = 480, nativeH = 340, fraction = 0.5;
    if (icon === 'car') {
      inner = CAR_SILHOUETTE; nativeW = 520; nativeH = 260; fraction = 0.82;
    } else if (icon === 'wheel') {
      inner = `<circle cx="240" cy="170" r="90" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="10"/>
                <circle cx="240" cy="170" r="34" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="8"/>
                <g stroke="rgba(255,255,255,.5)" stroke-width="6">
                  <line x1="240" y1="90" x2="240" y2="130"/><line x1="240" y1="210" x2="240" y2="250"/>
                  <line x1="160" y1="170" x2="200" y2="170"/><line x1="280" y1="170" x2="320" y2="170"/>
                  <line x1="183" y1="113" x2="211" y2="141"/><line x1="269" y1="199" x2="297" y2="227"/>
                  <line x1="297" y1="113" x2="269" y2="141"/><line x1="211" y1="199" x2="183" y2="227"/>
                </g>`;
    } else if (icon === 'seat') {
      inner = `<g fill="none" stroke="rgba(255,255,255,.55)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M170 260 L170 150 C170 120 190 100 225 100 L 255 100 C 290 100 310 120 310 150 L 310 260"/>
                  <path d="M170 260 L 150 260 L150 300 L 330 300 L330 260 L 310 260"/>
                  <path d="M195 150 L 285 150"/>
                </g>`;
    } else if (icon === 'dash') {
      inner = `<g fill="none" stroke="rgba(255,255,255,.55)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="190" cy="180" r="46"/><circle cx="310" cy="180" r="46"/>
                  <path d="M120 230 C 120 150 360 150 360 230"/>
                  <circle cx="190" cy="180" r="8" fill="rgba(255,255,255,.55)"/>
                  <circle cx="310" cy="180" r="8" fill="rgba(255,255,255,.55)"/>
                </g>`;
    } else if (icon === 'engine') {
      inner = `<g fill="none" stroke="rgba(255,255,255,.55)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="150" y="140" width="180" height="110" rx="12"/>
                  <path d="M150 170 L120 170 L120 220 L150 220"/>
                  <path d="M180 140 L180 110 L220 110 L220 140"/>
                  <path d="M250 140 L250 110 L290 110 L290 140"/>
                  <circle cx="300" cy="195" r="16"/>
                </g>`;
    }
    const scale = (w * fraction) / nativeW;
    const tx = (w - nativeW * scale) / 2;
    const ty = (h - nativeH * scale) / 2;
    const showLabel = label && icon !== 'car';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="hsl(${hueA} 38% 24%)"/>
          <stop offset="1" stop-color="hsl(${hueB} 45% 12%)"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
      <g transform="translate(${tx},${ty}) scale(${scale})">${inner}</g>
      ${showLabel ? `<text x="24" y="${h - 22}" font-family="Inter,Arial,sans-serif" font-size="20" font-weight="700" fill="rgba(255,255,255,.6)">${label}</text>` : ''}
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  const HOTSPOTS = [
    { key: 'wheel', label: 'Колесо и диски', x: 20, y: 78, icon: 'wheel' },
    { key: 'salon', label: 'Салон', x: 46, y: 30, icon: 'seat' },
    { key: 'dash', label: 'Панель приборов', x: 65, y: 40, icon: 'dash' },
    { key: 'engine', label: 'Двигатель', x: 85, y: 55, icon: 'engine' },
  ];

  const SEED_CARS = [
    { id: 'toyota-camry-2020', brand: 'Toyota', model: 'Camry', year: 2020, price: 54900, mileage: 61000, country: 'Германия', fuel: 'Бензин', trans: 'Автомат', engine: '2.5 л, 181 л.с.', drive: 'Передний', color: 'Чёрный', vin: true, warranty: true, report: true, status: 'instock', hue: [206, 230] },
    { id: 'volkswagen-passat-2019', brand: 'Volkswagen', model: 'Passat B8', year: 2019, price: 41500, mileage: 88000, country: 'Литва', fuel: 'Дизель', trans: 'Автомат', engine: '2.0 л, 150 л.с.', drive: 'Передний', color: 'Серый', vin: true, warranty: true, report: true, status: 'instock', hue: [14, 40] },
    { id: 'skoda-octavia-2021', brand: 'Skoda', model: 'Octavia', year: 2021, price: 38900, mileage: 34000, country: 'Беларусь (в наличии)', fuel: 'Бензин', trans: 'Механика', engine: '1.4 л, 150 л.с.', drive: 'Передний', color: 'Белый', vin: true, warranty: true, report: true, status: 'instock', hue: [150, 190] },
    { id: 'bmw-520d-2018', brand: 'BMW', model: '520d', year: 2018, price: 49900, mileage: 102000, country: 'Германия', fuel: 'Дизель', trans: 'Автомат', engine: '2.0 л, 190 л.с.', drive: 'Задний', color: 'Синий', vin: true, warranty: true, report: true, status: 'reserved', hue: [230, 260] },
    { id: 'kia-sportage-2022', brand: 'Kia', model: 'Sportage', year: 2022, price: 62900, mileage: 21000, country: 'Польша', fuel: 'Бензин', trans: 'Автомат', engine: '1.6 л, 150 л.с.', drive: 'Полный', color: 'Красный', vin: true, warranty: true, report: true, status: 'instock', hue: [356, 20] },
    { id: 'hyundai-tucson-2020', brand: 'Hyundai', model: 'Tucson', year: 2020, price: 46900, mileage: 57000, country: 'Литва', fuel: 'Дизель', trans: 'Автомат', engine: '2.0 л, 185 л.с.', drive: 'Полный', color: 'Серебристый', vin: true, warranty: true, report: true, status: 'order', hue: [200, 220] },
    { id: 'mercedes-e200-2017', brand: 'Mercedes-Benz', model: 'E200', year: 2017, price: 47500, mileage: 121000, country: 'Германия', fuel: 'Бензин', trans: 'Автомат', engine: '2.0 л, 184 л.с.', drive: 'Задний', color: 'Чёрный', vin: true, warranty: true, report: true, status: 'instock', hue: [222, 250] },
    { id: 'renault-koleos-2019', brand: 'Renault', model: 'Koleos', year: 2019, price: 36900, mileage: 74000, country: 'Польша', fuel: 'Дизель', trans: 'Вариатор', engine: '2.0 л, 177 л.с.', drive: 'Полный', color: 'Коричневый', vin: true, warranty: true, report: true, status: 'instock', hue: [28, 50] },
    { id: 'nissan-qashqai-2021', brand: 'Nissan', model: 'Qashqai', year: 2021, price: 43900, mileage: 39000, country: 'Беларусь (в наличии)', fuel: 'Бензин', trans: 'Вариатор', engine: '1.3 л, 140 л.с.', drive: 'Передний', color: 'Белый', vin: true, warranty: true, report: true, status: 'sold', hue: [190, 210] },
    { id: 'mazda-cx5-2021', brand: 'Mazda', model: 'CX-5', year: 2021, price: 45900, mileage: 48000, country: 'Германия', fuel: 'Бензин', trans: 'Автомат', engine: '2.5 л, 194 л.с.', drive: 'Полный', color: 'Серый', vin: true, warranty: true, report: true, status: 'instock', hue: [268, 296] },
  ];

  function isGeneratedPlaceholder(img) {
    return typeof img === 'string' && img.indexOf('data:image/svg+xml') === 0;
  }

  function buildFullCar(raw) {
    const c = Object.assign({}, raw);
    c.title = c.title || `${c.brand} ${c.model}`;
    const hue = c.hue || [210, 225];
    const hasCustomPhoto = c.img && !isGeneratedPlaceholder(c.img);
    if (!hasCustomPhoto) {
      c.img = svgPlaceholder({ hueA: hue[0], hueB: hue[1], label: c.title, icon: 'car' });
    }
    c.thumbSmall = c.img;
    c.hotspotPhotos = HOTSPOTS.map(h => ({
      ...h,
      img: svgPlaceholder({ hueA: hue[0], hueB: hue[1], label: h.label, icon: h.icon, w: 480, h: 360 }),
    }));
    c.leaseFrom = Math.round((c.price * 0.85) / 60 / 5) * 5; // грубая оценка платежа для карточки
    return c;
  }

  // Если в этом браузере уже открывали админку — она хранит свою (редактируемую)
  // копию машин в localStorage под тем же ключом. Публичный сайт подхватывает
  // эти правки (фото, цену, статус), чтобы демо ощущалось как единая система.
  function loadAdminOverrides() {
    try {
      const raw = localStorage.getItem('acb_admin_cars');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length ? parsed : null;
    } catch (e) { return null; }
  }

  function buildCars() {
    const overrides = loadAdminOverrides();
    if (!overrides) return SEED_CARS.map(buildFullCar);
    const seedById = {};
    SEED_CARS.forEach(c => { seedById[c.id] = c; });
    const NEW_CAR_DEFAULTS = { fuel: '—', trans: '—', engine: '—', drive: '—', color: '—', vin: true, warranty: true, hue: [210, 225] };
    return overrides.map(admin => {
      const seed = seedById[admin.id] || NEW_CAR_DEFAULTS;
      return buildFullCar({ ...seed, ...admin });
    });
  }

  const CARS = buildCars();

  const STATUS_LABEL = {
    instock: 'В наличии',
    order: 'Под заказ',
    reserved: 'Резерв',
    sold: 'Продан',
  };

  function formatPrice(n) {
    return n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' р.';
  }

  function calcLeasePayment(price, downPct, months, ratePct) {
    const down = price * (downPct / 100);
    const principal = price - down;
    const monthlyRate = (ratePct / 100) / 12;
    if (monthlyRate === 0) return principal / months;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  }

  global.ACB = global.ACB || {};
  global.ACB.CARS = CARS;
  global.ACB.STATUS_LABEL = STATUS_LABEL;
  global.ACB.formatPrice = formatPrice;
  global.ACB.calcLeasePayment = calcLeasePayment;
  global.ACB.svgPlaceholder = svgPlaceholder;
})(window);
