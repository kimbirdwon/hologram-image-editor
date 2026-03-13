const upload = document.getElementById("upload")
const resizeBtn = document.getElementById("resizeBtn")
const preview = document.getElementById("preview")
const download = document.getElementById("download")

resizeBtn.addEventListener("click", resizeImage)

function resizeImage(){

const file = upload.files[0]

if(!file){
alert("이미지를 선택하세요")
return
}

const width = document.getElementById("width").value
const height = document.getElementById("height").value

const reader = new FileReader()

reader.onload = function(event){

const img = new Image()

img.onload = function(){

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

canvas.width = width
canvas.height = height

ctx.drawImage(img,0,0,width,height)

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
