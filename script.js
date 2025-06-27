const hourHand = document.getElementById("hour");
const minuteHand = document.getElementById("minute");
const secondHand = document.getElementById("second");
const digitalTime = document.getElementById("digitalTime");
const analogClock = document.getElementById("analogClock");
const digitalClock = document.getElementById("digitalClock");
const toggleBtn = document.getElementById("toggleBtn");

let showAnalog = true;
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

function updateClocks() {
  const now = new Date();
  const sec = now.getSeconds() + now.getMilliseconds() / 1000;
  const min = now.getMinutes() + sec / 60;
  const hr  = now.getHours() + min / 60;

  const secDeg = sec * 6;
  const minDeg = min * 6;
  const hrDeg  = hr * 30;

  secondHand.style.transform = `rotate(${secDeg}deg)`;
  minuteHand.style.transform = `rotate(${minDeg}deg)`;
  hourHand.style.transform = `rotate(${hrDeg}deg)`;

  const h = Math.floor(hr) % 24;
  const m = Math.floor(min) % 60;
  const s = Math.floor(sec) % 60;
  digitalTime.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function pad(n) {
  return n < 10 ? "0" + n : n;
}

setInterval(updateClocks, 100);
updateClocks();
analogClock.style.display = "flex";
