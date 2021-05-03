// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Download_Image: () => save(),
}
gui.add(params, "Download_Image")

let rainbow;
const z = [];
let evol = 0;
let alea = 0;

// You need to change this and use the values given to you by Runway for your own model
const ai = new rw.HostedModel({
    url: "https://fashion-illustrations-5e1ed0b0.hosted-models.runwayml.cloud/v1/",
    token: "Y+i486Z+D1DO9jEAFibcyA==",
  });

let img: p5.Element
//// You can use the info() method to see what type of input object the model expects
// model.info().then(info => console.log(info));

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
    if (alea)
        loopRainbowAlea();
    else 
        loopRainbow();
}

function loopRainbow(){
    const inputs = {
        "z": z,
        "truncation": 0.8
    };

    ai.query(inputs).then(outputs => {
        gotImage(outputs)
        z[0] +=0.5
        if (evol)
            loopRainbow()
    });
}

function loopRainbowAlea(){
    const inputs = {
        "z": z,
        "truncation": 0.8
    };

    ai.query(inputs).then(outputs => {
        gotImage(outputs)
        z[0] += random(-1,1)
        if (evol)
            loopRainbow()
    });
}

function stop(){
    evol = 0;
    alea = 0;
}

// -------------------
//    Initialization
// -------------------

function setup() {
    p6_CreateCanvas()
    createButton('start_lineaire').mousePressed(newRainbow)
    createButton('start_aleatoire').mousePressed(newRainbowAlea)
    createButton('stop').mousePressed(stop)
}

function windowResized() {
    p6_ResizeCanvas()
}