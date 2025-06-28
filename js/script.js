const animals = document.querySelectorAll('.animal');
const butterflyAnimal = document.getElementById('butterflyAnimal');
const dropZone = document.getElementById('dropZone');
const resetButton = document.getElementById('resetJungle');

// check if all other animals are placed
function checkAllAnimalsPlaced() {
  let allPlaced = true;

  // exclude the butterfly from this check
  animals.forEach(animal => {
    if (animal.id !== 'butterflyAnimal') {
      if (!dropZone.contains(animal)) {
        allPlaced = false;
      }
    }
  });

  if (allPlaced) {
    butterflyAnimal.style.display = 'inline'; // reveal in the animal bar
  }
}

// Restore already-placed animals
document.addEventListener('DOMContentLoaded', () => {
  let anyPlaced = false;
  checkAllAnimalsPlaced();
  if (butterflyAnimal) {
    butterflyAnimal.style.display = 'inline';
  }

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
      anyPlaced = true;
    }
    animal.addEventListener('mouseup', () => {
    setTimeout(checkAllAnimalsPlaced, 100); // slight delay to allow drop processing
  });
  });

  if (anyPlaced && resetButton) {
    resetButton.style.display = 'block';
  }

  // Navigation buttons
  const buttonLinks = {
    artButton: 'art.html',
    cvButton: 'cv.html',
    researchButton: 'research.html'
  };

  for (const [id, url] of Object.entries(buttonLinks)) {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', () => {
        window.open(url, '_blank');
      });
    }
  }
});

// Drag and drop behavior
animals.forEach(animal => {
  let isDragging = false;
  let offsetX, offsetY;
  let originalLeft, originalTop;
  const id = animal.dataset.id;

  animal.addEventListener('mousedown', e => {
    isDragging = true;

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
        // Save placement
        localStorage.setItem(`placed-${id}`, JSON.stringify({
          x: animal.offsetLeft,
          y: animal.offsetTop
        }));

        // Show reset button
        if (resetButton) {
          resetButton.style.display = 'block';
        }

        // Open animal page
        const url = animal.dataset.url;
        if (url) {
          window.open(url, '_blank');
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

  animal.ondragstart = () => false;
});

// Reset button behavior
if (resetButton) {
  resetButton.addEventListener('click', () => {
    animals.forEach(animal => {
      const id = animal.dataset.id;
      localStorage.removeItem(`placed-${id}`);
    });
    window.location.reload();
  });
}
