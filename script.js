const video = document.getElementById('video') //video element

//pozivanje modela iz Face API-ja
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'), //detekcija lica
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'), //detekcija crta lica (oči, usta, nos ...)
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'), //detekcija gdje se lice nalazi (postavljanje okvira oko lica)
    faceapi.nets.faceExpressionNet.loadFromUri('/models') //detekcija emocija (tuga, sreća ...)
  ]).then(startVideo) // pozivanje funkcije

//funkcija koja povezuje 'video' element sa web kamerom
function startVideo() {
    navigator.getUserMedia(
        {video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions() // detekcija svih lica, sa crtama lica i izrazima lica
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      faceapi.draw.drawDetections(canvas, resizedDetections) // prikazivanje detekcija na ekranu
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections) // prikazivanje crta lica na ekranu
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections) // prikazivanja izraza lica na ekranu
    }, 100) // interval detekcije lica svakih sto milisekundi
})
