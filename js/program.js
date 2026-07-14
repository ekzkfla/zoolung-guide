// =======================================
// 주렁주렁 하남
// Program Page
// Part 1
// =======================================

const SCHEDULE_URL = "./data/schedule.json";

let scheduleData = [];

// =======================================
// 시작
// =======================================

window.addEventListener("DOMContentLoaded", async () => {
  updateToday();

  await loadSchedule();
});

// =======================================
// JSON 읽기
// =======================================

async function loadSchedule() {
  try {
    const response = await fetch(SCHEDULE_URL);

    if (!response.ok) {
      throw new Error("시간표를 불러올 수 없습니다.");
    }

    scheduleData = await response.json();

    renderSchedule();
  } catch (error) {
    console.error(error);

    document.getElementById("scheduleList").innerHTML = `

            <div class="empty-card">

                시간표를 불러오지 못했습니다.

            </div>

        `;
  }
}

// =======================================
// 오늘 날짜 출력
// =======================================

function updateToday() {
  const target = document.getElementById("today");

  const now = new Date();

  const week = ["일", "월", "화", "수", "목", "금", "토"];

  target.textContent =
    `${now.getFullYear()}.` +
    `${String(now.getMonth() + 1).padStart(2, "0")}.` +
    `${String(now.getDate()).padStart(2, "0")} ` +
    `(${week[now.getDay()]})`;
}

// =======================================
// 평일 / 주말
// =======================================

function getTodayType() {
  const day = new Date().getDay();

  return day === 0 || day === 6 ? "weekend" : "weekday";
}

// =======================================
// 시간 → 분
// =======================================

function timeToMinute(time) {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}
// =======================================
// 화면 출력
// =======================================

function renderSchedule() {
  const todayType = getTodayType();

  const dayBadge = document.getElementById("dayType");

  dayBadge.textContent =
    todayType === "weekday"
      ? "🟢 오늘은 평일 프로그램입니다."
      : "🟡 오늘은 주말 프로그램입니다.";

  const schedule = scheduleData
    .filter((item) => item.day === todayType)
    .sort((a, b) => timeToMinute(a.start) - timeToMinute(b.start));

  const list = document.getElementById("scheduleList");

  list.innerHTML = "";

  const now = new Date();
  const currentMinute = now.getHours() * 60 + now.getMinutes();

  let nextAssigned = false;
  let visibleCount = 0;

  schedule.forEach((item) => {
    const start = timeToMinute(item.start);
    const end = timeToMinute(item.end);

    // 종료된 프로그램은 숨김
    if (currentMinute > end) {
      return;
    }

    let state = "";

    if (currentMinute >= start && currentMinute <= end) {
      state = "current";
    } else if (!nextAssigned) {
      state = "next";
      nextAssigned = true;
    }

    list.innerHTML += createScheduleCard(item, state);

    visibleCount++;
  });

  // 오늘 프로그램 종료
  if (visibleCount === 0) {
    list.innerHTML = `

            <div class="end-message">

                <div class="end-icon">
                    🌙
                </div>

                <h2>
                    오늘의 프로그램이 모두 종료되었습니다.
                </h2>

                <p>
                    오늘도 주렁주렁 하남을 찾아주셔서 감사합니다.
                </p>

                <span>
                    내일도 즐거운 프로그램으로 찾아뵙겠습니다.
                </span>

            </div>

        `;
  }
}

// =======================================
// 카드 생성
// =======================================

function createScheduleCard(item, state = "") {
  return `

        <div class="schedule-card ${state}">

            <div class="program-icon">

                ${item.icon}

            </div>

            <div class="program-info">

                <div class="program-time">

                    ${item.start} ~ ${item.end}

                </div>

                <div class="program-title">

                    ${item.title}

                </div>

                <div class="program-place">

                    📍 ${item.place}

                </div>

            </div>

        </div>

    `;
}
