const intro = document.getElementById('intro');
const main = document.getElementById('main');
const song = document.getElementById('song');
const btnStart = document.getElementById('btnStart');
const moodForm = document.getElementById('moodForm');
const moodInput = document.getElementById('moodInput');
const moodResult = document.getElementById('moodResult');

// tangani pengiriman form skala
moodForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = parseInt(moodInput.value, 10);  // mengubah moodSelect menjadi moodInput
  if (!val || val < 1 || val > 10) {
  }
  
  // Pesan yang lebih semangat sesuai nilai yang dimasukkan
  let emoji = val >= 8 ? '🔥' : val >= 5 ? '💪' : '✨';
  moodResult.textContent = `Wahhh! Semangatmu: ${val}/10 ${emoji}`;
  // ulangi konfeti sesuai skala
  confetti.length = 0;
  startConfetti(val * 15);
});

// Ketika tombol diklik
btnStart.addEventListener('click', () => {
  intro.style.opacity = '0';
  setTimeout(() => {
    intro.style.display = 'none';
    main.style.opacity = '1';
    document.getElementById('greeting').textContent = getGreeting();
    song.play();
    startConfetti(); // Mengubah mulaiKonfeti() menjadi startConfetti()
  }, 1000);
});

// Efek Konfeti
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const confetti = [];
const colors = ['#ff6f61', '#f9d342', '#92dce5', '#f2a6b3', '#ffffff'];

function ConfettiPiece(x, y, color) {
  this.x = x;
  this.y = y;
  this.size = Math.random() * 8 + 4;
  this.color = color;
  this.speedY = Math.random() * 3 + 1;
  this.speedX = Math.random() * 2 - 1;
}

ConfettiPiece.prototype.update = function() {
  this.y += this.speedY;
  this.x += this.speedX;
  if (this.y > canvas.height) this.y = 0;
}

ConfettiPiece.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
}
// Fungsi untuk mendapatkan ucapan berdasarkan waktu
function getGreeting() {
  const hour = new Date().getHours();
  let greeting;

  if (hour >= 4 && hour < 11) {
    greeting = "🌅 Selamat Pagi Pritii yang Pretty 🎂";
  } else if (hour >= 11 && hour < 15) {
    greeting = "☀️ Selamat Siang Pritii yang Pretty 🎂";
  } else if (hour >= 15 && hour < 18) {
    greeting = "🌤️ Selamat Sore Pritii yang Pretty 🎂";
  } else {
    greeting = "🌙 Selamat Malam Pritii yang Pretty 🎂";
  }

  return greeting;
}

function startConfetti() {
  for (let i = 0; i < 150; i++) {
    confetti.push(new ConfettiPiece(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      colors[Math.floor(Math.random() * colors.length)]
    ));
  }
  animate();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let c of confetti) {
    c.update();
    c.draw();
  }
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
