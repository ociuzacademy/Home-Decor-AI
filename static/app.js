const roomInput = document.getElementById("roomInput");
const decorInput = document.getElementById("decorInput");
const canvas = document.getElementById("previewCanvas");
const ctx = canvas.getContext("2d");
const emptyState = document.getElementById("emptyState");
const statusEl = document.getElementById("status");
const scaleInput = document.getElementById("scale");
const rotationInput = document.getElementById("rotation");
const scaleLabel = document.getElementById("scaleLabel");
const rotationLabel = document.getElementById("rotationLabel");
const downloadBtn = document.getElementById("downloadBtn");

const room = new Image();
const decor = new Image();
let roomReady = false;
let decorReady = false;
let decorX = canvas.width / 2;
let decorY = canvas.height / 2;
let decorWidth = canvas.width * 0.35;
let decorHeight = 0;
let dragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let baseDecorWidth = 0;

function loadImageFromInput(input, image, callback) {
  const file = input.files && input.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    statusEl.textContent = "Please choose an image file.";
    return;
  }
  const url = URL.createObjectURL(file);
  image.onload = () => {
    callback(image);
    URL.revokeObjectURL(url);
    draw();
  };
  image.onerror = () => {
    URL.revokeObjectURL(url);
    statusEl.textContent = "Could not read that image.";
  };
  image.src = url;
}

roomInput.addEventListener("change", () => loadImageFromInput(roomInput, room, (img) => {
  roomReady = true;
  // Keep canvas aspect close to room photo while limiting maximum size.
  const maxW = 1400, maxH = 950;
  const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
  canvas.width = Math.max(1, Math.round(img.naturalWidth * ratio));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * ratio));
  decorX = canvas.width * 0.7;
  decorY = canvas.height * 0.65;
  updateStatus();
}));

decorInput.addEventListener("change", () => loadImageFromInput(decorInput, decor, (img) => {
  decorReady = true;
  const fitRatio = Math.min(1, canvas.width * 0.35 / img.naturalWidth);
  baseDecorWidth = img.naturalWidth * fitRatio;
  decorWidth = Math.max(20, canvas.width * Number(scaleInput.value) / 100);
  const ratio = img.naturalHeight / img.naturalWidth;
  decorHeight = decorWidth * ratio;
  updateStatus();
}));

function updateStatus() {
  if (roomReady && decorReady) {
    statusEl.textContent = "Drag the decor to position it";
    emptyState.hidden = true;
    downloadBtn.disabled = false;
  } else if (roomReady) {
    statusEl.textContent = "Now upload a decor item";
  } else if (decorReady) {
    statusEl.textContent = "Now upload a room photo";
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (roomReady) {
    ctx.drawImage(room, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#24271f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (roomReady && decorReady) {
    decorWidth = canvas.width * Number(scaleInput.value) / 100;
    decorHeight = decorWidth * decor.naturalHeight / decor.naturalWidth;
    ctx.save();
    ctx.translate(decorX, decorY);
    ctx.rotate(Number(rotationInput.value) * Math.PI / 180);
    ctx.drawImage(decor, -decorWidth / 2, -decorHeight / 2, decorWidth, decorHeight);
    ctx.restore();
  } else if (decorReady && !roomReady) {
    decorWidth = canvas.width * Number(scaleInput.value) / 100;
    decorHeight = decorWidth * decor.naturalHeight / decor.naturalWidth;
    ctx.save();
    ctx.translate(decorX, decorY);
    ctx.rotate(Number(rotationInput.value) * Math.PI / 180);
    ctx.drawImage(decor, -decorWidth / 2, -decorHeight / 2, decorWidth, decorHeight);
    ctx.restore();
  }
}

scaleInput.addEventListener("input", () => {
  scaleLabel.textContent = `${scaleInput.value}%`;
  draw();
});
rotationInput.addEventListener("input", () => {
  rotationLabel.textContent = `${rotationInput.value}°`;
  draw();
});

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width / rect.width,
    y: (event.clientY - rect.top) * canvas.height / rect.height
  };
}
canvas.addEventListener("pointerdown", (event) => {
  if (!decorReady) return;
  const p = pointerPosition(event);
  dragging = true;
  dragOffsetX = p.x - decorX;
  dragOffsetY = p.y - decorY;
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  const p = pointerPosition(event);
  decorX = p.x - dragOffsetX;
  decorY = p.y - dragOffsetY;
  draw();
});
canvas.addEventListener("pointerup", () => dragging = false);
canvas.addEventListener("pointercancel", () => dragging = false);

document.getElementById("centerBtn").addEventListener("click", () => {
  decorX = canvas.width / 2;
  decorY = canvas.height / 2;
  draw();
});
document.getElementById("resetBtn").addEventListener("click", () => {
  scaleInput.value = 35;
  rotationInput.value = 0;
  scaleLabel.textContent = "35%";
  rotationLabel.textContent = "0°";
  decorX = canvas.width * 0.7;
  decorY = canvas.height * 0.65;
  draw();
});
downloadBtn.addEventListener("click", () => {
  if (!roomReady || !decorReady) return;
  const link = document.createElement("a");
  link.download = "decora-room-preview.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// Initial blank state.
draw();
