// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Download_Image: () => save(),
    train_function:0,
    wave_function:0,
    i:0,
    a:0,
    t:0,
}
gui.add(params, "Download_Image")
gui.add(params, "train_function", 0, 1, 1)
gui.add(params, "wave_function", 0, 1, 1)
gui.add(params, "i", 0, 511, 1) //position de départ du train 
gui.add(params, "a", 0, 1, 0.1) //valeur de départ 
gui.add(params, "t", 0, 1, 0.1) //parametre de troncation

let illustration
const z = []
let nbFrame = 0
const NB_FRAMES_TO_EXPORT = 120
let evol = 0;
let alea = 0;
let debut = 0;


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

function progression(debut){
    if (params.train_function > 1)
        trainProgression(debut)
    else if (params.wave_function > 1)
        waveProgression(debut)
}

function trainProgression(debut){
    let fin = debut + 10;
    if (fin >= 512)
        fin -= 511
    let val = params.a

    for (let i=0; i<512; i++){
        if ((debut < fin && (i>=debut && i<=fin)) || (debut > fin && (i>=debut || i<=fin))){
            val += 0.1
            if (val > 1)
                val = 0
            z[i] = val
        }
    }
}

function waveProgression(debut){
    let size = 2 * (1.0 - params.a)
    let pos = debut
    let incr = 0.1

    for (let i=0; i<size; i++){
        if (z[pos]+incr > 1.0)
            incr = - 0.1
        if (pos >= 512)
            pos = 0
        z[pos]+= incr 
        pos ++
    }
}

function newIllustration(){
    debut = params.i
    for (let i=0; i<512; i++){
        z[i] = params.a
    }
    
    progression(debut)
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
        debut += 1
        if (debut >=512)
            debut = 0
        progression(debut)
        console.log(z[debut]+" "+debut+" "+z[debut+1]+" "+debut+1)
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