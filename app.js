var cameraStarted = false;
var recording = false;
var recorder;
var chunks;

function cameraToggle() {
    if (!cameraStarted) {
        startCamera();
        return;
    }
    var v = document.getElementById('videoStream');
    var button = document.getElementById('cameraButton');
    if (v.paused || v.ended) {
        button.innerHTML = "Pause Stream";
        v.play();
    } else {
        button.innerHTML = "Resume Stream";
        v.pause();
    }
}

function recordVideo() {
    var button = document.getElementById("recordButton")
    if (recorder == null) return;
    if (recording) {
        button.innerHTML = "Start Recording"
        recorder.stop();
        createVideo();
        recording = !recording;
    } else {
        button.innerHTML = "Stop Recording"
        chunks = [];
        recorder.start();
        recording = !recording;
    }
}

function createVideo() {
    let blob = new Blob(chunks, {type: 'video/webm' })
    let url = URL.createObjectURL(blob)
    var recordedVideo = document.getElementById("recordedVideo");
    recordedVideo.controls = true;
    recordedVideo.src = url;
}
// camera setup
function startCamera() {
    // check for getUserMedia support
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia ||
        navigator.oGetUserMedia;
    if (navigator.getUserMedia) {
        // get webcam feed if available
        navigator.getUserMedia({video: true, audio: true}, handleVideo, videoError);
    }
}

function handleVideo(stream) {
    // if found attach feed to video element
    var video = document.querySelector("#videoStream");
    if (video != null) {
        video.src = window.URL.createObjectURL(stream);
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = function(e) {
            chunks.push(e.data);
        }
    } else {
        videoError("The camera is currently in use by another application or tab.")
    }
    cameraStarted = true;
    cameraToggle();
}

function videoError(e) {
    window.alert("Something went wrong:  \n\n" + e);
}
