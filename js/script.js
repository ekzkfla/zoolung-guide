const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRED5AftcLtUzSdF58CnKs83kCrLvAVOndoeU4wCJh2YfSsbAIIr2aO0Iub1K7rh3OTQ2Fg_OnMgSY2/pub?output=csv";

let weekdaySchedule = [];
let weekendSchedule = [];

// CSV 불러오기
async function loadSchedule() {
  try {
    const response = await fetch(CSV_URL);

    if (!response.ok) {
      throw new Error("CSV를 불러오지 못했습니다.");
    }

    const csvText = await response.text();

    parseCSV(csvText);

    renderSchedule();

  } catch (error) {
    console.error(error);

    document.getElementById("scheduleList").innerHTML = `
      <div class="schedule-item">
        시간표를 불러올 수 없습니다.
      </div>
    `;
  }
}

// CSV 파싱
function parseCSV(csvText) {

  const lines = csvText.trim().split("\n");

  // 첫 줄(헤더) 제거
  lines.shift();

  weekdaySchedule = [];
  weekendSchedule = [];

  lines.forEach(line => {

    if (!line.trim()) return;

    const cols = line.split(",");

    if (cols.length < 5) return;

    const item = {
      start: cols[1].trim(),
      end: cols[2].trim(),
      title: cols[3].trim(),
      place: cols[4].trim()
    };

    if (cols[0].trim() === "평일") {
      weekdaySchedule.push(item);
    } else {
      weekendSchedule.push(item);
    }

  });

}

// 평일 / 주말 구분
function getTodaySchedule() {

  const day = new Date().getDay();

  if (day === 0 || day === 6) {
    return weekendSchedule;
  }

  return weekdaySchedule;

}

// 화면 출력
function renderSchedule() {

  const schedule = getTodaySchedule();

  const list = document.getElementById("scheduleList");

  list.innerHTML = "";

  schedule.forEach(item => {

    list.innerHTML += `
      <div class="schedule-item">

          <div class="time">
              ${item.start} ~ ${item.end}
          </div>

          <div class="program">
              ${item.title}
          </div>

          <div class="place">
              📍 ${item.place}
          </div>

      </div>
    `;

  });

}

// 페이지 시작
window.onload = function () {
  loadSchedule();
};