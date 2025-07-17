const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const socket = io();

let me = { x: 300, color: 'red', id: null };
let others = {};

socket.on('connect', () => {
  me.id = socket.id;
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') me.x = Math.max(0, me.x - 5);
  if (e.key === 'ArrowRight') me.x = Math.min(canvas.width, me.x + 5);
  socket.emit('move', { x: me.x });
});

socket.on('move', data => {
  if (data.id !== me.id) {
    others[data.id] = { x: data.x, color: 'blue' };
  }
});

socket.on('leave', id => {
  delete others[id];
});

function drawBoat(x, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.rect(x - 15, 550, 30, 30);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,0,0.3)';
  ctx.beginPath();
  ctx.moveTo(x, 550);
  ctx.lineTo(x - 100, 450);
  ctx.lineTo(x + 100, 450);
  ctx.fill();
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoat(me.x, me.color);
  for (let id in others) drawBoat(others[id].x, others[id].color);
  requestAnimationFrame(loop);
}

loop();
