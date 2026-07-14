// ===============================
// 주렁주렁 메인 페이지
// main.js
// ===============================

const CONFIG_URL = "./data/config.json";

let config = null;

// ===============================
// 시작
// ===============================
window.addEventListener("DOMContentLoaded", async () => {
  await loadConfig();

  updateStoreStatus();

  updateToday();

  // 1분마다 상태 갱신
  setInterval(() => {
    updateStoreStatus();
    updateToday();
  }, 60000);
});

// ===============================
// 설정 불러오기
// ===============================
async function loadConfig() {
  try {
    const response = await fetch(CONFIG_URL);

    if (!response.ok) {
      throw new Error("config.json을 불러올 수 없습니다.");
    }

    config = await response.json();

    applyStoreInfo();
  } catch (error) {
    console.error(error);
  }
}

// ===============================
// 지점 정보 적용
// ===============================
function applyStoreInfo() {
  const branch = document.querySelector(".branch");

  if (branch) {
    branch.textContent = config.storeName;
  }
}

// ===============================
// 운영 상태 표시
// ===============================
function updateStoreStatus() {
  if (!config) return;

  const badge = document.getElementById("statusBadge");
  const info = document.getElementById("businessInfo");

  const now = new Date();

  const today = now.toISOString().slice(0, 10);

  // 휴무 확인
  if (config.holiday.includes(today)) {
    badge.innerHTML = "⚫ 오늘 휴무";

    info.innerHTML = `
            <p>오늘은 휴무입니다.</p>
        `;

    return;
  }

  // 평일 / 주말 구분
  const day = now.getDay();

  const business =
    day === 0 || day === 6
      ? config.businessHours.weekend
      : config.businessHours.weekday;

  const current = now.getHours() * 60 + now.getMinutes();

  const open = timeToMinute(business.open);

  const close = timeToMinute(business.close);

  if (current >= open && current < close) {
    badge.innerHTML = "🟢 오늘 운영안내";

    badge.className = "open-title";
  } else {
    badge.innerHTML = "🔴 영업 종료";

    badge.className = "close-title";
  }

  info.innerHTML = `

        <div class="time-row">

            <span>📅</span>

            <strong>${business.title}</strong>

        </div>

        <div class="time-row">

            <span>🕛 오픈</span>

            <strong>${business.open}</strong>

        </div>

        <div class="time-row">

            <span>🎫 매표 마감</span>

            <strong>${business.ticketClose}</strong>

        </div>

        <div class="time-row">

            <span>🌙 운영 종료</span>

            <strong>${business.close}</strong>

        </div>

    `;
}

// ===============================
// 날짜 표시
// ===============================
function updateToday() {
  const target = document.getElementById("today");

  if (!target) return;

  const now = new Date();

  const week = ["일", "월", "화", "수", "목", "금", "토"];

  const text =
    `${now.getFullYear()}.` +
    `${String(now.getMonth() + 1).padStart(2, "0")}.` +
    `${String(now.getDate()).padStart(2, "0")}` +
    ` (${week[now.getDay()]})`;

  target.textContent = text;
}

// ===============================
// 시간 → 분 변환
// ===============================
function timeToMinute(time) {
  const split = time.split(":");

  return Number(split[0]) * 60 + Number(split[1]);
}
