// using offsets to find frequencies
const OFFSETS = [139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690];

/*
 * Class View
 * - for rendering all information.
 * - params:
 *      - canvasObj: html canvas
 *      - sound: class Sound
 */
class View {
    constructor(canvasObj, sound) {
        this.height = 0;
        this.width = 0;
        this.ctx = canvasObj.getContext('2d');
        this.sound = sound;
        this.toneDiv = document.querySelector('.tone');
        this.differenceDiv = document.querySelector('.difference');
        this.colors = ['red', 'darkorange', 'orange', 'yellow', '#05FF02'];
        this.init();
    }

    /* Sets all the parameters of canvas */
    init() {
        this.height = 500;
        this.width = window.innerWidth;
        this.ctx.canvas.height = this.height;
        this.ctx.canvas.width = this.width;
        this.drawSkeleton();
    }

    /* Draw the base skeleton of scale which is not going to be removed */
    drawSkeleton() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawScale();
    }

    /* Clears canvas */
    clear() {
        this.ctx.clearRect(0, 3 * this.height / 10, this.width, 8.5 * this.height / 10 - 3 * this.height / 10);
    }

    /* Renders new data
    * - params:
    *       - difference: the difference of found frequency from the correct frequency of certain string
    *       - tone: tone of the tuned string
    * */
    draw(difference, tone) {
        this.clear();
        this.drawMiddleLine();
        this.writeInfo(difference, tone);
        this.drawTuning(difference);
    }

    drawDownScale() {
        this.drawLine(5 * this.width / 100, 9 * this.height / 10, 95 * this.width / 100, 9 * this.height / 10, 'black', 1);
        for (let i = 5; i <= 95; i += 5) {
            if (i % 2 === 0) {
                this.drawLine(i * this.width / 100, 8.5 * this.height / 10, i * this.width / 100, 9 * this.height / 10, 'black', 5);
            } else {
                this.drawLine(i * this.width / 100, 8.5 * this.height / 10, i * this.width / 100, 9 * this.height / 10, 'black', 2);
            }
        }
    }

    drawUpScale() {
        this.drawLine(5 * this.width / 100, 3 * this.height / 10, 95 * this.width / 100, 3 * this.height / 10, 'black', 5);
        for (let i = 5; i <= 95; i += 5) {
            if (i % 2 === 0) {
                this.drawLine(i * this.width / 100, 2.5 * this.height / 10, i * this.width / 100, 3 * this.height / 10, 'black', 5);
            } else {
                this.drawLine(i * this.width / 100, 2.5 * this.height / 10, i * this.width / 100, 3 * this.height / 10, 'black', 2);
            }
        }
    }

    /* Render all parts of scale */
    drawScale() {
        this.drawUpScale();
        this.drawDownScale();
        this.drawNumbers();
        this.drawMiddleLine();
    }

    /* Writes info to certain blocks
    * - params:
    *       - difference: the difference of found frequency from the correct frequency of certain string
    *       - tone: tone of the tuned string
    * */
    writeInfo(difference, tone) {
        this.toneDiv.innerHTML = tone;
        this.differenceDiv.innerHTML = difference;
    }

    /* Renders the line representing the difference of frequency in certain colour */
    drawTuning(difference) {
        switch (true) {
            case Math.abs(difference) > 5:
                this.drawLine(((50 + difference * 2) * this.width / 100), 3 * this.height / 10, ((50 + difference * 2) * this.width / 100), 8.5 * this.height / 10, this.colors[0], 10);
                break;
            case Math.abs(difference) === 4:
                this.drawLine(((50 + difference * 2) * this.width / 100), 3 * this.height / 10, ((50 + difference * 2) * this.width / 100), 8.5 * this.height / 10, this.colors[1], 10);
                break;
            case Math.abs(difference) === 3:
                this.drawLine(((50 + difference * 2) * this.width / 100), 3 * this.height / 10, ((50 + difference * 2) * this.width / 100), 8.5 * this.height / 10, this.colors[2], 10);
                break;
            case Math.abs(difference) === 2:
                this.drawLine(((50 + difference * 2) * this.width / 100), 3 * this.height / 10, ((50 + difference * 2) * this.width / 100), 8.5 * this.height / 10, this.colors[3], 10);
                break;
            case Math.abs(difference) === 1 || Math.abs(difference) === 0:
                this.drawLine(((50 + difference * 2) * this.width / 100), 3 * this.height / 10, ((50 + difference * 2) * this.width / 100), 8.5 * this.height / 10, this.colors[4], 10);
                break;
            default:
                this.drawLine(((50 + difference * 2) * this.width / 100), 3 * this.height / 10, ((50 + difference * 2) * this.width / 100), 8.5 * this.height / 10, 'black', 10);
        }
    }

    /* Renders middle line of scale */
    drawMiddleLine() {
        this.drawLine(this.width / 2, 3 * this.height / 10, this.width / 2, 8.5 * this.height / 10, 'black', 2);
    }

    /* Draw numbers of scale */
    drawNumbers() {
        this.ctx.font = '60px Aharoni';
        this.ctx.textAlign = 'center';
        let number = -20;
        for (let i = 10; i <= 90; i += 10) {
            this.ctx.lineWidth = 3;
            this.ctx.fillText(number, i * this.width / 100, 2 * this.height / 10);
            number += 5;
        }
    }

    /* Auxilary method for rendering lines */
    drawLine(startX, startY, endX, endY, strokeStyle, lineWidth) {
        if (strokeStyle != null) this.ctx.strokeStyle = strokeStyle;
        if (lineWidth != null) this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.closePath();
    };
}

