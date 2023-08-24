// Classifier Variable
let classifier;
// Model URL
let imageModelURL = "https://teachablemachine.withgoogle.com/models/pJVCDtMZQ/";

let upper_threshhold = 0.7;
let lower_threshhold = 0.05;
let confidenceArray = {};

let imageIndex = 0;

let progress = 0;
let isPaused = true;
let framesPerChar = 10;
// Video
let video;
let tutorial_counter = 1;
let flippedVideo;
// To store the classification
let label = "";
// This only works because the two models share a letter. If this changes,
// then each time a model is chosen there must be a new top letter chosen
// from their set of letters
let top_character = 'd';

let predictions;
// // set's of letters for each model
let blueLetters = ['a', 'b', 'c', 'd', 'l', '-'];
let blueConfidence = {
    'a': [],
    'b': [],
    'c': [],
    'd': [],
    'l': [],
    '-': []
};

let redLetters = ['d', 'e', 'f', 'g', 'i', '-'];
let redConfidence = {
    'd': [],
    'e': [],
    'f': [],
    'g': [],
    'i': [],
    '-': []
};

//images for tutorial
const imgA = new Image();
imgA.src = "./images/imgA.png";
imgA.id = "imgA";
const imgB = new Image();
imgB.src = "./images/imgB.png";
imgB.id = "imgB";
const imgC = new Image();
imgC.src = "./images/imgC.png";
imgC.id = "imgC";
const imgD = new Image();
imgD.src = "./images/imgD.png";
imgD.id = "imgD";
const imgL = new Image();
imgL.src = "./images/imgL.png";
imgL.id = "imgL";
const imgE = new Image();
imgE.src = "./images/imgE.png";
imgE.id = "imgE";
const imgF = new Image();
imgF.src = "./images/imgF.png";
imgF.id = "imgF";
const imgG = new Image();
imgG.src = "./images/imgG.png";
imgG.id = "imgG";
const imgI = new Image();
imgI.src = "./images/imgI.png";
imgI.id = "imgI";


let imageLetters = [imgA.src, imgB.src, imgC.src, imgD.src, imgL.src];

//images for last page of tutorial
const img0 = new Image();
img0.src = "./images/img0.png";
img0.id = "img0";
const img1 = new Image();
img1.src = "./images/img1.png";
img1.id = "img1";
const img2 = new Image();
img2.src = "./images/img2.png";
img2.id = "img2";
const img3 = new Image();
img3.src = "./images/img3.png";
img3.id = "img3";
const img4 = new Image();
img4.src = "./images/img4.png";
img4.id = "img4";
const img5 = new Image();
img5.src = "./images/img5.png";
img5.id = "img5";

let imageTutorial = [img0.src, img1.src, img2.src, img3.src, img4.src, img5.src];


let letters;
// this tracks where we are in the letters so the prompts cover them all
// James and Andrew's OG blue model: https://teachablemachine.withgoogle.com/models/0_xhWMn4A/
// James and Andrew's OG red model: https://teachablemachine.withgoogle.com/models/oalxd3LWt/
let promptIndex = 0;
let model;
let blueClassifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/AINQAXtTs/' + 'model.json');
let redClassifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/7CoeRTZh8/' + 'model.json');
const average = array => array.reduce((a, b) => a + b) / array.length;

// Load the model first
function preload() {
    document.getElementById("modelSelect").value = "blue";
    getModel();

}

// Will need to update with the new model links -> Currently all using the same model
function getModel() {
    model = document.getElementById("modelSelect").value;
    if (model == "blue") {
        // blue
        classifier = blueClassifier;
        letters = blueLetters;
        confidenceArray = blueConfidence;
    } else {
        // red
        classifier = redClassifier;
        letters = redLetters;
        confidenceArray = redConfidence;
    }

    for (i in confidenceArray) {
        confidenceArray[i] = [];
    }

    predictions = null;
    // reset any predictions
}

function pause_play() {
    textSize(120);
    text("Video Paused", width * 0.20, height * 0.35);
    noLoop();
    isPaused = !isPaused;
    if (!isPaused) {
        // pauseBtn.html("Pause");
        loop();
    } else {
        // pauseBtn.html("Play");
        noLoop();
    }
}

