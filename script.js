const hourHand = document.getElementById("hour");
const minuteHand = document.getElementById("minute");
const secondHand = document.getElementById("second");
const digitalHours = document.getElementById("digitalHours");
const digitalMinutes = document.getElementById("digitalMinutes");
const digitalSeconds = document.getElementById("digitalSeconds");
const digitalDate = document.getElementById("digitalDate");
const analogClock = document.getElementById("analogClock");
const digitalClock = document.getElementById("digitalClock");
const toggleBtn = document.getElementById("toggleBtn");
const themeToggle = document.getElementById("themeToggle");
const timezoneSelect = document.getElementById("timezoneSelect");
const locationName = document.getElementById("locationName");
const locationDate = document.getElementById("locationDate");

let showAnalog = true;
let isDarkMode = false;
let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let worldTimeData = {};

// Major world cities with their timezones
const majorCities = [
  { name: "Local Time", timezone: currentTimezone, country: "" },
  { name: "New York", timezone: "America/New_York", country: "USA" },
  { name: "Los Angeles", timezone: "America/Los_Angeles", country: "USA" },
  { name: "London", timezone: "Europe/London", country: "UK" },
  { name: "Paris", timezone: "Europe/Paris", country: "France" },
  { name: "Berlin", timezone: "Europe/Berlin", country: "Germany" },
  { name: "Moscow", timezone: "Europe/Moscow", country: "Russia" },
  { name: "Dubai", timezone: "Asia/Dubai", country: "UAE" },
  { name: "Mumbai", timezone: "Asia/Kolkata", country: "India" },
  { name: "Singapore", timezone: "Asia/Singapore", country: "Singapore" },
  { name: "Tokyo", timezone: "Asia/Tokyo", country: "Japan" },
  { name: "Sydney", timezone: "Australia/Sydney", country: "Australia" },
  { name: "Beijing", timezone: "Asia/Shanghai", country: "China" },
  { name: "Hong Kong", timezone: "Asia/Hong_Kong", country: "Hong Kong" },
  { name: "Seoul", timezone: "Asia/Seoul", country: "South Korea" },
  { name: "Bangkok", timezone: "Asia/Bangkok", country: "Thailand" },
  { name: "Cairo", timezone: "Africa/Cairo", country: "Egypt" },
  { name: "São Paulo", timezone: "America/Sao_Paulo", country: "Brazil" },
  { name: "Mexico City", timezone: "America/Mexico_City", country: "Mexico" },
  { name: "Toronto", timezone: "America/Toronto", country: "Canada" }
];

// Initialize timezone selector
function initTimezoneSelector() {
  timezoneSelect.innerHTML = '';
  majorCities.forEach(city => {
    const option = document.createElement('option');
    option.value = city.timezone;
    option.textContent = city.country ? `${city.name}, ${city.country}` : city.name;
    timezoneSelect.appendChild(option);
  });
  timezoneSelect.value = currentTimezone;
}

// Get current time for any timezone
function getTimeForTimezone(timezone) {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'long'
    });
    
    const parts = formatter.formatToParts(now);
    const timeData = {};
    parts.forEach(part => {
      timeData[part.type] = part.value;
    });

    return {
      hours: parseInt(timeData.hour),
      minutes: parseInt(timeData.minute),
      seconds: parseInt(timeData.second),
      date: `${timeData.weekday}, ${timeData.month}/${timeData.day}/${timeData.year}`,
      timezone: timezone
    };
  } catch (error) {
    console.error('Error getting time for timezone:', timezone, error);
    return null;
  }
}

// Update location info
function updateLocationInfo() {
  const selectedCity = majorCities.find(city => city.timezone === currentTimezone);
  if (selectedCity) {
    locationName.textContent = selectedCity.country ? 
      `${selectedCity.name}, ${selectedCity.country}` : 
      selectedCity.name;
  }

  const timeData = getTimeForTimezone(currentTimezone);
  if (timeData) {
    locationDate.textContent = timeData.date;
  }
}

// Toggle between analog and digital
toggleBtn.addEventListener("click", () => {
  showAnalog = !showAnalog;
  if (showAnalog) {
    analogClock.style.display = "flex";
    digitalClock.style.display = "none";
    toggleBtn.textContent = "Switch to Digital";
  } else {
    analogClock.style.display = "none";
    digitalClock.style.display = "block";
    toggleBtn.textContent = "Switch to Analog";
  }
});

// Toggle theme
themeToggle.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  
  const themeIcon = themeToggle.querySelector('.theme-icon');
  if (isDarkMode) {
    themeIcon.textContent = '☀️';
    themeToggle.childNodes[2].textContent = 'Light Mode';
  } else {
    themeIcon.textContent = '🌙';
    themeToggle.childNodes[2].textContent = 'Dark Mode';
  }
});

// Handle timezone change
timezoneSelect.addEventListener('change', (e) => {
  currentTimezone = e.target.value;
  updateLocationInfo();
});

// Update clocks
function updateClocks() {
  const timeData = getTimeForTimezone(currentTimezone);
  if (!timeData) return;

  const { hours, minutes, seconds } = timeData;
  
  // Calculate angles for analog clock
  const sec = seconds + (Date.now() % 1000) / 1000;
  const min = minutes + sec / 60;
  const hr = (hours % 12) + min / 60;

  const secDeg = sec * 6;
  const minDeg = min * 6;
  const hrDeg = hr * 30;

  // Update analog hands
  secondHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
  hourHand.style.transform = `translateX(-50%) rotate(${hrDeg}deg)`;

  // Update digital display with segmented format
  digitalHours.textContent = pad(hours);
  digitalMinutes.textContent = pad(minutes);
  digitalSeconds.textContent = pad(seconds);
  digitalDate.textContent = timeData.date;
}

function pad(n) {
  return n < 10 ? "0" + n : n;
}

// Initialize the application
function init() {
  initTimezoneSelector();
  updateLocationInfo();
  analogClock.style.display = "flex";
  
  // Initialize theme
  document.documentElement.setAttribute('data-theme', 'light');
  
  // Start the clock
  setInterval(updateClocks, 100);
  updateClocks();
}

// Start the application
init();