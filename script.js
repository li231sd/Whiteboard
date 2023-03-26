const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let lastX = 0;
let lastY = 0;

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
  