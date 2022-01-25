/*Suprisingly stands for canvas*/
class CanvasGraph {
    constructor(idOfCanvas, sound) {
        this.canvas = document.getElementById(idOfCanvas);
        this.ctx = this.canvas.getContext("2d");
        this.sound = sound;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.offset = (1 / (sound.fftArray.length - 1)) * this.width;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.strokeStyle = "#000000";
        this.ctx.strokeRect(0, 0, this.width, this.height);
        this.offset = (1 / (sound.fftArray.length - 1)) * this.width;
    }

    renderAll() {
        this.clear();
        this.renderLines();
    }

    renderLines() {
        let prevX = 0;
        let prevY = this.height;
        let data = this.sound.fftArray;
        let heightOfData;
        for (let x = 0; x < data.length; x++) {
            heightOfData = this.height / 2 + (-data[x] * this.height / 10);
            this.drawLine(prevX, prevY, x * this.offset, heightOfData, 'black', 1);
            prevX = x * this.offset;
            prevY = heightOfData;
        }
        //document.querySelector('#result').innerHTML = "Current frequency guess: " + this.findFrequency();
    }

    drawLine(startX, startY, endX, endY, strokeStyle, lineWidth) {
        if (strokeStyle != null) this.ctx.strokeStyle = strokeStyle;
        if (lineWidth != null) this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.closePath();
    };

    findFrequency() {
        let data = this.sound.fftArray;
        // console.log(data);
        let halfDataLength = Math.floor(data.length * 0.5);
        let difference = 0;
        let smallestDifference = Number.POSITIVE_INFINITY;
        let smallestDifferenceOffset = 0;

        for (let o = 1; o < halfDataLength; o++) {

            difference = 0;

            for (let i = 0; i < halfDataLength; i++) {
                difference += Math.abs(data[i] - data[i + o]);
            }

            // difference /= halfDataLength;

            if (difference < smallestDifference) {
                smallestDifference = difference;
                smallestDifferenceOffset = o;
            }
        }

        let f = this.sound.context.sampleRate / smallestDifferenceOffset;
        this.updateInfoData(f, smallestDifference, smallestDifferenceOffset);
        // return this.sound.context.sampleRate / smallestDifferenceOffset;
    }

    updateInfoData(frequency, smallestDifference, smallestDifferenceOffset){
        document.querySelector('#result').innerHTML = "Current frequency guess: " + frequency;
        document.querySelector('#offset').innerHTML = "Offset of current frequency: " + smallestDifferenceOffset;
        document.querySelector('#difference').innerHTML = "Smallest difference: " + smallestDifference;
    }
}

/*Suprisingly represents sound*/
class Sound {
    constructor(frequency) {
        this.frequency = frequency;
        this.soundOn = false;
        this.fftArray = null;
        this.context = new (window.AudioContext)();
        this.oscillatorNode = this.context.createOscillator();
        this.analyserNode = this.context.createAnalyser();
        this.gainNode = this.context.createGain();
        this.setUp();
    }

    setUp() {
        this.oscillatorNode.type = 'sine';
        this.oscillatorNode.frequency.value = this.frequency;

        this.oscillatorNode.connect(this.gainNode);
        this.gainNode.connect(this.analyserNode);
        this.oscillatorNode.start();
        this.gainNode.gain.value = 1;

        this.analyserNode.fftSize = document.querySelector('#fftSize').value;

        // this.fftArray = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.fftArray = new Float32Array(this.analyserNode.frequencyBinCount);
    }

    turnOn() {
        this.analyserNode.connect(this.context.destination);
        this.soundOn = true;
    }

    turnOff() {
        this.analyserNode.disconnect(this.context.destination);
        this.soundOn = false;
    }

    changeFrequency(value) {
        this.oscillatorNode.frequency.value = value;
        return this.frequency = value;
    }

    updateData() {
        // this.analyserNode.getByteTimeDomainData(this.fftArray);
        this.analyserNode.getFloatTimeDomainData(this.fftArray);
    }

    changeFftSize(value) {
        this.analyserNode.fftSize = value;

        // this.fftArray = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.fftArray = new Float32Array(this.analyserNode.frequencyBinCount);
    }

