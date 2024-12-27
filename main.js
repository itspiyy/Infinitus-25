document.addEventListener("DOMContentLoaded", () => {
  const marqueeAnimation = gsap.to(".list", {
    x: "-100%",
    repeat: -1,
    duration: 20,
    ease: "linear",
    startAt: {
      x: "0%",
    },
  });

  let currentScroll = 0;

  window.addEventListener("scroll", () => {
    const newScroll = window.pageYOffset;
    const isScrollingDown = newScroll > currentScroll;

    marqueeAnimation.timeScale(isScrollingDown ? 1 : -1);

    currentScroll = newScroll;
  });
});
