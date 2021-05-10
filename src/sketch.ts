// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Download_Image: () => save(),
    i:0,
    j:0,
    a:0,
    t:0,
}
gui.add(params, "Download_Image")
gui.add(params, "i", 0, 511, 1)
gui.add(params, "j", 0, 511, 1)
gui.add(params, "a", 0, 5, 0.001)
gui.add(params, "t", 0, 1, 0.1)

let rainbow;
const z = [];
let evol = 0;
let alea = 0;
let a = 1;
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
    if (rainbow)
        image(rainbow, 0, 0, width, height)
}

function gotImage(result){
    rainbow = createImg(result.image)
    rainbow.hide()
}

function newRainbowAlea(){
    alea=1;
    newRainbow();
}

function newRainbow(){
    for (let i=0; i<512; i++){
        z[i] = random(-1,1)
    }
    
    evol = 1;
     
    loopRainbow();
}

function loopRainbow(){
    const inputs = {
        "z": z,
        "truncation": params.t,
    };

    a+= 1.5;
    if (a > 10){
        a = 1;
        i += 1;
    }

    ai.query(inputs).then(outputs => {
        gotImage(outputs)
        z[i] = a
        if (evol)
            loopRainbow()
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
    createButton('start').mousePressed(newRainbow)
    createButton('stop').mousePressed(stopLoop)
}

function windowResized() {
    p6_ResizeCanvas()
}