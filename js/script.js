const animals = document.querySelectorAll('.animal');
const dropZone = document.getElementById('dropZone');

// Restore already-placed animals
window.addEventListener('DOMContentLoaded', () => {
  animals.forEach(animal => {
    const id = animal.dataset.id;
    const stored = localStorage.getItem(`placed-${id}`);
    if (stored) {
      const { x, y } = JSON.parse(stored);
      animal.style.position = 'absolute';
      animal.style.left = x + 'px';
      animal.style.top = y + 'px';
      animal.style.zIndex = 50;
      document.body.appendChild(animal);
    }
  });
});

animals.forEach(animal => {
  let isDragging = false;
  let offsetX, offsetY;
  let originalLeft, originalTop;
  const id = animal.dataset.id;

  animal.addEventListener('mousedown', e => {
    isDragging = true;

    // Save original position to snap back later
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
        const url = animal.dataset.url;

        // Store animal position before redirect
        localStorage.setItem(`placed-${id}`, JSON.stringify({
          x: animal.offsetLeft,
          y: animal.offsetTop
        }));

        if (url) {
          window.location.href = url;
        }
      } else {
        // Snap back
        animal.style.transition = 'all 0.3s ease';
        animal.style.left = originalLeft + 'px';
        animal.style.top = originalTop + 'px';

        // Optional: remove transition after snap
        setTimeout(() => {
          animal.style.transition = '';
        }, 300);
      }
    });
  });

  // Prevent default drag behavior
  animal.ondragstart = () => false;
});
