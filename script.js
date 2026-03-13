const upload = document.getElementById("upload")
const resizeBtn = document.getElementById("resizeBtn")
const preview = document.getElementById("preview")
const download = document.getElementById("download")
const widthInput = document.getElementById("width_cm")

let originalWidth, originalHeight, aspectRatio

// 팬 실제 가로(cm)
const panelCm = 18

upload.addEventListener("change", function() {
    const file = upload.files[0]
    if(!file) return

    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = function() {
        originalWidth = img.width
        originalHeight = img.height
        aspectRatio = originalWidth / originalHeight

        // 초기값
        widthInput.value = 5  // 기본 5cm
        const newWidthPx = Math.round(originalWidth * (widthInput.value / panelCm))
        const newHeightPx = Math.round(newWidthPx / aspectRatio)

        const canvas = document.createElement("canvas")
        canvas.width = newWidthPx
        canvas.height = newHeightPx
        const ctx = canvas.getContext("2d")
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, 0, 0, newWidthPx, newHeightPx)

        const resizedImage = canvas.toDataURL("image/png")
        preview.src = resizedImage
        download.href = resizedImage
        download.download = "resized.png"
    }
})

resizeBtn.addEventListener("click", function() {
    const file = upload.files[0]
    if(!file){
        alert("이미지를 선택하세요")
        return
    }

    const userCm = parseFloat(widthInput.value)
    if(isNaN(userCm) || userCm <= 0 || userCm > panelCm){
        alert(`1~${panelCm}cm 사이로 입력해주세요`)
        return
    }

    const reader = new FileReader()
    reader.onload = function(event){
        const img = new Image()
        img.onload = function(){
            const ratio = userCm / panelCm
            const newWidthPx = Math.round(originalWidth * ratio)
            const newHeightPx = Math.round(newWidthPx / aspectRatio)

            const canvas = document.createElement("canvas")
            canvas.width = newWidthPx
            canvas.height = newHeightPx
            const ctx = canvas.getContext("2d")
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = "high"
            ctx.drawImage(img, 0, 0, newWidthPx, newHeightPx)

            const resizedImage = canvas.toDataURL("image/png")
            preview.src = resizedImage
            download.href = resizedImage
            download.download = "resized.png"
        }
        img.src = event.target.result
    }
    reader.readAsDataURL(file)
})
