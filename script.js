const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const addTextButton = document.getElementById("addTextButton");
const startButton = document.getElementById("start-button");
const continueButton = document.getElementById('start-button');
const loadingScreen = document.querySelector('#loading-screen');
const addImageButton = document.getElementById("addImageButton");
const imageLoader = document.getElementById("imageLoader");
const closeBtn = document.getElementById('close-release-notes');
const releaseNotes = document.getElementById('release-notes');
const initialBackgroundColor = "#ffffff";

var overlay = document.getElementById("overlay");
var audioPlayer = document.getElementById("audio-player");
var playButton = document.getElementById("play-button");

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let textX = 0;
let textY = 0;
let isCircleDrawn = true;
let currentBackgroundColor = initialBackgroundColor;

addTextButton.addEventListener("click", addText);
audioPlayer.volume = 0.2;

playButton.addEventListener("click", function() {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
});

audioPlayer.addEventListener("ended", function() {
  audioPlayer.currentTime = 0;
  audioPlayer.play();
});

function resetCanvasBackground() {
  currentBackgroundColor = initialBackgroundColor;
  canvas.style.backgroundColor = currentBackgroundColor;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.getElementById("reset-btn").addEventListener("click", resetCanvasBackground);

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  canvas.style.backgroundColor = currentBackgroundColor;
});

resetCanvasBackground();

addImageButton.addEventListener("click", function () {
  imageLoader.click();
});

closeBtn.addEventListener('click', () => {
  releaseNotes.style.display = 'none';
});

imageLoader.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});

canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault(); 

  const color = document.getElementById("color-picker").value;
  canvasColor = color;
  canvas.style.backgroundColor = canvasColor;
});

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

function openPrompt(promptText) {
  const promptContainer = document.createElement('div');
  promptContainer.classList.add('prompt-container');

  const promptBox = document.createElement('div');
  promptBox.classList.add('prompt-box');

  const promptMessage = document.createElement('p');
  promptMessage.classList.add('prompt-message');
  promptMessage.innerText = promptText;

  const promptInput = document.createElement('input');
  promptInput.classList.add('prompt-input');
  promptInput.setAttribute('type', 'text');

  const submitButton = document.createElement('button');
  submitButton.classList.add('prompt-submit-button');
  submitButton.innerText = 'Submit';

  const cancelButton = document.createElement('button');
  cancelButton.classList.add('prompt-cancel-button');
  cancelButton.innerText = 'Cancel';

  promptBox.appendChild(promptMessage);
  promptBox.appendChild(promptInput);
  promptBox.appendChild(submitButton);
  promptBox.appendChild(cancelButton);

  promptContainer.appendChild(promptBox);
  document.body.appendChild(promptContainer);

  cancelButton.addEventListener('click', closePrompt);

  window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closePrompt();
    }
  });

  promptInput.focus();

  return {promptContainer, promptBox, promptInput, submitButton, cancelButton};
}

function closePrompt() {
  const promptContainer = document.querySelector('.prompt-container');
  if (promptContainer) {
    promptContainer.remove();
  }
}

function addText() {
  const { promptContainer, promptBox, promptInput, submitButton, cancelButton } = openPrompt("Before adding text please click or tap somewhere on the board where you want to add your text: ");
  
  function addTextCallback() {
    const text = promptInput.value;
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
    
    closePrompt();
  }

  submitButton.addEventListener('click', addTextCallback);
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = document.getElementById("color-picker").value;
  ctx.stroke();
}

canvas.addEventListener("click", function (event) {
  if (isCircleDrawn === false) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const { promptContainer, promptBox, promptInput, submitButton, cancelButton } = openPrompt("Enter the radius of the circle: ");
    function addCircle() {
      const radius = promptInput.value;
      const sanitizedRadius = parseFloat(radius);

      if (isNaN(sanitizedRadius)) {
        alert('Please enter a valid radius!');
        return;
      }

      drawCircle(x, y, sanitizedRadius);
      isCircleDrawn = true;

      closePrompt();
    }

    submitButton.addEventListener('click', addCircle);
  }
});

document.getElementById("addCircleButton").addEventListener("click", function (event) {
  if (isCircleDrawn === true) {
    isCircleDrawn = false;
  }
});

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
