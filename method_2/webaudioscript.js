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
            this.drawLine(prevX, prevY, x * this.offset, -data[x], 'black', 1);
            prevX = x * this.offset;
            prevY = -data[x];
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
                this.ctx.arc(x * this.offset, -data[x], 10, 0, 2 * Math.PI, false);
            } else {
                this.ctx.strokeStyle = "#FF0000";
                this.ctx.fillStyle = "#FFEE55";
                this.ctx.beginPath();
                this.ctx.arc(x * this.offset, -data[x], 3, 0, 2 * Math.PI, false);
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

    /*
class method for finding frequency
argument: data - new data from analyserNode (getFloatFrequencyData)
*/
    findFrequency(data) {
        /* Max value */
        let max = data[0];
        /* Index of max value */
        let indexOfMax = 0;
        /* There is no reason to go through the whole array, bin number 250 corresponds to frequency 365 Hz, enough space for mistakes */
        for (let i = 1; i < 250; i++) {
            if (data[i] > max) {
                max = data[i];
                indexOfMax = i;
            }
        }

        /* finding frequency by multiplying index by the bin size*/
        let frequency = indexOfMax * this.sound.context.sampleRate / (2 * this.sound.analyserNode.frequencyBinCount);
        return frequency;
    };

    getIndexOfMaximum() {
        let array = this.sound.fftArray;

        let greatest = this.sound.fftArray[0];
        let indexOfGreatest = 0;
        for (let i = 1; i < 250; i++) {
            if (this.sound.fftArray[i] > greatest) {
                greatest = this.sound.fftArray[i];
                indexOfGreatest = i;
            }
        }

        let number = ((indexOfGreatest + 1) * this.sound.context.sampleRate / (2 * this.sound.analyserNode.frequencyBinCount)) + 0.7;
        document.querySelector("#found").innerHTML = "Frequency found: " + number;
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
        this.watch = new StopWatch();
    }

    setUp() {
        this.oscillatorNode.type = 'square';
        this.oscillatorNode.frequency.value = 440;

        this.oscillatorNode.connect(this.gainNode);
        this.gainNode.connect(this.analyserNode);
        this.oscillatorNode.start();
        this.gainNode.gain.value = 1;

        this.analyserNode.fftSize = document.querySelector('#fftSize').value;

        this.fftArray = new Float32Array(this.analyserNode.frequencyBinCount);
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
        this.watch.start();
        this.analyserNode.getFloatFrequencyData(this.fftArray);
        this.watch.stop();
        this.watch.display('#arrayFill');

        this.fftArrayPart = this.fftArray.slice(0, this.fftArray.length / 32);
    }

    changeFftSize(value) {
        this.analyserNode.fftSize = value;
        this.fftArray = new Float32Array(this.analyserNode.frequencyBinCount);
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
        console.log(this.time);
    }

    display(element) {
        switch(element){
            case "#arrayFill":
                document.querySelector(element).innerHTML = "Time for filling array: " + this.time + " ms";
                break;
            case "#time":
                document.querySelector(element).innerHTML = "Time between frequency change and steady state: " + this.time + " ms";
                break;
            case "#oneFrame":
                document.querySelector(element).innerHTML = "Time for one frame: " + this.time + " ms";
                break;
            default:
                document.querySelector(element).innerHTML = "Time for something: " + this.time + " ms";
                break;
        }

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
    watch.start();
    sound.updateData();
    myCanvas.renderAll();
    window.requestAnimationFrame(countAndDraw);
    watch.stop();
    watch.display("#oneFrame");
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


