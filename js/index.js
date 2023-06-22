const clickArea = document.getElementsByClassName('click-area')[0];
const framesclickArea = document.getElementsByClassName('frames-click-area')[0];
const main = document.getElementById('main');

/* set screen size to prevent overflow*/
main.style.maxHeight = screen.height + "px";

const fastMash = [1,4,6,8,11]
let failedAttempt = false;
let frame = 1;
let resetFrameNum = 30;
let frameRate = 30;
let clicks = [];
let intervalID = null;

let audioEnabled = false;
let fastAudio = true; //146 speed audio
let audioCurrentlyPlaying = false;

function updateFrame() {
    //Display the current frame at the top
    setFPSCounter(frame);

    // Check if there are any clicks in the current frame
    let clickIndex = clicks.indexOf(frame);
    
    // If there is a click, display it in the output div
    if (clickIndex !== -1) {
        if(!fastMash.includes(frame) && frame < 11){
            failedAttempt = true;
        }
        showFrameClickedOn(frame);
        // Remove the click from the array
        clicks.splice(clickIndex, 1);
    }
    
    // If there are no more clicks, clear the interval and stop the animation
    if (frame > resetFrameNum) {
        clearInterval(intervalID);
        resetFrame();
    }
    // Increment the frame by one
    frame++;
}
function resetFrame(){
    console.log("Animation stopped")
    intervalID = null;
    clicks=[];
    frame=0;
    failedAttempt = false;
    framesclickArea.innerHTML = "";
    audioCurrentlyPlaying = false;
    setFPSCounter(1);
}
function setFPSCounter(num){
    document.getElementsByClassName('fpscounter')[0].innerHTML =`Frame: ${num}`;
}
function showFrameClickedOn(frame){
    //make a div in frame-click-area with the number of the frame
    let div = document.createElement('div');
    div.innerHTML = frame;
    let classListFrame = ["frameText","border","border-secondary","rounded","m-2"];
    div.classList.add(...classListFrame);
    div.style = "--bs-border-opacity: .5;"
    if (fastMash.includes(frame) && !failedAttempt){
        div.classList.add('text-success');
    }
    else if (frame> 11){
        div.classList.add('text-info');
    }
    else{
        div.classList.add('text-danger');
    }
    framesclickArea.appendChild(div);
}

function bljClick() {
    //Play the blj audio
    if(!audioCurrentlyPlaying){
        playAudio();
    }
    // Push the current frame to the clicks array
    clicks.push(frame);

    // If the interval is not set, start it and set the frame rate to 30 fps
    if (intervalID === null) {
        intervalID = setInterval(updateFrame, 1000 / frameRate);
    }

}
function changeSettings(){
    resetFrameNum = document.getElementById('resetSetting').value;
    frameRate = document.getElementById('fpsSetting').value;
    audioCheckbox = document.getElementById('audioSetting')
    setAudio();
    console.log(`new frameRate is ${frameRate} and resetFrameNum is ${resetFrameNum}`)
}
function setAudio(){
    audioFramerate = document.getElementById('audioSetting')
    audioFramerateLabel = document.getElementById('audioSettingLabel')
    audio146= document.getElementById('frame146')
    audio148= document.getElementById('frame148')
    console.log(audioFramerate.checked)
    if (audioFramerate.checked){
        audioEnabled = true;
        audioFramerateLabel.classList.remove('btn-outline-danger');
        audioFramerateLabel.classList.add('btn-outline-success');
        audioFramerateLabel.innerHTML = "Audio On"
    }
    else{
        audioEnabled = false;
        audioFramerateLabel.classList.remove('btn-outline-success');
        audioFramerateLabel.classList.add('btn-outline-danger');
        audioFramerateLabel.innerHTML = "Audio Off"
    }
    if (audio146.checked){
        fastAudio = true;
    }
    else{
        fastAudio = false;
    }

}
function playAudio(){
    audioCurrentlyPlaying = true;
    let audio;
    if (!audioEnabled){
        console.log("audio is disabled")
        return;
    }
    if(fastAudio){
        audio = new Audio('assets/146speed.wav');
    }
    else{
        audio = new Audio('assets/148speed.wav');
    }
    audio.play();
}
clickArea.addEventListener('click', bljClick,false);