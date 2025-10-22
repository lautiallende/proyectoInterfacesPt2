// === Configuración de filtros ===
const FILTERS = [
  'grayscale(100%)',
  'brightness(30%)',
  'invert(100%)'
];

const FILTER_COMBOS = [
  'grayscale(100%) brightness(30%)',
  'invert(100%) brightness(30%)',
  'grayscale(100%) invert(100%)'
];

// === Clase principal del juego ===
class PuzzleGame {
  constructor(gridSize = 2, level = 1) {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.image = null;
    this.pieces = [];
    this.gridSize = gridSize;
    this.level = level;
    this.isPlaying = false;
    this.startTime = 0;
    this.timerInterval = null;

    this.loadImage();
    this.initEvents();
  }

  loadImage() {
    const totalImages = 6;
    const randomI = Math.floor(Math.random() * totalImages) + 1;
    this.image = new Image();
    this.image.src = `./iconos-imagenes/blocka/blocka${randomI}.jpg`;
    this.image.onload = () => {
      this.createPieces();
      this.drawPieces();
    };
  }

  createPieces() {
    this.pieces = [];
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        let filter = 'none';
        if (this.level === 1) {
          filter = 'grayscale(100%)';
        } else if (this.level === 2) {
          filter = FILTERS[Math.floor(Math.random() * FILTERS.length)];
        } else {
          const all = [...FILTERS, ...FILTER_COMBOS];
          filter = all[Math.floor(Math.random() * all.length)];
        }
        this.pieces.push({
          row,
          col,
          rotation: [0, 90, 180, 270][Math.floor(Math.random() * 4)],
          filter
        });
      }
    }
  }

  drawPieces() {
    const pieceSize = this.canvas.width / this.gridSize;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.pieces.forEach(p => {
      this.ctx.save();
      this.ctx.translate(
        p.col * pieceSize  + pieceSize / 2,
        p.row * pieceSize + pieceSize / 2
      );
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.filter = p.filter;
      this.ctx.drawImage(
        this.image,
        p.col * (this.image.width / this.gridSize),
        p.row * (this.image.height / this.gridSize),
        this.image.width / this.gridSize,
        this.image.height / this.gridSize,
        -pieceSize / 2,
        -pieceSize / 2,
        pieceSize,
        pieceSize
      );
      this.ctx.restore();
    });
    this.ctx.filter = 'none';
  }

  initEvents() {
    this.canvas.addEventListener('contextmenu', e => e.preventDefault());
    this.canvas.addEventListener('mousedown', e => {
      if (!this.isPlaying) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pieceSize = this.canvas.width / this.gridSize;
      const col = Math.floor(x / pieceSize);
      const row = Math.floor(y / pieceSize);
      const piece = this.pieces.find(p => p.row === row && p.col === col);
      if (!piece) return;
      if (e.button === 0) piece.rotation -= 90;
      if (e.button === 2) piece.rotation += 90;
      this.drawPieces();
      this.checkWin();
    });
  }

  checkWin() {
    const allCorrect = this.pieces.every(p => p.rotation % 360 === 0);
    const duration = 1 * 1000; // duración en milisegundos
    const end = Date.now() + duration;

    if (!allCorrect) return;

    clearInterval(this.timerInterval);
    this.isPlaying = false;
    this.pieces.forEach(p => (p.filter = 'none'));
    this.drawPieces();

    document.getElementById('successMessage').style.display = 'block';
    (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 70,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 70,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
        requestAnimationFrame(frame);
    }
    })();
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const recordKey = `record_level_${this.level}`;
    const prevRecord = localStorage.getItem(recordKey);
    if (!prevRecord || elapsed < parseInt(prevRecord)) {
      localStorage.setItem(recordKey, elapsed);
      alert(`¡Nuevo récord en nivel ${this.level}: ${elapsed} segundos!`);
    }

  }

  start() {
    this.isPlaying = true;
    this.startTime = Date.now();
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('defeatMessage').style.display = 'none';

    const recordKey = 'record_level_${this.level}';
    const best = localStorage.getItem(recordKey);
    const info = document.getElementById('level-info');
    if (info) {
      info.textContent = best
        ? `Nivel ${this.level} | Récord: ${best}s`
        : `Nivel ${this.level} | Récord: --`;
    }

    let totalTime = 120;
    if (this.level === 2) totalTime = 90;
    if (this.level >= 3) totalTime = 60;

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const remaining = totalTime - elapsed;
      if (remaining <= 0) {
        clearInterval(this.timerInterval);
        this.isPlaying = false;
        document.getElementById('timer').textContent = "00:00";
        document.getElementById('defeatMessage').style.display = 'block';
        return;
      }
      const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
      const seconds = String(remaining % 60).padStart(2, '0');
      document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    }, 1000);
  }
}

// === Inicialización separada ===
document.addEventListener('DOMContentLoaded', () => {
  const startGameBtn = document.getElementById('startGameBtn');
  const pieceSelect = document.getElementById('pieceSelect');
  const nextLevelBtn = document.getElementById('nextLevelBtn');
  const startScreen = document.getElementById('startScreen');
  const retryBtn = document.getElementById('retryBtn');

  let game = null;
  let level = 1;

  function showMenu() {
    startScreen.style.display = 'flex';
    const ctx = document.getElementById('gameCanvas').getContext('2d');
    ctx.clearRect(0, 0, 500, 500);
    document.getElementById('timer').textContent = "00:00";
    document.getElementById('level-info').textContent = "Nivel - | Récord: --";
  }

  // Botón Comenzar (overlay inicial)
  startGameBtn.addEventListener('click', () => {
    const gridSize = parseInt(pieceSelect.value);
    level = 1;
    game = new PuzzleGame(gridSize, level);
    game.start();
    startScreen.style.display = 'none';
  });

  // Botón Siguiente nivel
  nextLevelBtn.addEventListener('click', () => {
    const gridSize = parseInt(pieceSelect.value);
    level++;
    if (level > 3) level = 1;
    game = new PuzzleGame(gridSize, level);
    game.start();
    document.getElementById('successMessage').style.display = 'none';
  });

  // Botón Reintentar
  retryBtn.addEventListener('click', () => {
    const gridSize = parseInt(pieceSelect.value);
    game = new PuzzleGame(gridSize, level);
    game.start();
    document.getElementById('defeatMessage').style.display = 'none';
  });

  // Botones Menú
  document.querySelectorAll('.goToMenuBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('successMessage').style.display = 'none';
      document.getElementById('defeatMessage').style.display = 'none';
      showMenu();
    });
  });
});