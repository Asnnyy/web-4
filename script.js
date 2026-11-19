// PULSE — interactive map and booking
(() => {
  "use strict";

  const svgIcon = (content) => `
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#F0DFFF"/><stop offset=".48" stop-color="#BB63D4"/><stop offset="1" stop-color="#7546D7"/>
        </linearGradient>
        <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity=".08"/>
        </linearGradient>
      </defs>${content}
    </svg>`;

  // Авторские векторные объекты, выполненные в единой градиентной стилистике.
  const icons = [
    svgIcon(`<rect x="12" y="39" width="14" height="23" rx="5" fill="url(#metal)"/><rect x="74" y="39" width="14" height="23" rx="5" fill="url(#metal)"/><rect x="23" y="45" width="54" height="11" rx="5" fill="url(#metal)"/><path d="M28 47h43" stroke="white" stroke-opacity=".65" stroke-width="2"/>`),
    svgIcon(`<path d="M35 15c-12 0-19 12-17 25l5 25c2 11 12 18 24 15l12-4c12-4 17-17 11-27L54 23c-4-6-11-9-19-8Z" fill="url(#metal)"/><path d="m27 40 31 12m-29-1 31 12m-30-1 22 10" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M39 17c5-6 16-4 21 3l8 13-22 11-17-19 10-8Z" fill="url(#shine)"/>`),
    svgIcon(`<path d="M50 78C4 72 15 35 43 43c-1-18 19-25 25-6 21-9 34 27-18 41Z" fill="url(#metal)"/><path d="M50 77c-8-17-10-27-7-42m7 42c9-17 15-25 26-29M50 77c-12-12-22-16-34-16" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M50 80V35" stroke="white" stroke-opacity=".65" stroke-width="2"/>`),
    svgIcon(`<ellipse cx="50" cy="50" rx="31" ry="39" transform="rotate(28 50 50)" stroke="url(#metal)" stroke-width="12"/><ellipse cx="50" cy="50" rx="23" ry="31" transform="rotate(28 50 50)" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`),
    svgIcon(`<circle cx="50" cy="17" r="9" fill="url(#metal)"/><path d="M47 29 35 49l-17 9m29-28 15 18 17-1M37 47l12 9-8 23m8-23 18 18" stroke="url(#metal)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="m30 39 13 3m16-3 12 8" stroke="white" stroke-width="2" stroke-linecap="round"/>`),
    svgIcon(`<circle cx="50" cy="53" r="28" stroke="url(#metal)" stroke-width="9"/><circle cx="50" cy="53" r="5" fill="url(#metal)"/><path d="m50 53 20-27 11 0m-31 27-24 0-8-15m32 15 13 23" stroke="url(#metal)" stroke-width="6" stroke-linecap="round"/><path d="m36 23 14 30" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`),
    svgIcon(`<path d="M27 23c12 4 18 17 14 29l-9 23m41-52C60 31 54 43 59 54l9 21M41 51l18 3m-18-3-14-12m32 15 14-10" stroke="url(#metal)" stroke-width="10" stroke-linecap="round"/><circle cx="50" cy="14" r="8" fill="url(#metal)"/><path d="m23 77 16-5m21 5 17-5" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`),
    svgIcon(`<path d="M27 29h46l-5 19H32l-5-19Z" fill="url(#metal)"/><path d="M32 48h36l7 30H25l7-30Z" fill="url(#metal)"/><path d="M34 29c0-11 7-18 16-18s16 7 16 18" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M38 54h24" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>`)
  ];

  const directions = [
    { name:"Силовой тренинг", short:"Развитие силы и мышц", description:"Работа с отягощениями и развитие физической силы.", coaches:["Александр","Дмитрий"] },
    { name:"Бокс", short:"Сила и координация", description:"Техника ударов, координация, работа ног и выносливость.", coaches:["Марк","Илья"] },
    { name:"Йога", short:"Баланс и спокойствие", description:"Дыхание, асаны и осознанная работа с телом.", coaches:["Анна","Мария"] },
    { name:"Пилатес", short:"Контроль тела", description:"Укрепление мышц кора, развитие контроля и улучшение осанки.", coaches:["Анна","Полина"] },
    { name:"Танцы", short:"Ритм и движение", description:"Хореография, музыкальность и свобода самовыражения.", coaches:["Екатерина","Алина"] },
    { name:"Cycling", short:"Кардионагрузка", description:"Энергичная кардиотренировка на велотренажёрах.", coaches:["Денис","Марк"] },
    { name:"Растяжка", short:"Гибкость и мобильность", description:"Мягкая работа над мобильностью и гибкостью.", coaches:["Екатерина","Полина"] },
    { name:"Функциональный тренинг", short:"Общая подготовка", description:"Динамичные упражнения на силу, баланс и выносливость.", coaches:["Дмитрий","Александр"] }
  ];

  const positions = [
    [16,25],[49,13],[82,25],[85,76],[50,87],[16,76],[8,50],[92,50]
  ];

  const mapNodes = document.getElementById("mapNodes");
  const cards = document.getElementById("directionCards");
  const overlay = document.getElementById("drawerOverlay");
  const form = document.getElementById("bookingForm");
  const dateInput = document.getElementById("bookingDate");
  let selectedTime = "";

  // Устанавливаем минимальную дату — сегодня.
  const now = new Date();
  const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString().slice(0,10);
  dateInput.min = localToday;
  dateInput.value = localToday;

  // Строим точки интерактивной карты и карточки направлений.
  directions.forEach((direction, index) => {
    const [x,y] = positions[index];

    const node = document.createElement("button");
    node.type = "button";
    node.className = "map-node";
    node.style.left = `${x}%`;
    node.style.top = `${y}%`;
    node.style.animationDelay = `${index * .18}s`;
    node.innerHTML = `${icons[index]}<span>${direction.name}</span>`;
    node.setAttribute("aria-label", `Записаться: ${direction.name}`);
    node.addEventListener("click", () => openBooking(index));
    mapNodes.appendChild(node);

    const card = document.createElement("button");
    card.type = "button";
    card.className = "direction-card";
    card.innerHTML = `
      <div class="direction-art">${icons[index]}</div>
      <h3>${direction.name}</h3>
      <p>${direction.short}</p>`;
    card.addEventListener("click", () => openBooking(index));
    cards.appendChild(card);
  });

  function openBooking(index) {
    const direction = directions[index];
    selectedTime = "";
    document.getElementById("drawerTitle").textContent = direction.name;
    document.getElementById("drawerIcon").innerHTML = icons[index];
    document.getElementById("drawerDescription").textContent = direction.description;
    document.getElementById("bookingFeedback").replaceChildren();
    document.getElementById("selectedTime").value = "";

    const coachSelect = document.getElementById("coachSelect");
    coachSelect.innerHTML = '<option value="">Выбрать тренера</option>';
    direction.coaches.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      coachSelect.appendChild(option);
    });

    const timeGrid = document.getElementById("timeGrid");
    timeGrid.replaceChildren();
    ["09:00","10:30","12:00","14:00","16:30","18:00","19:30"].forEach(time => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "time-button";
      button.textContent = time;
      button.addEventListener("click", () => {
        selectedTime = time;
        document.getElementById("selectedTime").value = time;
        timeGrid.querySelectorAll(".time-button").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
      });
      timeGrid.appendChild(button);
    });

    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("closeDrawer").focus();
  }

  function closeBooking() {
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  document.getElementById("closeDrawer").addEventListener("click", closeBooking);
  document.getElementById("collapseDrawer").addEventListener("click", closeBooking);
  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeBooking();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !overlay.hidden) closeBooking();
  });

  document.getElementById("headerBook").addEventListener("click", () => openBooking(0));
  document.getElementById("bottomBook").addEventListener("click", () => openBooking(0));

  // Демонстрационная отправка: показывает обратную связь, но не отправляет данные на сервер.
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    if (!selectedTime) {
      document.getElementById("bookingFeedback").textContent = "Пожалуйста, выбери время занятия.";
      return;
    }

    const name = document.getElementById("clientName").value.trim();
    const direction = document.getElementById("drawerTitle").textContent;
    const coach = document.getElementById("coachSelect").value;
    const date = dateInput.value;
    const contact = document.getElementById("clientContact").value.trim();

    const message = document.createElement("div");
    message.className = "feedback-message";
    message.textContent = `✓ ${name}, заявка сформирована! Направление: ${direction}. Тренер: ${coach}. Дата: ${date}, время: ${selectedTime}. Контакт: ${contact}. Это демонстрационная версия — данные никуда не отправлены.`;
    document.getElementById("bookingFeedback").replaceChildren(message);
  });

  // Плавная прокрутка к разделам.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior:"smooth" });
      }
    });
  });
})();
