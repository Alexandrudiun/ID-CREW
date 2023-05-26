  function deleteSlide(slideId) {
    const slide = document.getElementById(slideId);
    const slideItem = slide.parentNode;
    slideItem.parentNode.removeChild(slideItem);
  }