/*
 * Class Sound
 * - input of application, loads data and analyse them
 * - params:
 *      - info: class Info
 */
class Sound {
    constructor(info) {
        this.timeDomainArray = null;
        this.frequencyArray = null;
        this.context = new (window.AudioContext)();
        this.SR = this.context.sampleRate;
        this.binSize = null;
        this.analyserNode = this.context.createAnalyser();
        this.sourceNode = null;
        this.info = info;
        this.allSums = null;
        this.lastFound = null;
        this.setUp();
    }

    /* Sets all the parameters of analyserNode  */
    setUp() {
        this.analyserNode.fftSize = 8192;
        this.timeDomainArray = new Float32Array(this.analyserNode.frequencyBinCount);
        this.frequencyArray = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.allSums = OFFSETS.map(o => {
            return {'offset': o, 'sum': 0};
        });
        this.binSize = this.SR / this.analyserNode.fftSize;

        this.connectToMic();
    }

    /* Connects user's mic to analyserNode */
    connectToMic() {
        if (this.hasGetUserMedia()) {
            const constraints = {
                audio: true,
            };

            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                this.sourceNode = this.context.createMediaStreamSource(stream);
                this.sourceNode.connect(this.analyserNode);
            });
        } else {
            alert('getUserMedia() is not supported by your browser');
        }
    }

    /* Checks whether user's browser can use getUserMedia */
    hasGetUserMedia() {
        return Boolean(navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia);
    }

    /* Updates sound data in arrays */
    updateData() {
        this.analyserNode.getFloatTimeDomainData(this.timeDomainArray);
        this.analyserNode.getByteFrequencyData(this.frequencyArray);
        let info = document.querySelector('#info');
        let found = this.findFrequency(this.timeDomainArray);
        if (found === undefined) {
            this.notifyInfo(this.lastFound);
        } else {
            this.notifyInfo(found);
        }
    }

    /* Actual method for finding dominant frequency */
    findFrequency(data) {
        let halfDataLength = Math.floor(data.length * 0.5);
        let sum = 0;

        for (let o = 0; o < this.allSums.length; o++) {
            sum = 0;
            for (let i = 0; i < halfDataLength; i++) {
                sum += data[i] * data [i + this.allSums[o].offset]; //sum of multiplication
            }
            this.allSums[o].sum = sum;
        }
        this.allSums.sort(compare); //sort, greater sum is better

        if (!this.isSoundGood()) {
            return;
        }

        let found = this.SR / this.allSums[0].offset;
        this.lastFound = found;
        return found;
    }

    /* Checks the quality of sound data */
    isSoundGood() {
        return this.allSums[0].sum > 10; // the constant could be bigger, but we need some data to work with
    }

    /* Sends data to class Info */
    notifyInfo(foundFrequency) {
        this.info.foundFrequency = foundFrequency;
        this.info.count();
    }

    /* Chooses possible candidates for fundamental frequency
     * THIS METHOD IS NOT USED IN FINAL PRODUCT - it is still here for next development
     */
    chooseCandidate() {
        return this.allSums.slice(0, 10);
    }

    /* Filters fake frequencies
     * THIS METHOD IS NOT USED IN FINAL PRODUCT - it is still here for next development
     */
    filter(array) {
        let max = this.getIndexOfMaximum();
        let firstBorder = max * this.binSize;
        let secondBorder = (max + 1) * this.binSize;
        let found = null;

        for (let i = 0; i < array.length; i++) {
            found = this.SR / array[i].offset;
            if (isInRange(found, firstBorder, secondBorder, false)) {
                this.lastFound = found;
                return found;
            }
        }
    }

    /* Method to find maximum in FFT array
     * THIS METHOD IS NOT USED IN FINAL PRODUCT - it is still here for next development
     */
    getIndexOfMaximum() {
        let data = this.frequencyArray;
        let max = data[0];

        /* 365 Hz = 330 Hz + space for mistakes. 331 Hz is frequency ofE4 */
        let maxIndex = Math.floor(365 / this.binSize);
        /* Index of max value */
        let indexOfMax = 0;
        /* There is no reason to go through the whole array, bin numbermaxIndex corresponds to frequency 365 Hz, enough space for mistakes */
        for (let i = 1; i < maxIndex; i++) {
            if (data[i] > max) {
                max = data[i];
                indexOfMax = i;
            }
        }
        return indexOfMax;
    };
}

