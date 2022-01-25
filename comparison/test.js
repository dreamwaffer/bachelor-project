const OFFSETS = [139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690];

/*Suprisingly stands for canvas*/
class CanvasGraph {

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
    constructor() {
        this.frequencyArray = null;
        this.timeDomainArray = null;
        this.context = new (window.AudioContext)();
        this.oscillatorNode = this.context.createOscillator();
        this.frequencyAnalyserNode = this.context.createAnalyser();
        this.timeDomainAnalyserNode = this.context.createAnalyser();
        this.setUp();
        this.possibleFrequencies = [70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345];
        this.watch = new StopWatch();
    }

    setUp() {
        this.oscillatorNode.type = 'sine';
        this.oscillatorNode.frequency.value = 100;

        this.oscillatorNode.connect(this.frequencyAnalyserNode);
        this.oscillatorNode.connect(this.timeDomainAnalyserNode);
        this.oscillatorNode.start();

        this.frequencyAnalyserNode.smoothingTimeConstant = 0;
        this.timeDomainAnalyserNode.smoothingTimeConstant = 0;

        this.frequencyAnalyserNode.fftSize = 32768;
        this.timeDomainAnalyserNode.fftSize = 4096;

        this.frequencyArray = new Float32Array(this.frequencyAnalyserNode.frequencyBinCount);
        this.timeDomainArray = new Float32Array(this.timeDomainAnalyserNode.frequencyBinCount);
    }

    getRandomFrequency() {
        let frequency = this.possibleFrequencies[getRandomInt(this.possibleFrequencies.length)];
        this.oscillatorNode.frequency.value = frequency;
        console.log('frequency changed to: ' + frequency);
        return frequency;
    }

    updateData() {
        this.frequencyAnalyserNode.getFloatFrequencyData(this.frequencyArray);
        this.timeDomainAnalyserNode.getFloatTimeDomainData(this.timeDomainArray);
    }

    findFrequencyFFT(data) {
        let max = data[0];
        let indexOfMax = 0;
        for (let i = 1; i < 250; i++) {
            if (data[i] > max) {
                max = data[i];
                indexOfMax = i;
            }
        }

        let frequency = (indexOfMax * this.context.sampleRate / (2 * this.frequencyAnalyserNode.frequencyBinCount));
        return frequency;
    };

    findFrequencyAC(data) {
        let halfDataLength = Math.floor(data.length * 0.5);
        let sum = 0;
        let allSums = OFFSETS.map(o => {
            return {'offset': o, 'sum': 0};
        });

        for (let o = 0; o < allSums.length; o++) {
            sum = 0;
            for (let i = 0; i < halfDataLength; i++) {
                sum += data[i] * data [i + allSums[o].offset]; //sum of multiplication
            }
            allSums[o].sum = sum;
        }
        allSums.sort(compare); //sort, greater sum is better

        let candidates = allSums.slice(0, 10);
        console.log(candidates);
        let frequency = this.context.sampleRate / candidates[0].offset;
        return frequency;
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
        return this.time;
    }

    display(element) {
        switch (element) {
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
let sound = new Sound();
let watch = new StopWatch();

let difSumFFT = 0;
let difSumAC = 0;
let timeFFT = 0;
let timeAC = 0;
let counter = 0;

function currScript() {
    let frequency = sound.getRandomFrequency();
    sound.updateData();
    watch.start();
    let resultFFT = sound.findFrequencyFFT(sound.frequencyArray);
    difSumFFT += Math.abs(resultFFT - frequency);
    timeFFT += watch.stop();

    watch.start();
    let resultAC = sound.findFrequencyAC(sound.timeDomainArray);
    difSumAC += Math.abs(resultAC - frequency);
    timeAC += watch.stop();
}

document.querySelector('#show').addEventListener('click', function () {
    let FFT = 'FFT: ' + difSumFFT/counter + ' ' + timeFFT;
    let AC = 'AC: ' + difSumAC/counter + ' ' + timeAC;
    document.querySelector('body').innerHTML += '<br>' + FFT + '<br>' + AC;
});


document.querySelector('#ok').addEventListener('click', function () {
    currScript();
    counter++;
    document.querySelector('#counter').innerHTML = counter;
    // let frequency = sound.getRandomFrequency();
    // sound.updateData();
    // console.log('testing FFT');
    // watch.start();
    // let resultFFT = sound.findFrequencyFFT(sound.frequencyArray);
    // let differenceFFT = Math.abs(resultFFT - frequency);
    // console.log('found: ' + resultFFT);
    // console.log('difference: ' + differenceFFT);
    // console.log('time: ' + watch.stop());
    // console.log();
    //
    //
    // console.log('testing AUTOCORRELATION');
    // watch.start();
    // let resultAC = sound.findFrequencyAC(sound.timeDomainArray);
    // let differenceAC = Math.abs(resultAC - frequency);
    // console.log('found: ' + resultAC);
    // console.log('difference: ' + differenceAC);
    // console.log('time: ' + watch.stop());
});


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function compare(a, b) {
    return b.sum - a.sum;
}