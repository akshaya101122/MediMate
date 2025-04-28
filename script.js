const usesData = {
  "paracetamol": "Used to treat fever and mild to moderate pain.",
  "vitamind": "Supports bone health and immune function.",
  "ibuprofen": "Reduces inflammation, pain, and fever.",
  "cetirizine": "Used for allergy relief.",
  "amoxicillin": "Antibiotic used to treat infections."
};

let reminders = JSON.parse(localStorage.getItem("dailyReminders") || "[]");
let reminderHistory = JSON.parse(localStorage.getItem("reminderHistory") || "[]");

function login() {
  const name = document.getElementById("username").value;
  const age = document.getElementById("age").value;
  if (name && age) {
    document.getElementById("userDisplay").innerText = name;
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "flex";
    showTab('home');
    startReminderLoop();
    drawCalendar();
  } else {
    alert("Please fill all fields");
  }
}

function logout() {
  location.reload();
}

function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");

  if (tabId === "history") {
    loadHistory();
  }
}

function setReminder() {
  const tablet = document.getElementById("tablet").value.toLowerCase();
  const time = document.getElementById("reminderTime").value;

  if (!tablet || !time) {
    alert("Please fill both fields");
    return;
  }

  reminders.push({ tablet, time });
  localStorage.setItem("dailyReminders", JSON.stringify(reminders));

  alert(`Reminder for ${tablet} at ${time} set daily!`);

  if (usesData[tablet]) {
    document.getElementById("usesText").innerText = `${tablet.toUpperCase()}: ${usesData[tablet]}`;
  } else {
    document.getElementById("usesText").innerText = `No info available for ${tablet}.`;
  }

  document.getElementById("tablet").value = "";
  document.getElementById("reminderTime").value = "";
}

function startReminderLoop() {
  setInterval(() => {
    const now = new Date();
    const current = now.toTimeString().slice(0, 5); // Format HH:MM

    reminders.forEach(rem => {
      if (rem.time === current) {
        const msg = `Time to take your ${rem.tablet}`;
        const utter = new SpeechSynthesisUtterance(msg);
        speechSynthesis.speak(utter);
        alert(msg);

        const historyEntry = `${msg} - ${now.toLocaleTimeString()}`;
        reminderHistory.push(historyEntry);
        localStorage.setItem("reminderHistory", JSON.stringify(reminderHistory));

        const li = document.createElement("li");
        li.textContent = historyEntry;
        document.getElementById("historyList").appendChild(li);
      }
    });
  }, 30000); // Check every 30 seconds
}

function loadHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = ""; // Clear previous list
  reminderHistory.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry;
    historyList.appendChild(li);
  });
}

function drawCalendar() {
  const daysEl = document.getElementById("calendarDays");
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  daysEl.innerHTML = '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create day headers
  days.forEach(day => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${day}</strong>`;
    daysEl.appendChild(div);
  });

  // Empty cells for offset
  for (let i = 0; i < startDay; i++) {
    daysEl.appendChild(document.createElement('div'));
  }

  // Actual day cells
  for (let i = 1; i <= daysInMonth; i++) {
    const div = document.createElement('div');
    div.className = "calendar-day";
    div.textContent = i;
    div.onclick = () => selectDay(i);
    daysEl.appendChild(div);
  }
}

function selectDay(day) {
  const selectedDay = document.querySelector('.calendar-day.selected');
  if (selectedDay) selectedDay.classList.remove('selected');

  document.querySelectorAll('.calendar-day').forEach(dayEl => {
    if (parseInt(dayEl.textContent) === day) {
      dayEl.classList.add('selected');
    }
  });
}
