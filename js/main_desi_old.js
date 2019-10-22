let rows = 1
let cols = 14

let imgs = []

let video
let poseNet
let nose

//let constraints1 //per webcam esterna...

function preload() {

    //precarico le immagini in un'array
    for (i = 0; i < 14; i++) {
        imgs[i] = loadImage("data/desi/face_" + i + ".png")
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

    createCanvas(windowWidth, windowHeight);
    video = createCapture(VIDEO, function(e){
        let w = 256
        video.size(w, w * video.height / video.width)
    })
    console.log(video.width, video.height)
    video.hide()

    //video.hide()
    let poseNet = ml5.poseNet(video, modelReady)
    poseNet.on('pose', gotPoses)    

    background(0,255,0)    


}

function draw() {
    translate(video.width, 0)
    scale(-1,1)
    image(video, 0, 0, video.width, video.height)

    if (nose) {
        stroke(255, 0, 0)
        strokeWeight(16)
        point(nose.x, nose.y)

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let cellWidth = i * (video.width / cols)
                let cellHeight = j * (video.height / rows)
                noFill()
                stroke(255, 0, 0)
                strokeWeight(1)
                rect(cellWidth, cellHeight, video.width / cols, video.height / rows)

                if ((nose.x > i * (video.width / cols) && nose.x < (i + 1) * (video.width / cols)) && (nose.y > j * (video.height / rows) && nose.y < (j + 1) * (video.height / rows))) {//posso sostituire con le variabili create prima
                    //console.log("siamo nella cella: " + i + ", " + j)
                    push()
                    translate(-video.width, 0)
                    image(imgs[i + j + 4 * j], -width/2, 0, width, height)//equivale alla numero di colonne del 2D array... mate?
                    fill(255,0,0)
                    //rect(-video.width, 0, 150,150)
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

function windowResized(){
    resizeCanvas(windowWidth, windowHeight)
}
