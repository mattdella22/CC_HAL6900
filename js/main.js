console.log("asd")
let rows = 3
let cols = 5

let imgs = []

let video
let poseNet
let nose

//let constraints1 //per webcam esterna...

function preload() {

    //precarico le immagini in un'array
    for (i = 0; i < 15; i++) {
        imgs[i] = loadImage("data/5x3/face_" + i + ".jpg")
    }
}

function setup() {

    /*
    //dati della webcam esterna USB
    constraints1 = {
        video: {
          deviceId: "8148cd9d37a7b93fde4541021765df3ce5d9998e9ea482bd187ed8c0174d6f78",
          groupId: "c2f34f2f5f050de2254100232b9039a6044b9f525ca9e88a1352de33e0fb0c60",
          kind: "videoinput",
          label: "USB Video Device (046d:09a6)"
        }
    }
    //
    */

    createCanvas(640, 480);
    video = createCapture(VIDEO);
    //video = createCapture(constraints1)
    video.size(width, height)
    video.hide()
    let poseNet = ml5.poseNet(video, modelReady)
    poseNet.on('pose', gotPoses)        


}

function draw() {
   //per riflettere l'immagine a specchio "congelo" con push e pop. diventa però un problema per checkare la posizione del naso...
    //scale(-1,1)
    //translate(-video.width, 0)
    translate(video.width, 0)
    scale(-1,1)
    image(video, 0, 0, width, height)

    if (nose) {
        stroke(255, 0, 0)
        strokeWeight(16)
        point(nose.x, nose.y)

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let cellWidth = i * (width / cols)
                let cellHeight = j * (height / rows)
                noFill()
                stroke(255, 0, 0)
                strokeWeight(1)
                rect(cellWidth, cellHeight, width / cols, height / rows)

                if ((nose.x > i * (width / cols) && nose.x < (i + 1) * (width / cols)) && (nose.y > j * (height / rows) && nose.y < (j + 1) * (height / rows))) {//posso sostituire con le variabili create prima
                    console.log("siamo nella cella: " + i + ", " + j)
                    push()
                    scale(0.2)
                    translate(0,0)
                    image(imgs[i + j + cols-1 * j], 0, 0)//equivale alla numero di colonne del 2D array... mate?
                    pop() 
                }
            }
        }

    }

}


//ml5.js stuff...

function gotPoses(poses) {
    if (poses.length > 0) {
        let pose = poses[0].pose;
        nose = pose.keypoints[0].position;
    }
}

function modelReady() {
    console.log('model loaded');
}