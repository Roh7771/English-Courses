const headerScrollEl = document.querySelector(".header__arrow");
const containerEl = document.querySelector(".container");
headerScrollEl.addEventListener("click", () => {
  const interval = setInterval(() => {
    const containerCoords = containerEl.getBoundingClientRect();
    if (containerCoords.top < 0) {
      clearInterval(interval);
      return;
    }
    window.scrollTo(0, window.pageYOffset + 5);
  }, 0.1);
});