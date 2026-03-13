// HTML 요소
const upload = document.getElementById("upload");
const preview = document.getElementById("preview");
const download = document.getElementById("download");

// Canvas 고정 크기
const canvasSize = 500;
const canvas = document.createElement("canvas");
canvas.width = canvasSize;
canvas.height = canvasSize;
const ctx = canvas.getContext("2d");

// 초기 검정 배경
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvasSize, canvasSize);

// 이미지 업로드 이벤트
upload.addEventListener("change", function() {
    const file = upload.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function() {
        // 이미지 최대 크기 (Canvas 80% 범위)
        const maxWidth = canvasSize * 0.8;
        const maxHeight = canvasSize * 0.8;

        let width = img.width;
        let height = img.height;
        const aspect = width / height;

        // 비율 유지하며 크기 조정
        if (width > maxWidth) {
            width = maxWidth;
            height = width / aspect;
        }
        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspect;
        }

        // 이미지 중앙 좌표 계산
        const offsetX = (canvasSize - width) / 2;
        const offsetY = (canvasSize - height) / 2;

        // Canvas 초기화 + 검정 배경
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // 이미지 그리기
        ctx.drawImage(img, offsetX, offsetY, width, height);

        // 미리보기
        preview.src = canvas.toDataURL("image/png");

        // 다운로드 링크
        download.href = canvas.toDataURL("image/png");
        download.download = "resized.png";
    };
});