// used to control the movement from different tutorial phases
function tutorialNext() {
    console.log(tutorial_counter);
    switch (tutorial_counter) {
        case 1:
            //Model Input + Video Screen
            document.getElementById("tutorialPrompt1").style.visibility = "hidden";
            document.getElementById("tutorialPrompt2").style.visibility = "visible";
            document.getElementById("videoHighlight").style.visibility = "visible";
            tutorial_counter += 1;
            break;
        case 2:
            //Model output + output screen
            document.getElementById("tutorialPrompt2").style.visibility = "hidden";
            document.getElementById("videoHighlight").style.visibility = "hidden";
            document.getElementById("tutorialPrompt3").style.visibility = "visible";
            document.getElementById("statsHighlight").style.visibility = "visible";
            tutorial_counter += 1;
            break;
        case 3:
            //"First you'll practice blue mode's letters"
            document.getElementById("tutorialPrompt4").style.visibility = "visible";
            document.getElementById("tutorialPrompt3").style.visibility = "hidden";
            document.getElementById("statsHighlight").style.visibility = "hidden";
            tutorial_counter += 1;
            break;
        case 4:
            //blue mode game
            document.getElementById("tutorialPrompt4").style.visibility = "hidden";
            document.getElementById("overlay").style.visibility = "hidden";
            document.getElementById("imageDemo").style.visibility = "visible";
            document.getElementById("ModeSign").style.visibility = "visible";
            // console.log("DEBUGGING: SET IS PAUSED TO FALSE HERE WHEN DONE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
            isPaused = false;
            tutorial_counter += 1;
            break;

        case 5:
            // user has signed all the blue letters and "lets try letters from a different mode"
            isPaused = true;
            document.getElementById("ModeSign").style.visibility = "hidden";
            document.getElementById("imageDemo").style.visibility = "hidden";
            document.getElementById("overlay").style.visibility = "visible";
            document.getElementById("overlay").style.opacity = "85%";
            // make the background mostly opaque
            document.getElementById("modelSelectContainer").style.zIndex = "1";
            document.getElementById("modelSelectContainer").style.opacity = "0%";
            document.getElementById("promptContainer").style.zIndex = "1";
            document.getElementById("modelSelect").style.zIndex = "1";
            document.getElementById("letterPrompt").innerHTML = "Let's try letters from another model!";
            document.getElementById("letterPromptCaption").innerHTML = "Click the button";
            document.getElementById("goToRedModel").style.visibility = "visible";
            document.getElementById("modelSelect").disabled = true;
            document.getElementById("modelSelect").style.opacity = "1";
            tutorial_counter += 1;
            // tutorial counter will increase when they click the red model
            break;
        case 6:
            //Introduces red mode letters
            document.getElementById("modelSelectContainer").style.zIndex = "0";
            document.getElementById("tutorialPrompt5").style.visibility = "visible";
            document.getElementById("goToRedModel").style.visibility = "hidden";
            document.getElementById("overlay").style.opacity = "100%";
            document.getElementById("promptContainer").style.visibility = "hidden";
            tutorial_counter += 1;
            break;
        case 7:
            //red mode game
            imageLetters = [imgD.src, imgE.src, imgF.src, imgG.src, imgI.src];
            document.getElementById("signImage").src = imageLetters[0];
            document.getElementById("modeSignText").textContent = "Red Mode";
            document.getElementById("modeSignText").classList.add("text-red-600");
            document.getElementById("tutorialPrompt1").style.visibility = "hidden";
            document.getElementById("imageDemo").style.visibility = "visible";
            document.getElementById("ModeSign").style.visibility = "visible";
            document.getElementById("overlay").style.visibility = "hidden";
            document.getElementById("tutorialPrompt5").style.visibility = "hidden";
            document.getElementById("promptContainer").style.visibility = "visible";
            document.getElementById("letterPromptCaption").innerHTML = "Hint: Try moving your hand around the screen";
            for (i in confidenceArray) {
                confidenceArray[i] = [];
            }
            top_character = 'd';
            predictions = null;
            isPaused = false;
            tutorial_counter += 1;
            break;
        case 8:
            //done with red mode page
            document.getElementById("goToTutorial").style.visibility = "visible";
            document.getElementById("letterPrompt").innerHTML = "You finished!";
            document.getElementById("letterPromptCaption").innerHTML = "When you're ready, take a look at a guide to the different parts of this application.";
            document.getElementById("imageDemo").style.visibility = "hidden";
            document.getElementById("ModeSign").style.visibility = "hidden";
            isPaused = true;
            tutorial_counter += 1;
            break;
        case 9:
            //tutorial of application
            document.getElementById("overlay").style.visibility = "visible";
            document.getElementById("goToTutorial").style.visibility = "hidden";
            document.getElementById("promptContainer").style.visibility = "hidden";
            document.getElementById("tutorialPrompt6").style.visibility = "visible";
            document.getElementById("tutorialDescription").style.visibility = "hidden";
            document.getElementById("blueModeDescription").style.visibility = "hidden";
            document.getElementById("redModeDescription").style.visibility = "hidden";
            document.getElementById("speedModeDescription").style.visibility = "hidden";
            document.getElementById("playThroughDescription").style.visibility = "hidden";
            document.getElementById("initialImage").style.visibility = "visible";
            document.getElementById("tutorialButton").style.visibility = "visible";
            imageIndex++;
            tutorial_counter += 1;
            break;
        case 10:
            //tutorial
            document.getElementById("tutorialDescription").style.visibility = "visible";
            document.getElementById("initialImage").src = imageTutorial[imageIndex];
            imageIndex++;
            tutorial_counter += 1;
            break;
        case 11:
            // blue mode
            document.getElementById("tutorialDescription").style.visibility = "hidden";
            document.getElementById("blueModeDescription").style.visibility = "visible";
            document.getElementById("initialImage").src = imageTutorial[imageIndex];
            imageIndex++;
            tutorial_counter += 1;
            break;
        case 12:
            // red mode
            document.getElementById("blueModeDescription").style.visibility = "hidden";
            document.getElementById("redModeDescription").style.visibility = "visible";
            document.getElementById("initialImage").src = imageTutorial[imageIndex];
            imageIndex++;
            tutorial_counter += 1;
            break;
        case 13:
            // speed mode
            document.getElementById("redModeDescription").style.visibility = "hidden";
            document.getElementById("speedModeDescription").style.visibility = "visible";
            document.getElementById("initialImage").src = imageTutorial[imageIndex];
            imageIndex++;
            tutorial_counter += 1;
            break;
        case 14:
            // play through
            document.getElementById("speedModeDescription").style.visibility = "hidden";
            document.getElementById("playThroughDescription").style.visibility = "visible";
            document.getElementById("initialImage").src = imageTutorial[imageIndex];
            // imageIndex++;
            tutorial_counter += 1;
            break;
        case 15:
            // last page, go to main menu
            document.getElementById("playThroughDescription").style.visibility = "hidden";
            document.getElementById("initialImage").style.visibility = "hidden";
            document.getElementById("tutorialPrompt6").style.visibility = "hidden";
            document.getElementById("tutorialPrompt7").style.visibility = "visible";
            document.getElementById("tutorialButton").style.visibility = "hidden";
            document.getElementById("lastButton").style.visibility = "visible";
            break;

    }
}

