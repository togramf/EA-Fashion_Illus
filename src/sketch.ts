// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Download_Image: () => save(),
    i:0,
    a:0,
    t:0,
}
gui.add(params, "Download_Image")
gui.add(params, "i", 0, 511, 1)
gui.add(params, "a", 0, 5, 0.001)
gui.add(params, "t", 0, 1, 0.1)

let illustration
const z = []
let nbFrame = 0
const NB_FRAMES_TO_EXPORT = 120
let evol = 0;
let alea = 0;
let a = 0.0;
let i = 0; 


// You need to change this and use the values given to you by Runway for your own model
const ai = new rw.HostedModel({
   url: "https://fashion-illustrations-d4f1e2ab.hosted-models.runwayml.cloud/v1/",
  token: "E7MFZQFcsEGWSebBblGQNg==",
});

let img: p5.Element

// -------------------
//       Drawing
// -------------------

function draw() {
    if (illustration)
        image(illustration, 0, 0, width, height)
}

function gotImage(result){
    illustration = createImg(result.image)
    illustration.hide()
}

function newIllustration(){
    a = params.a
    for (let i=0; i<512; i++){
        if (a > 1.0)
            a = 0.0
        z[i] = a
        a+=0.02
    }
    
    evol = 1
     
    loopIllustration();
}


function newIllustrationAlea(){
    for (let i=0; i<512; i++){
        z[i] = random(-1,1)
    }

    evol = 1;
     
    loopIllustration();
}


function loopIllustration(){
    const inputs = {
        "z": z,
        "truncation": params.t,
    };


    ai.query(inputs).then(outputs => {
        const { image } = outputs
        gotImage(outputs)
        for (let i = 0; i<512; i++){
            if (z[i]+0.01 > 1.0)
                z[i]=0.0
            else 
                z[i] += 0.01
        }
        console.log(z[0])
        //p5.prototype.downloadFile(image , nbFrame.toString(), "png")
        //nbFrame++
        if (evol && nbFrame < NB_FRAMES_TO_EXPORT)
            loopIllustration()
    });
}

function stopLoop(){
    evol = 0;
    alea = 0;
}

// -------------------
//    Initialization
// -------------------

function setup() {
    p6_CreateCanvas()
    createButton('generate').mousePressed(newIllustration)
    createButton('start').mousePressed(newIllustrationAlea)
    createButton('stop').mousePressed(stopLoop)
}

function windowResized() {
    p6_ResizeCanvas()
}