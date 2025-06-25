const animals = document.querySelectorAll('.animal');
const dropZone = document.getElementById('dropZone');

animals.forEach(animal => {
  let isDragging = false;

  animal.addEventListener('mousedown', e => {
    isDragging = true;

    // Position absolute so it can move
    animal.style.position = 'absolute';
    animal.style.zIndex = 1000;
    document.body.appendChild(animal); // move to body

    moveAt(e.pageX, e.pageY);

    function moveAt(x, y) {
      animal.style.left = x - animal.offsetWidth / 2 + 'px';
      animal.style.top = y - animal.offsetHeight / 2 + 'px';
    }

    function onMouseMove(e) {
      if (isDragging) {
        moveAt(e.pageX, e.pageY);
      }
    }

    document.addEventListener('mousemove', onMouseMove);

    animal.addEventListener('mouseup', function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      animal.removeEventListener('mouseup', onMouseUp);

      // Check if dropped inside the jungle image area
      const jungleRect = dropZone.getBoundingClientRect();
      const animalRect = animal.getBoundingClientRect();

      const isInside =
        animalRect.left < jungleRect.right &&
        animalRect.right > jungleRect.left &&
        animalRect.top < jungleRect.bottom &&
        animalRect.bottom > jungleRect.top;

      if (isInside) {
        const url = animal.dataset.url;
        if (url) {
          window.location.href = url;
        }
      }
    });
  });

  // Prevent default drag behavior
  animal.ondragstart = () => false;
});
