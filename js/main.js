let rows = 3
let cols = 3

let imgs = []
let imgGrid = []

let video
let poseNet
let nose

//let constraints1 //per webcam esterna...

function preload() {

    //precarico le immagini in un'array
    for (i = 0; i < 9; i++) {
        imgs[i] = loadImage("data/face_" + i + ".jpg")
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


    //metto le immagini dell'array in una "griglia"... Percorro l'array con un'indice
    let index = 0
    for (let i = 0; i < cols; i++) {
        imgGrid[i] = [] //cruciale!! Questo crea gli array innestati!
        for (let j = 0; j < rows; j++) {
            imgGrid[i][j] = imgs[index]
            index = index + 1
        }
    }

}

function draw() {

    /*
    //Presento le immagini in una griglia
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * 50
        let y = j * 50
        image(imgGrid[i][j],x,y,50,50)
      }
    }
    */


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
                let cellWidth = i * (width / cols) //not sure
                let cellHeight = j * (height / rows) //not sure
                noFill()
                stroke(255, 0, 0)
                strokeWeight(1)
                rect(cellWidth, cellHeight, width / cols, height / rows)

                if ((nose.x > i * (width / cols) && nose.x < (i + 1) * (width / cols)) && (nose.y > j * (height / rows) && nose.y < (j + 1) * (height / rows))) {//posso sostituire con le variabili create prima
                    console.log("siamo nella cella: " + i + ", " + j)
                    //matrice alterata... Riposiziona l'img
                    push()
                    scale(1.3)
                    translate(0,0)
                    image(imgs[i + j + 2 * j], 0, 0)//2 equivale alla numero di colonne del 2D array... mate?
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