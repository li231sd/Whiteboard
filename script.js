// VARIABLES //
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const addTextButton = document.getElementById("addTextButton");
const startButton = document.getElementById("start-button");
const continueButton = document.getElementById('start-button');
const loadingScreen = document.querySelector('#loading-screen');

var overlay = document.getElementById("overlay");
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let textX = 0;
let textY = 0;

// EVENT LISTENERS //
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

function addText() {
  const text = prompt("Before adding text please click or tap somewhere on the board where you want to add your text: ");
  const sanitizedText = DOMPurify.sanitize(text);

  if (!sanitizedText || sanitizedText.trim().length === 0) {
    alert('Please enter a valid text!');
    return;
  }

  if (isTouchDevice()) {
    textX = lastX - canvas.offsetLeft;
    textY = lastY - canvas.offsetTop;
  } else {
    textX = lastX;
    textY = lastY;
  }

  ctx.font = "25px Arial";
  ctx.fillStyle = document.getElementById("color-picker").value;
  
  const textWidth = ctx.measureText(sanitizedText).width;
  const textHeight = parseInt(ctx.font);

  if (textX + textWidth > canvas.width) {
    textX = canvas.width - textWidth;
  }
  if (textY + textHeight > canvas.height) {
    textY = canvas.height - textHeight;
  }

  ctx.fillText(sanitizedText, textX, textY);
}

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

function addText(event) {
  const text = prompt("Before adding text please click or tap somewhere on the board where you want to add your text: ");
  const sanitizedText = DOMPurify.sanitize(text);

  if (!sanitizedText || sanitizedText.trim().length === 0) {
    alert('Please enter a valid text!');
    return;
  }

  let touchX, touchY;
  if (isTouchDevice()) {
    const touch = event.touches[0];
    touchX = touch.clientX - canvas.offsetLeft;
    touchY = touch.clientY - canvas.offsetTop;
  } else {
    touchX = lastX;
    touchY = lastY;
  }

  ctx.font = "25px Arial";
  ctx.fillStyle = document.getElementById("color-picker").value;
  
  const textWidth = ctx.measureText(sanitizedText).width;
  const textHeight = parseInt(ctx.font);

  let textX = touchX;
  let textY = touchY;
  if (textX + textWidth > canvas.width) {
    textX = canvas.width - textWidth;
  }
  if (textY + textHeight > canvas.height) {
    textY = canvas.height - textHeight;
  }

  ctx.fillText(sanitizedText, textX, textY);
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0; 
}

// UNIVERSAL //
document.getElementById("whiteboard").classList.add("hidden");

document.getElementById('start-button').addEventListener('click', function() {
  document.getElementById('welcome-screen').style.opacity = 0;
  setTimeout(function() {
    document.getElementById("welcome-screen").classList.add("hidden");
    document.getElementById("whiteboard").classList.remove("hidden");
  }, 500);
});

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
