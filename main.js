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

// Add these variables at the top with other constants
const videoContainer = document.getElementById('videoContainer');
const motivationVideo = document.getElementById('motivationVideo');
const playPauseBtn = document.getElementById('playPause');
const seekBackwardBtn = document.getElementById('seekBackward');
const seekForwardBtn = document.getElementById('seekForward');
const closeVideoBtn = document.getElementById('closeVideo');

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

  // Setelah 3 detik, putar video
  setTimeout(() => {
    overlay.style.opacity = '0';
    popup.style.opacity = '0';
    
    setTimeout(() => {
      overlay.remove();
      popup.remove();
      
      // Pause backsound music
      song.pause();
      
      // Tampilkan dan putar video
      videoContainer.style.display = 'block';
      requestAnimationFrame(() => {
        videoContainer.style.opacity = '1';
      });
      
      motivationVideo.play();
      
      // Ketika video selesai
      motivationVideo.addEventListener('ended', () => {
        videoContainer.style.opacity = '0';
        setTimeout(() => {
          videoContainer.style.display = 'none';
          // Lanjutkan backsound music
          song.play();
          confetti.length = 0;
          startConfetti(val * 15);
        }, 300);
      });
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
    // Kirim notifikasi ke Telegram
    kirimNotif();
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

// Video controls functionality
let isVideoPlaying = false;

// Play/Pause toggle function
function togglePlayPause() {
  if (motivationVideo.paused) {
    motivationVideo.play().then(() => {
      playPauseBtn.textContent = '❚❚';
      isVideoPlaying = true;
    }).catch(error => {
      console.log('Play failed:', error);
    });
  } else {
    motivationVideo.pause();
    playPauseBtn.textContent = '▶';
    isVideoPlaying = false;
  }
}

// Event listeners for play/pause
playPauseBtn.addEventListener('click', (e) => {
  e.stopPropagation();  // Prevent event bubbling
  togglePlayPause();
});
qw
// Space bar control
document.addEventListener('keydown', (e) => {
  // Check if video container is visible and space bar is pressed
  if (videoContainer.style.display === 'block' && (e.code === 'Space' || e.key === ' ')) {
    e.preventDefault(); // Prevent page scrolling
    togglePlayPause();
  }
});

// Click on video to play/pause
motivationVideo.addEventListener('click', (e) => {
  e.stopPropagation();  // Prevent event bubbling
  togglePlayPause();
});

// Update button state when video state changes naturally
motivationVideo.addEventListener('play', () => {
  playPauseBtn.textContent = '❚❚';
});

motivationVideo.addEventListener('pause', () => {
  playPauseBtn.textContent = '▶';
});

// Controls visibility
const videoControls = document.querySelector('.video-controls');

// Show controls when video starts playing
motivationVideo.addEventListener('play', () => {
  playPauseBtn.textContent = '⏸️';
  videoControls.classList.add('visible');
});

// Hide controls when video is paused
motivationVideo.addEventListener('pause', () => {
  playPauseBtn.textContent = '▶️';
  videoControls.classList.add('visible');
});

// Show/hide controls on mouse movement
let controlsTimeout;
videoContainer.addEventListener('mousemove', () => {
  videoControls.classList.add('visible');
  clearTimeout(controlsTimeout);
  
  if (!motivationVideo.paused) {
    controlsTimeout = setTimeout(() => {
      videoControls.classList.remove('visible');
    }, 2000);
  }
});

// Show controls when hovering over them
videoControls.addEventListener('mouseenter', () => {
  clearTimeout(controlsTimeout);
  videoControls.classList.add('visible');
});

// Hide controls when mouse leaves video container
videoContainer.addEventListener('mouseleave', () => {
  if (!motivationVideo.paused) {
    videoControls.classList.remove('visible');
  }
});

// Show controls when touching screen (mobile)
videoContainer.addEventListener('touchstart', () => {
  videoControls.classList.add('visible');
  clearTimeout(controlsTimeout);
  
  if (!motivationVideo.paused) {
    controlsTimeout = setTimeout(() => {
      videoControls.classList.remove('visible');
    }, 2000);
  }
});

// Initialize controls visibility
function initializeVideoControls() {
  videoControls.classList.add('visible');
  playPauseBtn.textContent = '▶️';
  seekBackwardBtn.textContent = '⏪';
  seekForwardBtn.textContent = '⏩';
  closeVideoBtn.textContent = '✖';
}

// Call initialize when video container is shown
videoContainer.addEventListener('transitionend', () => {
  if (videoContainer.style.opacity === '1') {
    initializeVideoControls();
  }
});

// Close video functionality
closeVideoBtn.addEventListener('click', () => {
  videoContainer.style.opacity = '0';
  motivationVideo.pause();
  motivationVideo.currentTime = 0;
  isVideoPlaying = false;
  
  setTimeout(() => {
    videoContainer.style.display = 'none';
    song.play();
    confetti.length = 0;
    startConfetti(150);
  }, 300);
});

// Add touch control variables
let touchStartX = 0;
let touchStartTime = 0;
const DOUBLE_TAP_DELAY = 300;
let lastTapTime = 0;

// Handle double tap on mobile
motivationVideo.addEventListener('touchstart', (e) => {
  const currentTime = new Date().getTime();
  const tapX = e.touches[0].clientX;
  const screenWidth = window.innerWidth;
  
  if (currentTime - lastTapTime < DOUBLE_TAP_DELAY) {
    // Double tap detected
    if (tapX < screenWidth / 2) {
      // Double tap on left side
      motivationVideo.currentTime = Math.max(0, motivationVideo.currentTime - 10);
    } else {
      // Double tap on right side
      motivationVideo.currentTime = Math.min(motivationVideo.duration, motivationVideo.currentTime + 10);
    }
  }
  
  lastTapTime = currentTime;
});

// Handle keyboard controls for desktop
document.addEventListener('keydown', (e) => {
  if (videoContainer.style.display === 'block') {
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        motivationVideo.currentTime = Math.max(0, motivationVideo.currentTime - 10);
        break;
      case 'ArrowRight':
        e.preventDefault();
        motivationVideo.currentTime = Math.min(motivationVideo.duration, motivationVideo.currentTime + 10);
        break;
      case 'Escape':
        closeVideo();
        break;
    }
  }
});

// Simplified control buttons
playPauseBtn.innerHTML = '▶';
seekBackwardBtn.innerHTML = '⏪';
seekForwardBtn.innerHTML = '⏩';
closeVideoBtn.innerHTML = '×';

// Function to close video
function closeVideo() {
  videoContainer.style.opacity = '0';
  motivationVideo.pause();
  motivationVideo.currentTime = 0;
  
  setTimeout(() => {
    videoContainer.style.display = 'none';
    song.play();
    confetti.length = 0;
    startConfetti(150);
  }, 300);
}

// Update play button
function togglePlayPause() {
  if (motivationVideo.paused) {
    motivationVideo.play();
    playPauseBtn.innerHTML = '❚❚';
  } else {
    motivationVideo.pause();
    playPauseBtn.innerHTML = '▶';
  }
}