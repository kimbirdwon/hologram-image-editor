const upload = document.getElementById("upload")
const resizeBtn = document.getElementById("resizeBtn")
const preview = document.getElementById("preview")
const download = document.getElementById("download")
const widthInput = document.getElementById("width")
const heightInput = document.getElementById("height")

let originalWidth, originalHeight, aspectRatio

upload.addEventListener("change", function() {
    const file = upload.files[0]
    if(!file) return

    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = function() {
        originalWidth = img.width
        originalHeight = img.height
        aspectRatio = originalWidth / originalHeight

        // 기본값을 원본 비율로 설정
        widthInput.value = originalWidth
        heightInput.value = originalHeight
        preview.src = img.src
        download.href = img.src
        download.innerText = "이미지 다운로드"
    }
})

// width 입력 시 height 자동 계산
widthInput.addEventListener("input", function() {
    if(aspectRatio) {
        const newWidth = parseInt(widthInput.value)
        heightInput.value = Math.round(newWidth / aspectRatio)
    }
})

// height 입력 시 width 자동 계산
heightInput.addEventListener("input", function() {
    if(aspectRatio) {
        const newHeight = parseInt(heightInput.value)
        widthInput.value = Math.round(newHeight * aspectRatio)
    }
})

resizeBtn.addEventListener("click", resizeImage)

function resizeImage(){
    const file = upload.files[0]
    if(!file){
        alert("이미지를 선택하세요")
        return
    }

    const width = parseInt(widthInput.value)
    const height = parseInt(heightInput.value)

    const reader = new FileReader()
    reader.onload = function(event){
        const img = new Image()
        img.onload = function(){
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)
            const resizedImage = canvas.toDataURL("image/png")
            preview.src = resizedImage
            download.href = resizedImage
            download.download = "resized.png"
            download.innerText = "이미지 다운로드"
        }
        img.src = event.target.result
    }
    reader.readAsDataURL(file)
}
