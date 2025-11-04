const intro = document.getElementById('intro');
const main = document.getElementById('main');
const song = document.getElementById('song');
const btnStart = document.getElementById('btnStart');
const moodForm = document.getElementById('moodForm');
const moodInput = document.getElementById('moodInput');
const moodResult = document.getElementById('moodResult');

// --- PERBAIKAN 1: Menangani tinggi layar 100vh di mobile ---
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
// Panggil saat load dan saat ukuran layar berubah
setViewportHeight();
window.addEventListener('resize', setViewportHeight);
// -----------------------------------------------------------


// tangani pengiriman form skala
moodForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = parseInt(moodInput.value, 10);
  
  // --- PERBAIKAN 2: Validasi input ---
  if (!val || val < 1 || val > 10) {
    moodResult.textContent = 'Oops! Masukkan angka dari 1 sampai 10 ya 😉';
    return; // Hentikan eksekusi jika tidak valid
  }
  // -----------------------------------
  
  // Pesan yang lebih semangat sesuai nilai yang dimasukkan
  let emoji = val >= 8 ? '🔥' : val >= 5 ? '💪' : '✨';
  moodResult.textContent = `Wahhh! Semangatmu: ${val}/10 ${emoji}`;
  
  // ulangi konfeti sesuai skala
  confetti.length = 0; // Hapus confetti lama
  startConfetti(val * 15); // Buat confetti baru
});

// Ketika tombol diklik
btnStart.addEventListener('click', () => {
  intro.style.opacity = '0';
  setTimeout(() => {
    intro.style.display = 'none';
    main.style.opacity = '1';
    document.getElementById('greeting').textContent = getGreeting();
    song.play().catch(e => console.log("Autoplay diblokir browser")); // Tambah .catch
    startConfetti(); 
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
  if (this.y > canvas.height) {
    this.y = -this.size; // Reset ke atas saat jatuh ke bawah
    this.x = Math.random() * canvas.width; // Reset posisi x
  }
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

// --- PERBAIKAN 3: Fungsi startConfetti menerima parameter ---
function startConfetti(count = 150) { // Beri nilai default 150
  for (let i = 0; i < count; i++) { // Gunakan parameter 'count'
    confetti.push(new ConfettiPiece(
      Math.random() * canvas.width,
      Math.random() * canvas.height - canvas.height, // Mulai dari atas layar
      colors[Math.floor(Math.random() * colors.length)]
    ));
  }
  // Panggil animate HANYA jika confetti baru dibuat pertama kali
  // Tapi struktur Anda memanggilnya lagi. Agar sesuai, kita cek
  // (Sebenarnya, animate() sudah looping, tapi kita ikuti alur Anda)
  if (confetti.length === count) { // Hanya panggil animate saat pertama kali
      animate();
  }
}
// -----------------------------------------------------------

let animationFrameId = null; // Untuk mengelola frame animasi
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let c of confetti) {
    c.update();
    c.draw();
  }
  animationFrameId = requestAnimationFrame(animate);
}

// Pastikan canvas ikut responsif saat ukuran diubah
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  setViewportHeight(); // Panggil juga di sini
});