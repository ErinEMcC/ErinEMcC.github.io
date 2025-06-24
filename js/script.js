const video = document.getElementById('myVideo');

video.addEventListener('ended', () => {
  video.pause();
  video.currentTime = video.duration;
});

video.addEventListener('click', () => {
  video.currentTime = 0;
  video.play();
});

const animals = document.querySelectorAll('.animal');
const dropZone = document.getElementById('dropZone');

animals.forEach(animal => {
  animal.addEventListener('dragstart', e => {
    e.dataTransfer.setData("url", animal.dataset.url);
  });
});

dropZone.addEventListener('dragover', e => {
  e.preventDefault(); // Necessary for drop to work
});

dropZone.addEventListener('drop', e => {
  const url = e.dataTransfer.getData("url");
  if (url) {
    window.location.href = url;
  }
});
