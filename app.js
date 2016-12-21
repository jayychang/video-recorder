// Video Recording

var recorder;
var chunks;
var videoFlag = 0;

function videoToggle() {
    let button = document.getElementById("videoButton");
    switch (videoFlag) {
      case 1:
        videoFlag = 2;
        button.innerHTML = "Stop Recording";
        startRecording();
        break;
      case 2:
        videoFlag = 3;
        button.innerHTML = "Redo Recording";
        finishRecording();
        break;
      case 3:
        videoFlag = 1;
        button.innerHTML = "Start Recording";
        redoRecording();
        break;
      case 4:
        break;
      default:
        videoFlag = 1;
        button.innerHTML = "Start Recording";
        requestVideo();
    }
}

function requestVideo() {
  // BELOW IS TEMP FIX
    navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.oGetUserMedia;
    if(!navigator.getUserMedia) {
      alert("Please use Chrome or Firefox");
      document.getElementById("videoButton").innerHTML = "Not supported";
      videoFlag = 4;
      return;
    }
    let input = document.getElementById("videoStream");
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stm => {
        stream = stm;
        input.src = URL.createObjectURL(stream);
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = e => {
            chunks.push(e.data);
            if (recorder.state == "inactive") makeVideo();
        }
    }).catch(e => console.error(e));
    $("#videoPlaceholder").addClass("hidden");
    $("#videoStream").removeClass("hidden");
    input.play();
}

function makeVideo() {
    let output = document.getElementById("videoTaken");
    let blob = new Blob(chunks, {type: "video/webm"});
    let url = URL.createObjectURL(blob);
    output.controls = true;
    output.src = url;
}

function startRecording() {
    chunks = [];
    recorder.start();
}

function finishRecording() {
    recorder.stop();
    $("#videoStream").addClass("hidden");
    $("#videoTaken").removeClass("hidden");
}

function redoRecording() {
    $("#videoStream").removeClass("hidden");
    $("#videoTaken").addClass("hidden");
    $("#videoTaken").attr("src","");
}