function setup() {

    createCanvas(windowWidth, windowHeight / 2);
    background('rgb(255, 235, 145)')
    koalafont = loadFont("fonts/playfulKoala.otf");
    textFont(koalafont);

    // Create the video
    video = createCapture(VIDEO);

    // draw a white rectangle where the video will be
    rect(0, 0, windowWidth / 2, windowHeight / 2);

    // set video settings so image is flipped
    video.size(windowWidth / 2, windowHeight / 2);
    video.hide();
    flippedVideo = ml5.flipImage(video);

    // Change the frame rate as necessary depending on computer preformance
    frameRate(60);
    rectMode(CORNERS);
}

function draw() {
    if (isPaused) {
        return;
    }

    console.log("drawing");
    // draw the background
    background('rgb(255, 235, 145)');

    classifyVideo();

    // Draw the video
    image(flippedVideo, 0, 0);

    // draw the live statistics
    statistics();
}

// Get a prediction for the current video frame
function classifyVideo() {
    flippedVideo = ml5.flipImage(video);
    // classify is causing the program to pause for a couple seconds
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence
    predictions = results;
}

function tutorial() {
    console.log("Ran the tutorial.");
}

function statistics() {
    // if the model has not made a prediction, exit the function
    if (!predictions) {
        return;
    }

    // draw a box to hold the predictions
    textAlign(CENTER);
    let top_character_size = 160;
    textSize(top_character_size);

    // only draw the character if the bg is not detected
    if (top_character != '-') {
        text(top_character, width * 0.75, height * 0.33 + (top_character_size * 0.25));
        strokeWeight(12);
        stroke(0, 0, 0);
        if (progress) {
            noFill();
            stroke(lerpColor(color(255, 0, 0), color(0, 255, 0), (progress / 100.0)));
            arc(width * 0.75, height * 0.33, top_character_size * 1.5, top_character_size * 1.5, 0, 2 * PI * (progress / 100.0))
        }
        strokeWeight(1);
        stroke(0, 0, 0);
    }

    for (let i = 0; i < letters.length; i++) {
        // draw the bar and letter if not background
        let entry = predictions.find(element => element.label === letters[i]);

        // set some vars for easy use later
        maxBarHeight = 100;
        barWidth = 45;
        barGap = 50;
        startingX = windowWidth * 0.625 + ((barGap + barWidth) * i);
        startingY = windowHeight * 0.45;

        if (entry.label != '-') {
            // Interpolate from red to green using confidence
            fill(lerpColor(color(255, 0, 0), color(0, 255, 0), entry.confidence));
            // Draw the rectangle
            rect(startingX,
                startingY - (entry.confidence * maxBarHeight),
                startingX + barWidth,
                startingY,
                5, 5, 5, 5
            )
            // Write the labels under their respective bars
            fill(0, 0, 0);
            textSize(30);
            textAlign(CENTER);
            text(entry.label, startingX + barWidth / 2, startingY + 30);
        }

        // keep track of the past framesPerChar confidences
        confidenceArray[letters[i]].push(entry.confidence)
        if (confidenceArray[letters[i]].length > framesPerChar) {
            confidenceArray[letters[i]].shift()
        }
    }
    // progress does not update for background, should always be zero
    if (top_character != '-') {
        // is the top character average above or below the threshold?
        let top_avg = average(confidenceArray[top_character]);
        if (top_avg > upper_threshhold) {
            // model is confident for the top letter, increase progress
            progress += 2;
        } else if (top_avg < lower_threshhold) {
            // model is very unsure, lets decrease progress by 2
            progress -= 2;
        } else {
            // model has mid range confidence, decrease progress by 1
            progress -= 1;
        }
    }

    // has the progress reaches 100 (done) or 0 (choose a new letter)
    if (progress >= 100 && tutorial_counter < 10) {
        confirmLetter();
    } else if (progress <= 0) {
        // if it is negative, set it to zero
        progress = 0;
        let highest_avg = 0;
        // find char with highest avg ( excluding the background )
        for (letter in confidenceArray) {
            // && letter != '-'
            if (average(confidenceArray[letter]) > highest_avg) {
                highest_avg = average(confidenceArray[letter]);
                top_character = letter;
            }
        }
    }
}

function switchModel() {
    // function activates when the user selects a model

    // Am I waiting for them to click red?
    if (tutorial_counter == 7) {
        // indicate that the user can proceed
        // disable the button so they can't change it during this phase
        document.getElementById("letterPrompt").innerHTML = `Can you sign a <strong>'d'</strong>?<br>`
        // unpause the game
        isPaused = false;
        // update the classifier
        document.getElementById("modelSelect").value = "red";
        getModel();
        tutorialNext();
    }
}
function confirmLetter() {
    // confirm the letter
    if (top_character === letters[promptIndex]) {
        // show the correct icon

        promptIndex += 1;
        // -1 since the last character is the background
        // entry needs to be there since it's classifiable and it used in the
        // statistics function
        if (promptIndex >= letters.length - 1) {
            tutorialNext();
            // no more prompts to give
            if (tutorial_counter > 10) {
                promptIndex = -1;
            } else {
                promptIndex = 0;
            }
        } else {
            document.getElementById("letterPrompt").innerHTML = `Can you sign a <strong>'${letters[promptIndex]}'</strong>?<br>`
            document.getElementById("signImage").src = imageLetters[promptIndex];
        }
    }
    progress = 0;
}
