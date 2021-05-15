var gui = new dat.GUI();
var params = {
    Download_Image: function () { return save(); },
    i: 0,
    a: 0,
    t: 0,
};
gui.add(params, "Download_Image");
gui.add(params, "i", 0, 511, 1);
gui.add(params, "a", 0, 5, 0.001);
gui.add(params, "t", 0, 1, 0.1);
var illustration;
var z = [];
var nbFrame = 0;
var NB_FRAMES_TO_EXPORT = 120;
var evol = 0;
var alea = 0;
var a = 0.0;
var i = 0;
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
function newIllustration() {
    a = params.a;
    for (var i_1 = 0; i_1 < 512; i_1++) {
        if (a > 1.0)
            a = 0.0;
        z[i_1] = a;
        a += 0.02;
    }
    evol = 1;
    loopIllustration();
}
function newIllustrationAlea() {
    for (var i_2 = 0; i_2 < 512; i_2++) {
        z[i_2] = random(-1, 1);
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
        for (var i_3 = 0; i_3 < 512; i_3++) {
            if (z[i_3] + 0.01 > 1.0)
                z[i_3] = 0.0;
            else
                z[i_3] += 0.01;
        }
        console.log(z[0]);
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