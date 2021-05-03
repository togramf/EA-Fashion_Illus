var gui = new dat.GUI();
var params = {
    Download_Image: function () { return save(); },
};
gui.add(params, "Download_Image");
var rainbow;
var z = [];
var evol = 0;
var alea = 0;
var ai = new rw.HostedModel({
    url: "https://fashion-illustrations-5e1ed0b0.hosted-models.runwayml.cloud/v1/",
    token: "Y+i486Z+D1DO9jEAFibcyA==",
});
var img;
function draw() {
    if (rainbow)
        image(rainbow, 0, 0, width, height);
}
function gotImage(result) {
    rainbow = createImg(result.image);
    rainbow.hide();
}
function newRainbowAlea() {
    alea = 1;
    newRainbow();
}
function newRainbow() {
    for (var i = 0; i < 512; i++) {
        z[i] = random(-1, 1);
    }
    evol = 1;
    if (alea)
        loopRainbowAlea();
    else
        loopRainbow();
}
function loopRainbow() {
    var inputs = {
        "z": z,
        "truncation": 0.8
    };
    ai.query(inputs).then(function (outputs) {
        gotImage(outputs);
        z[0] += 0.5;
        if (evol)
            loopRainbow();
    });
}
function loopRainbowAlea() {
    var inputs = {
        "z": z,
        "truncation": 0.8
    };
    ai.query(inputs).then(function (outputs) {
        gotImage(outputs);
        z[0] += random(-1, 1);
        if (evol)
            loopRainbow();
    });
}
function stop() {
    evol = 0;
    alea = 0;
}
function setup() {
    p6_CreateCanvas();
    createButton('start_lineaire').mousePressed(newRainbow);
    createButton('start_aleatoire').mousePressed(newRainbowAlea);
    createButton('stop').mousePressed(stop);
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