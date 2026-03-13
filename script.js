const upload = document.getElementById("upload");
const preview = document.getElementById("preview");
const download = document.getElementById("download");
const widthInput = document.getElementById("width_cm");

const panelCm = 18;
const canvasSize = 500;
const canvas = document.createElement("canvas");
canvas.width = canvasSize;
canvas.height = canvasSize;
const ctx = canvas.getContext("2d");

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvasSize, canvasSize);

let originalImage = null;

upload.addEventListener("change", function() {
    const file = upload.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function() {
        originalImage = img;
        drawCanvas(parseFloat(widthInput.value) || 5);
    };
});

widthInput.addEventListener("input", function() {
    if (originalImage) drawCanvas(parseFloat(widthInput.value));
});

function drawCanvas(userCm) {
    if (!userCm || userCm <= 0 || userCm > panelCm) return;

    const ratio = userCm / panelCm;
    const imgWidth = Math.round(canvasSize * ratio);
    const imgHeight = Math.round(imgWidth * (originalImage.height / originalImage.width));

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    const offsetX = Math.round((canvasSize - imgWidth) / 2);
    const offsetY = Math.round((canvasSize - imgHeight) / 2);
    ctx.drawImage(originalImage, offsetX, offsetY, imgWidth, imgHeight);

    preview.src = canvas.toDataURL("image/png");
}

// 클릭 이벤트에서 JPG 다운로드 강제
download.addEventListener("click", function(e){
    e.preventDefault();
    if (!originalImage) return;

    const jpgUrl = canvas.toDataURL("image/jpeg", 0.95);
    const a = document.createElement("a");
    a.href = jpgUrl;
    a.download = "resized.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
