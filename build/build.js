var gui = new dat.GUI();
var params = {
    Download_Image: function () { return save(); },
    train_function: 0,
    wave_function: 0,
    i: 0,
    a: 0,
    t: 0,
};
gui.add(params, "Download_Image");
gui.add(params, "train_function", 0, 1, 1);
gui.add(params, "wave_function", 0, 1, 1);
gui.add(params, "i", 0, 511, 1);
gui.add(params, "a", 0, 1, 0.1);
gui.add(params, "t", 0, 1, 0.1);
var illustration;
var z = [];
var nbFrame = 0;
var NB_FRAMES_TO_EXPORT = 120;
var evol = 0;
var alea = 0;
var debut = 0;
var ai = new rw.HostedModel({
    url: "https://fashion-illustrations-d4f1e2ab.hosted-models.runwayml.cloud/v1/",
    token: "E7MFZQFcsEGWSebBblGQNg==",
});
var img;
function draw() {
    if (illustration)
        image(illustration, 0, 0, width, height);
}
function gotImage(result) {
    illustration = createImg(result.image);
    illustration.hide();
}
function progression(debut) {
    if (params.train_function > 1)
        trainProgression(debut);
    else if (params.wave_function > 1)
        waveProgression(debut);
}
function trainProgression(debut) {
    var fin = debut + 10;
    if (fin >= 512)
        fin -= 511;
    var val = params.a;
    for (var i = 0; i < 512; i++) {
        if ((debut < fin && (i >= debut && i <= fin)) || (debut > fin && (i >= debut || i <= fin))) {
            val += 0.1;
            if (val > 1)
                val = 0;
            z[i] = val;
        }
    }
}
function waveProgression(debut) {
    var size = 2 * (1.0 - params.a);
    var pos = debut;
    var incr = 0.1;
    for (var i = 0; i < size; i++) {
        if (z[pos] + incr > 1.0)
            incr = -0.1;
        if (pos >= 512)
            pos = 0;
        z[pos] += incr;
        pos++;
    }
}
function newIllustration() {
    debut = params.i;
    for (var i = 0; i < 512; i++) {
        z[i] = params.a;
    }
    progression(debut);
    evol = 1;
    loopIllustration();
}
function newIllustrationAlea() {
    for (var i = 0; i < 512; i++) {
        z[i] = random(-1, 1);
    }
    evol = 1;
    loopIllustration();
}
function loopIllustration() {
    var inputs = {
        "z": z,
        "truncation": params.t,
    };
    ai.query(inputs).then(function (outputs) {
        var image = outputs.image;
        gotImage(outputs);
        debut += 1;
        if (debut >= 512)
            debut = 0;
        progression(debut);
        console.log(z[debut] + " " + debut + " " + z[debut + 1] + " " + debut + 1);
        if (evol && nbFrame < NB_FRAMES_TO_EXPORT)
            loopIllustration();
    });
}
function stopLoop() {
    evol = 0;
    alea = 0;
}
function setup() {
    p6_CreateCanvas();
    createButton('generate').mousePressed(newIllustration);
    createButton('start').mousePressed(newIllustrationAlea);
    createButton('stop').mousePressed(stopLoop);
}
function windowResized() {
    p6_ResizeCanvas();
}
var __ASPECT_RATIO = 1;
var __MARGIN_SIZE = 25;
function __desiredCanvasWidth() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return windowWidth - __MARGIN_SIZE * 2;
    }
    else {
        return __desiredCanvasHeight() * __ASPECT_RATIO;
    }
}
function __desiredCanvasHeight() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return __desiredCanvasWidth() / __ASPECT_RATIO;
    }
    else {
        return windowHeight - __MARGIN_SIZE * 2;
    }
}
var __canvas;
function __centerCanvas() {
    __canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}
function p6_CreateCanvas() {
    __canvas = createCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
function p6_ResizeCanvas() {
    resizeCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
var p6_SaveImageSequence = function (durationInFrames, fileExtension) {
    if (frameCount <= durationInFrames) {
        noLoop();
        var filename_1 = nf(frameCount - 1, ceil(log(durationInFrames) / log(10)));
        var mimeType = (function () {
            switch (fileExtension) {
                case 'png':
                    return 'image/png';
                case 'jpeg':
                case 'jpg':
                    return 'image/jpeg';
            }
        })();
        __canvas.elt.toBlob(function (blob) {
            p5.prototype.downloadFile(blob, filename_1, fileExtension);
            setTimeout(function () { return loop(); }, 100);
        }, mimeType);
    }
};
//# sourceMappingURL=../src/src/build.js.map