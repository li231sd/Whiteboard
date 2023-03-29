// VARIABLES //
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const addTextButton = document.getElementById("addTextButton");

var overlay = document.getElementById("overlay");
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let textX = 0;
let textY = 0;

addTextButton.addEventListener("click", addText);

// PC //
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = document.getElementById("color-picker").value;
  ctx.lineWidth = document.getElementById("brush-size").value;
  ctx.stroke();
  lastX = e.offsetX;
  lastY = e.offsetY;
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

// MOBILE //
canvas.addEventListener("touchstart", (e) => {
  isDrawing = true;
  lastX = e.touches[0].clientX - canvas.offsetLeft;
  lastY = e.touches[0].clientY - canvas.offsetTop;
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop);
  ctx.strokeStyle = document.getElementById("color-picker").value;
  ctx.lineWidth = document.getElementById("brush-size").value;
  ctx.stroke();
  lastX = e.touches[0].clientX - canvas.offsetLeft;
  lastY = e.touches[0].clientY - canvas.offsetTop;
});

canvas.addEventListener("touchend", () => {
  isDrawing = false;
});

// UNIVERSAL //
function addText() {
  const text = prompt("Before adding text please click or tap somewhere on the board where you want to add your text:");

  if (isTouchDevice()) {
    textX = lastX - canvas.offsetLeft;
    textY = lastY - canvas.offsetTop;
  } else {
    textX = lastX;
    textY = lastY;
  }

  ctx.font = "25px Arial";
  ctx.fillStyle = document.getElementById("color-picker").value;
  
  const textWidth = ctx.measureText(text).width;
  const textHeight = parseInt(ctx.font);

  if (textX + textWidth > canvas.width) {
    textX = canvas.width - textWidth;
  }
  if (textY + textHeight > canvas.height) {
    textY = canvas.height - textHeight;
  }

  ctx.fillText(text, textX, textY);
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0; 
}

overlay.style.display = "block";
document.body.style.pointerEvents = "none";
window.onload = function() {
  setTimeout(function() {
    var loader = document.getElementById("loader");
    overlay.style.display = "none";
    document.body.style.pointerEvents = "auto";
    loader.style.display = "none";
  }, 3500); 
}

document.getElementById("clear-button").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("save-button").addEventListener("click", () => {
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = image;
  link.click();
});
