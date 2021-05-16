// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Download_Image: () => save(),
    train_function:0,
    wave_function:0,   
    jump_function:0, 
    circle_function:0,
    linear_function:0,
    random_function:0,
    i:0,
    a:0,
    t:0,
}
gui.add(params, "Download_Image")
gui.add(params, "train_function", 0, 1, 1)
gui.add(params, "wave_function", 0, 1, 1)
gui.add(params, "jump_function", 0, 1, 1)
gui.add(params, "circle_function", 0, 1, 1)
gui.add(params, "linear_function", 0, 1, 1)
gui.add(params, "random_function", 0, 1, 1)
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
    url: "https://fashion-illustrations-fbdd0d10.hosted-models.runwayml.cloud/v1/",
    token: "bb0c4KTNvKC5ud66iHROOg==",
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
    if (params.train_function > 0)
        trainProgression(debut)
    else if (params.wave_function > 0)
        waveProgression(debut)
    else if (params.jump_function > 0)
        jumpProgression(debut)
    else if (params.circle_function > 0)
        circleProgression(debut)
    else if (params.linear_function > 0)
        linearProgression(debut)
    else 
        randomProgression(debut)
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

function jumpProgression(debut){
    let jump = 10*params.a //valeur entre 0 et 10
    let pos = debut
    for (let i = 0; i<10; i++){
        if (z[pos]+0.1 > 1)
            z[pos] = -0.1
        z[pos]+=0.1
        pos += jump
    }
}

function circleProgression(debut){
    let angle = (2* Math.PI * debut - Math.PI) / 511 
    z[params.i] = cos(angle)*cos(angle) //au carre pour obtenir une valeur positive (entre 0 et 1)
    console.log(params.i+" "+z[params.i]+" "+angle)
}

function linearProgression(debut){
    if (z[params.i]+0.15 > 1.0)
        z[params.i]=0.0
    else 
        z[params.i] += 0.15   
    console.log(z[params.i])
}

function randomProgression(debut){
    z[debut] = random(0,1)
}

function newIllustration(){
    debut = params.i
    for (let i=0; i<512; i++){
        z[i] = params.a
    }
    
    evol = 1
    loopIllustration();
}


function newIllustrationAlea(){
    for (let i=0; i<512; i++){
        z[i] = random(0,1)
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
        progression(debut)
        
        p5.prototype.downloadFile(image , nbFrame.toString(), "png")
        nbFrame++
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
    createButton('start').mousePressed(newIllustration)
    createButton('start_alea').mousePressed(newIllustrationAlea)
    createButton('stop').mousePressed(stopLoop)
}

function windowResized() {
    p6_ResizeCanvas()
}