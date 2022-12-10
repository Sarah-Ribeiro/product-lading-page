 /* Function change phone color */
 function imgSlider(e) {
    document.querySelector('#phone').src = e;
  }

  /* Function change circle color */
  function circleChange(color) {
    const circle = document.querySelector('.circle')
    circle.style.background = color;
  }