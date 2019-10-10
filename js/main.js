
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
  for(i=0; i<9; i++){
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
  

  push()//per riflettere l'immagine a specchio "congelo" con push e pop. diventa però un problema per checkare la posizione del naso...
  //scale(-1,1)
  //translate(-video.width, 0)
  image(video, 0, 0, width, height)
  
  if (nose) {
    stroke(255, 0, 0)
    strokeWeight(16)
    point(nose.x, nose.y)
    pop()

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let cellWidth = i * (width/cols)//not sure
        let cellHeight = j * (height/rows)//not sure
        noFill()
        stroke(255,0,0)
        rect(cellWidth, cellHeight, width/cols, height/rows)

        if(nose.x < cellWidth &&  nose.y < cellHeight){
          //la condizione non è corretta: manca forse un "maggiore di qualcosa"?
          //come faccio a capire in che cella si trova il punto?... problemi con la matrice?
          //console.log("we are in cell " + i + ", " + j)
          image(imgGrid[i][j],0,0)
        }
      }
    }


    //valutare se specchiare alla fine
    if((nose.x > 0 && nose.x < width/cols)&&(nose.y>0 && nose.y < height/rows)){
      console.log("dentro")
    } //tutte le condizioni per le celle, identificare pattern e mettere in un for

  }
    //console.log(nose.x)

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