// src/client.js
function isAndroid() {
  const regex = /Mobi|Android|Opera Mini/i;
  return regex.test(navigator.userAgent);
}
document.addEventListener("DOMContentLoaded", () => {
  const scrollWrap = document.getElementById("mainwrap");
  if (isAndroid()) {
    scrollWrap.classList.add("gyroscope-effect");
    window.addEventListener("deviceorientation", (event) => {
      const deg = (Math.abs(event.beta) - 45) / 20;
      scrollWrap.style.transform = `perspective(100px) rotateX(${deg}deg) `;
    });
  }
  const animationElements = document.querySelectorAll("[class*='a-']");
  const progressBars = debounce(() => {
    animationElements.forEach((element) => {
      const windowHeight = window.innerHeight;
      const windowTopPosition = window.scrollX;
      const windowBottomPosition = windowTopPosition + windowHeight;
      const elementRect = element.getClientRects()[0];
      const elementBottomPosition = elementRect.top + elementRect.height;
      if (elementBottomPosition >= windowTopPosition && elementRect.top <= windowBottomPosition) {
        element.classList.add("in-view");
        if (element.classList.contains("a-progress-bar")) {
          element.style.width = `${element.dataset.percent}%`;
        }
      }
    });
  }, 100, true);
  progressBars();
  document.addEventListener("scroll", progressBars);
  scrollWrap.addEventListener("scroll", progressBars);
  scrollWrap.addEventListener("resize", progressBars);
});
function debounce(func, wait, immediate) {
  let timeout;
  return function(...args) {
    const later = () => {
      timeout = null;
      if (!immediate)
        func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow)
      func.apply(this, args);
  };
}
