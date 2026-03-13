const upload = document.getElementById("upload");
const preview = document.getElementById("preview");
const download = document.getElementById("download");
const widthInput = document.getElementById("width_cm");

// 캔버스 고정: 팬 18cm 기준 (웹용 픽셀은 임의, 예: 500px)
const canvasSize = 500;
const canvas = document.createElement("canvas");
canvas.width = canvasSize;
canvas.height = canvasSize;
const ctx = canvas.getContext("2d");

// 초기 검정 배경
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvasSize, canvasSize);

let originalImage = null;

// 이미지 업로드
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

// 가로(cm) 입력 변경 시
widthInput.addEventListener("input", function() {
    if (originalImage) {
        drawCanvas(parseFloat(widthInput.value));
    }
});

// Canvas 그리기 함수
function drawCanvas(userCm) {
    if (!userCm || userCm <= 0 || userCm > 18) return;

    // 팬 전체 18cm → Canvas 500px
    const ratio = userCm / 18; 
    const imgWidth = Math.round(canvasSize * ratio);
    const imgHeight = Math.round(imgWidth * (originalImage.height / originalImage.width));

    // 초기화 + 검정 배경
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // 이미지 중앙 배치
    const offsetX = Math.round((canvasSize - imgWidth) / 2);
    const offsetY = Math.round((canvasSize - imgHeight) / 2);
    ctx.drawImage(originalImage, offsetX, offsetY, imgWidth, imgHeight);

    // 미리보기 & 다운로드
    preview.src = canvas.toDataURL("image/png");
    download.href = canvas.toDataURL("image/png");
    download.download = "resized.png";
}