/*
 * Class Sound
 * - change analysed data to readable form
 */
class Info {
    constructor() {
        this.view = null;
        this.foundFrequency = null;
        this.correctFrequency = null;
        this.difference = null;
        this.tone = null;
        this.guitarFrequencies = [
            {
                'string': 'E4',
                'frequency': 329.63,
                'plainFrequency': 330
            },
            {
                'string': 'H',
                'frequency': 246.94,
                'plainFrequency': 247
            },
            {
                'string': 'G',
                'frequency': 196.00,
                'plainFrequency': 196
            },
            {
                'string': 'D',
                'frequency': 146.83,
                'plainFrequency': 147
            },
            {
                'string': 'A',
                'frequency': 110.00,
                'plainFrequency': 110
            },
            {
                'string': 'E2',
                'frequency': 82.41,
                'plainFrequency': 82
            },
        ];
    }

    /* Detecs which string is most likely to be tuned */
    whatString(frequency) {
        switch (true) {
            case (isInRange(frequency, 70, 95, true)):
                return 'E2';
            case (isInRange(frequency, 95, 128, true)):
                return 'A';
            case (isInRange(frequency, 128, 157, true)):
                return 'D';
            case (isInRange(frequency, 157, 215, true)):
                return 'G';
            case (isInRange(frequency, 215, 290, true)):
                return 'H';
            case (isInRange(frequency, 290, 360, true)):
                return 'E4';
            default:
                return 'none';
        }
    }

    /* Fills other important variables */
    count() {
        switch (this.whatString(this.foundFrequency)) {
            case ('E2'):
                this.correctFrequency = this.guitarFrequencies[5].plainFrequency;
                this.tone = this.guitarFrequencies[5].string;
                break;
            case ('A'):
                this.correctFrequency = this.guitarFrequencies[4].plainFrequency;
                this.tone = this.guitarFrequencies[4].string;
                break;
            case ('D'):
                this.correctFrequency = this.guitarFrequencies[3].plainFrequency;
                this.tone = this.guitarFrequencies[3].string;
                break;
            case ('G'):
                this.correctFrequency = this.guitarFrequencies[2].plainFrequency;
                this.tone = this.guitarFrequencies[2].string;
                break;
            case ('H'):
                this.correctFrequency = this.guitarFrequencies[1].plainFrequency;
                this.tone = this.guitarFrequencies[1].string;
                break;
            case ('E4'):
                this.correctFrequency = this.guitarFrequencies[0].plainFrequency;
                this.tone = this.guitarFrequencies[0].string;
                break;
            default:
                this.correctFrequency = undefined;
                break;
        }
        this.notifyView();
    }

    /* Sends data to class View */
    notifyView() {
        this.difference = Math.round(this.foundFrequency) - this.correctFrequency;
        this.view.draw(this.difference, this.tone);
    }
}

/* Animation cycle */
function countAndDraw() {
    sound.updateData();
    setTimeout(countAndDraw, 100);
}

function compare(a, b) {
    return b.sum - a.sum;
}

function isInRange(value, start, end, noBorders) {
    if (noBorders) {
        return ((value - start) * (value - end) < 0);
    } else {
        return ((value - start) * (value - end) <= 0);
    }
}

let soundElem = document.querySelector('audio');
let canvas = document.querySelector('#appCanvas');
let info = new Info();
let sound = new Sound(info, soundElem);
let view = new View(canvas, sound);

info.view = view;
countAndDraw();

