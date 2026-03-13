// script.js
const upload = document.getElementById("upload");
const preview = document.getElementById("preview");
const download = document.getElementById("download");
const widthInput = document.getElementById("width_cm");
const resizeBtn = document.getElementById("resizeBtn");

const panelCm = 18;      // 팬 실제 가로(cm)
const canvasSize = 500;   // 검정 캔버스 고정 픽셀
const canvas = document.createElement("canvas");
canvas.width = canvasSize;
canvas.height = canvasSize;
const ctx = canvas.getContext("2d");

let originalImage = null;

// 이미지 업로드
upload.addEventListener("change", () => {
    const file = upload.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        originalImage = img;
        // 업로드 후 자동 미리보기 (투명 배경 크롭)
        const cropped = cropTransparentEdges(originalImage);
        preview.src = cropped.toDataURL("image/png");
    };
});

// 리사이즈 버튼 클릭
resizeBtn.addEventListener("click", () => {
    if (!originalImage) { alert("이미지를 선택하세요"); return; }
    let userCm = parseFloat(widthInput.value);
    if (!userCm || userCm <= 0 || userCm > panelCm) userCm = 5;
    drawCanvas(userCm);
});

// 투명 영역 크롭
function cropTransparentEdges(image) {
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = image.width;
    tmpCanvas.height = image.height;
    const tmpCtx = tmpCanvas.getContext("2d");
    tmpCtx.drawImage(image, 0, 0);

    const data = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height).data;
    let minX = tmpCanvas.width, minY = tmpCanvas.height;
    let maxX = 0, maxY = 0;

    for (let y = 0; y < tmpCanvas.height; y++) {
        for (let x = 0; x < tmpCanvas.width; x++) {
            const alpha = data[(y * tmpCanvas.width + x) * 4 + 3];
            if (alpha > 0) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    if (minX > maxX || minY > maxY) return tmpCanvas;

    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = w;
    croppedCanvas.height = h;
    const croppedCtx = croppedCanvas.getContext("2d");
    croppedCtx.drawImage(tmpCanvas, minX, minY, w, h, 0, 0, w, h);
    return croppedCanvas;
}

// 캔버스 그리기
function drawCanvas(userCm) {
    if (!originalImage) return;

    const cropped = cropTransparentEdges(originalImage);
    const ratio = userCm / panelCm;  // cm → 팬 기준 비율
    const imgWidth = Math.round(cropped.width * ratio);
    const imgHeight = Math.round(cropped.height * ratio);

    // 검정 캔버스 초기화
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // 이미지 중앙 배치
    const offsetX = Math.round((canvasSize - imgWidth) / 2);
    const offsetY = Math.round((canvasSize - imgHeight) / 2);
    ctx.drawImage(cropped, 0, 0, cropped.width, cropped.height, offsetX, offsetY, imgWidth, imgHeight);

    // 미리보기
    preview.src = canvas.toDataURL("image/png");

    // 다운로드 (PNG)
    download.href = canvas.toDataURL("image/png");
    download.download = "resized.png";
}
