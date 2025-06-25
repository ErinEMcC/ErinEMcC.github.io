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

    // Always set position absolutely based on mouse location
    animal.style.position = 'absolute';
    animal.style.left = animal.offsetLeft + 'px';
    animal.style.top = animal.offsetTop + 'px';
    animal.style.zIndex = 50;
    document.body.appendChild(animal); // ensure it's not stuck inside its old container

    // Store position in localStorage
    localStorage.setItem(`placed-${id}`, JSON.stringify({
      x: animal.offsetLeft,
      y: animal.offsetTop
    }));

    checkProximity(); // Optional

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
