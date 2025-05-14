const socket = io("https://watch-party-server-jiqi.onrender.com"); // <- tu Twój backend

const fileInput = document.getElementById("fileInput");
const video = document.getElementById("videoPlayer");

let isHost = false;

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    video.src = url;
    video.play();
    isHost = true;
  }
});

video.addEventListener("play", () => {
  if (isHost) socket.emit("control", { action: "play", time: video.currentTime });
});
video.addEventListener("pause", () => {
  if (isHost) socket.emit("control", { action: "pause", time: video.currentTime });
});
video.addEventListener("seeked", () => {
  if (isHost) socket.emit("control", { action: "seek", time: video.currentTime });
});

socket.on("control", ({ action, time }) => {
  if (!isHost) {
    switch (action) {
      case "play":
        video.currentTime = time;
        video.play();
        break;
      case "pause":
        video.currentTime = time;
        video.pause();
        break;
      case "seek":
        video.currentTime = time;
        break;
    }
  }
});