    playSound(buffer) {                            // not working concept TODO
        let source = context.createBufferSource(); // creates a sound source
        source.buffer = buffer;                    // tell the source which sound to play
        source.connect(context.destination);       // connect the source to the context's destination (the speakers)
        source.start(0);                           // play the source now
    }
}

class StopWatch {
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
        this.time = 0;
    }

    start() {
        let date = new Date();
        this.startTime = date.getTime();
    }

    stop() {
        let date = new Date();
        this.endTime = date.getTime();
        this.time = this.endTime - this.startTime;
    }

    display(element) {
        document.querySelector(element).innerHTML = "Time between frequency change and steady state: " + this.time + " ms";
    }
}

/*Script*/
let sound = new Sound(50);
let myCanvas = new CanvasGraph("myCanvas", sound);
let watch = new StopWatch();

/*Writing current frequency to a paragraph*/
document.querySelector("#frequency").innerHTML = "Current frequency: " + sound.frequency;

/*eventlisteners for click*/
document.querySelector('#toggle').addEventListener('click', function () {
    if (sound.soundOn === false) {
        sound.turnOn();
    } else {
        sound.turnOff();
    }
});

document.querySelector('#up').addEventListener('click', function () {
    let frequency = sound.changeFrequency(sound.frequency + 50);
    document.querySelector("#frequency").innerHTML = "Current frequency: " + frequency;
    watch.start();
    sound.updateData();
    myCanvas.findFrequency();
});

document.querySelector('#down').addEventListener('click', function () {
    let frequency = sound.changeFrequency(sound.frequency - 50);
    document.querySelector("#frequency").innerHTML = "Current frequency: " + frequency;
    watch.start();
    sound.updateData();
    myCanvas.findFrequency();
});

document.querySelector('#show').addEventListener('click', function () {
    sound.updateData();
    myCanvas.findFrequency();
    // document.querySelector('#result').innerHTML = "Current frequency guess: " + myCanvas.findFrequency();
});

document.querySelector('#fftSize').addEventListener('change', function () {
    let value = document.querySelector('#fftSize').value;
    sound.changeFftSize(value);
    sound.updateData();
});

document.querySelector('#soundType').addEventListener('change', function () {
    let value = document.querySelector('#soundType').value;
    sound.oscillatorNode.type = value;
    sound.updateData();
});

/* Mobile version */
document.querySelector('#upMobile').addEventListener('click', function () {
    let frequency = sound.changeFrequency(sound.frequency + 1);
    document.querySelector("#frequency").innerHTML = "Current frequency: " + frequency;
    watch.start();
    sound.updateData();
    myCanvas.findFrequency();
});

document.querySelector('#downMobile').addEventListener('click', function () {
    let frequency = sound.changeFrequency(sound.frequency + 1);
    document.querySelector("#frequency").innerHTML = "Current frequency: " + frequency;
    watch.start();
    sound.updateData();
    myCanvas.findFrequency();
});

document.querySelector('#stopMobile').addEventListener('click', function () {
    watch.stop();
    watch.display('#time');
});


/*eventListeners for keyboard*/
document.addEventListener('keydown', function (e) {
    // console.log(e.keyCode);
    if (e.keyCode === 38) {
        let frequency = sound.changeFrequency(sound.frequency + 1);
        document.querySelector("#frequency").innerHTML = "Current frequency: " + frequency;
        watch.start();
        sound.updateData();
        myCanvas.findFrequency();
    }
    if (e.keyCode === 40) {
        let frequency = sound.changeFrequency(sound.frequency - 1);
        document.querySelector("#frequency").innerHTML = "Current frequency: " + frequency;
        watch.start();
        sound.updateData();
        myCanvas.findFrequency();
    }
    if (e.keyCode === 32) {
        watch.stop();
        watch.display('#time');
    }
});

function countAndDraw() {
    sound.updateData();
    myCanvas.renderAll();
    window.requestAnimationFrame(countAndDraw);
}

window.requestAnimationFrame(countAndDraw);

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}