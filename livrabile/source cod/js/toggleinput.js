const toggleButton = document.querySelector('#toggle-button');

toggleButton.addEventListener('click', () => {
  const workerColor = getComputedStyle(document.documentElement).getPropertyValue('--worker-color');
  const prestatorColor = getComputedStyle(document.documentElement).getPropertyValue('--prestator-color');
  
  if (workerColor === prestatorColor) {
    document.documentElement.style.setProperty('--worker-color', '');
  } else {
    document.documentElement.style.setProperty('--worker-color', prestatorColor);
  }
});
