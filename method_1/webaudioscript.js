/*Suprisingly stands for canvas*/
class CanvasGraph {
    constructor(idOfCanvas, sound) {
        this.canvas = document.getElementById(idOfCanvas);
        this.ctx = this.canvas.getContext("2d");
        this.sound = sound;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.offset = (1 / (sound.fftArrayPart.length - 1)) * this.width;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.strokeStyle = "#000000";
        this.ctx.strokeRect(0, 0, this.width, this.height);
    }

    renderAll() {
        this.clear();
        this.renderLines();
        this.renderPoints();
    }

    renderLines() {
        let prevX = 0;
        let prevY = this.height;
        let data = this.sound.fftArrayPart;
        for (let x = 0; x < data.length; x++) {
            this.drawLine(prevX, prevY, x * this.offset, this.height - data[x], 'black', 1);
            prevX = x * this.offset;
            prevY = this.height - data[x];
        }
    }

    renderPoints() {
        let data = this.sound.fftArrayPart;
        let indexOfMax = this.getIndexOfMaximum();
        for (let x = 0; x < data.length; x++) {
            if (indexOfMax === x) {
                document.querySelector("#maximum").innerHTML = "Current maximum index: " + indexOfMax;
                this.ctx.strokeStyle = "#0000FF";
                this.ctx.fillStyle = "#00FFFF";
                this.ctx.beginPath();
                this.ctx.arc(x * this.offset, this.height - data[x], 10, 0, 2 * Math.PI, false);
            } else {
                this.ctx.strokeStyle = "#FF0000";
                this.ctx.fillStyle = "#FFEE55";
                this.ctx.beginPath();
                this.ctx.arc(x * this.offset, this.height - data[x], 3, 0, 2 * Math.PI, false);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
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

    getIndexOfMaximum() {
        // let array = this.sound.fftArrayPart;
        // let max = array.reduce(function (a, b) {
        //     return Math.max(a, b);
        // });

        let array = this.sound.fftArray;
        let max = array.reduce(function (a, b) {
            return Math.max(a, b);
        });

        let greatest = this.sound.fftArray[0];
        let indexOfGreatest = 0;
        for(let i=1;i<250;i++){
            if(this.sound.fftArray[i] > greatest){
                greatest = this.sound.fftArray[i];
                indexOfGreatest = i;
            }
        }

        let number = ((indexOfGreatest+1) * this.sound.context.sampleRate / (2 * this.sound.analyserNode.frequencyBinCount)) + 0.7;
        document.querySelector("#found").innerHTML = "Frequency found: " + number;

        console.log('velikost pole: ' + this.sound.fftArray.length);
        console.log('bin count: ' + this.sound.analyserNode.frequencyBinCount);
        console.log('fftSize: ' + this.sound.analyserNode.fftSize);
        console.log('sample rate: ' + this.sound.context.sampleRate);

        // let index = array.indexOf(max);
        // console.log(this.sound.fftArray.length);
        // console.log(this.sound.analyserNode.frequencyBinCount);
        // let number = (index) * this.sound.context.sampleRate / this.sound.analyserNode.frequencyBinCount;
        // document.querySelector("#found").innerHTML = "Frequency found: " + number;
        // return array.indexOf(max);
        return indexOfGreatest;
    };
}

/*Suprisingly represents sound*/
class Sound {
    constructor(frequency) {
        this.frequency = frequency;
        this.soundOn = false;
        this.fftArray = null;
        this.fftArrayPart = null;
        this.context = new (window.AudioContext)();
        this.oscillatorNode = this.context.createOscillator();
        this.analyserNode = this.context.createAnalyser();
        this.gainNode = this.context.createGain();
        this.setUp();
    }

    setUp() {
        this.oscillatorNode.type = 'square';
        this.oscillatorNode.frequency.value = 440;

        this.oscillatorNode.connect(this.gainNode);
        this.gainNode.connect(this.analyserNode);
        this.oscillatorNode.start();
        this.gainNode.gain.value = 1;

        this.analyserNode.fftSize = document.querySelector('#fftSize').value;

        // this.fftArray = new Float32Array(this.analyserNode.frequencyBinCount);
        this.fftArray = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.fftArrayPart = this.fftArray.slice(0, this.fftArray.length / 32);
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
        this.analyserNode.getByteFrequencyData(this.fftArray);
        this.fftArrayPart = this.fftArray.slice(0, this.fftArray.length / 32);
    }

    changeFftSize(value) {
        this.analyserNode.fftSize = value;
        this.fftArray = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.fftArrayPart = this.fftArray.slice(0, this.fftArray.length / 32);
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
let sound = new Sound(440);
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
    // myCanvas.renderAll();
});

document.querySelector('#down').addEventListener('click', function () {
    let frequency = sound.changeFrequency(sound.frequency - 50);
    document.querySelector("#frequency").innerHTML = "Current frequency: " + frequency;
    watch.start();
    sound.updateData();
    // myCanvas.renderAll();
});

document.querySelector('#show').addEventListener('click', function () {
    sound.updateData();
    myCanvas.renderAll();
});

document.querySelector('#fftSize').addEventListener('change', function () {
    let value = document.querySelector('#fftSize').value;
    sound.changeFftSize(value);
    // myCanvas = new CanvasGraph("myCanvas", sound.fftArrayPart);
    sound.updateData();
    // myCanvas.renderAll();
});

document.querySelector('#soundType').addEventListener('change', function () {
    let value = document.querySelector('#soundType').value;
    sound.oscillatorNode.type = value;
    // myCanvas = new CanvasGraph("myCanvas", sound.fftArray);
    sound.updateData();
    // myCanvas.renderAll();
});

document.querySelector('#smoothingConst').addEventListener('change', function () {
    let value = document.querySelector('#smoothingConst').value;
    sound.analyserNode.smoothingTimeConstant = value;
    console.log(value);
    sound.updateData();
    // myCanvas.renderAll();
});

/* Mobile version */
document.querySelector('#upMobile').addEventListener('click', function () {
    let frequency = sound.changeFrequency(sound.frequency + 1);
    document.querySelector("#frequency").innerHTML = "Current frequency: " + frequency;
    watch.start();
    sound.updateData();
});

document.querySelector('#downMobile').addEventListener('click', function () {
    let frequency = sound.changeFrequency(sound.frequency + 1);
    document.querySelector("#frequency").innerHTML = "Current frequency: " + frequency;
    watch.start();
    sound.updateData();
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
        // myCanvas.renderAll();
    }
    if (e.keyCode === 40) {
        let frequency = sound.changeFrequency(sound.frequency - 1);
        document.querySelector("#frequency").innerHTML = "Current frequency: " + frequency;
        watch.start();
        sound.updateData();
        // myCanvas.renderAll();
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


// function countAndDraw(oldData) {
//     let smallOldData = oldData;
//     sound.updateData();
//     let newData = sound.fftArrayPart;
//     let smallNewData = newData.filter(Number);
//     if (smallNewData.length < 35){
//         // console.log(smallNewData.length);
//         if(arraysEqual(smallOldData, smallNewData)){
//             console.log('they are the same');
//         }
//     }
//     // console.log(smallNewData);
//     // console.log(lastData);
//     myCanvas.renderAll();
//     window.requestAnimationFrame(countAndDraw(smallNewData));
// }
// window.requestAnimationFrame(countAndDraw);


