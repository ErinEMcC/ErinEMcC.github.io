animals.forEach(animal => {
  let isDragging = false;
  let hasMoved = false;
  let offsetX, offsetY;
  let originalLeft, originalTop;
  const id = animal.dataset.id;

  animal.addEventListener('mousedown', e => {
    isDragging = true;
    hasMoved = false;

    const rect = animal.getBoundingClientRect();
    originalLeft = rect.left + window.scrollX;
    originalTop = rect.top + window.scrollY;

    offsetX = e.pageX - rect.left;
    offsetY = e.pageY - rect.top;

    animal.style.position = 'absolute';
    animal.style.zIndex = 1000;
    document.body.appendChild(animal);

    moveAt(e.pageX, e.pageY);

    function moveAt(x, y) {
      animal.style.left = x - offsetX + 'px';
      animal.style.top = y - offsetY + 'px';
      hasMoved = true;
    }

    function onMouseMove(e) {
      if (isDragging) moveAt(e.pageX, e.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    animal.addEventListener('mouseup', function onMouseUp() {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      animal.removeEventListener('mouseup', onMouseUp);

      const jungleRect = dropZone.getBoundingClientRect();
      const animalRect = animal.getBoundingClientRect();

      const isInside =
        animalRect.left < jungleRect.right &&
        animalRect.right > jungleRect.left &&
        animalRect.top < jungleRect.bottom &&
        animalRect.bottom > jungleRect.top;

      if (isInside) {
        const firstTime = !localStorage.getItem(`placed-${id}`);

        // Store position in localStorage
        localStorage.setItem(`placed-${id}`, JSON.stringify({
          x: animal.offsetLeft,
          y: animal.offsetTop
        }));

        checkProximity(); // Optional

        // Only redirect on first placement
        if (firstTime) {
          const url = animal.dataset.url;
          if (url) window.open(url, '_blank');
        }

      } else {
        // Snap back
        animal.style.transition = 'all 0.3s ease';
        animal.style.left = originalLeft + 'px';
        animal.style.top = originalTop + 'px';
        setTimeout(() => {
          animal.style.transition = '';
        }, 300);
      }
    });
  });

  // Always allow click to open page
  animal.addEventListener('click', () => {
    const url = animal.dataset.url;
    if (url) window.open(url, '_blank');
  });

  animal.ondragstart = () => false;
});
