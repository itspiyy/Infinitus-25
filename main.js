// Loading Screen
document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.querySelector(".loading-screen");
  const loadingText = document.querySelector(".loading-text");
  const scrollBanner = document.querySelector(".scroll-banner");
  const navbar = document.querySelector(".navbar");
  const bottomText = document.querySelector(".bottom-text");
  const backgroundEffect = document.querySelector(".background-effect");
  const defaultDuration = 3000; // 3 seconds

  // Set initial styles for the background-effect element
  gsap.set(backgroundEffect, {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a1a",
    zIndex: -1, // Ensure it sits behind other elements
  });

  // Define GSAP timeline
  const timeline = gsap.timeline();

  // Run animations after the page has fully loaded
  const handleLoadedAnimations = () => {
    // Ensure text visibility for "Enable audio..."
    loadingText.style.opacity = 0; // Reset to fully hidden before animation

    // Show the "Enable audio..." text
    timeline
      .to(loadingText, {
        opacity: 1,
        duration: 0.5,
        onStart: () => {
          loadingText.textContent =
            "Activate audio for a fully immersive experience.";
        },
      })
      // Play scroll-banner animation
      .fromTo(
        scrollBanner,
        {
          x: "100%", // Start position (off-screen to the right)
        },
        {
          x: "0%", // End position (fully visible)
          duration: 1.5,
          ease: "power3.out",
        },
        "<" // Start simultaneously with text fade-in
      )
      // Fade out the "Enable audio..." text
      .to(
        loadingText,
        {
          opacity: 0,
          duration: 0.5,
          delay: 0.5,
        },
        "+=0.5" // Wait 0.5s after scroll banner animation completes
      )
      // Animate backgroundEffect to slide from bottom to top and fade out
      .to(backgroundEffect, {
        x: "-100%", // Slide up out of the screen
        opacity: 0.6, // Fade out
        duration: 0.8,
        ease: "power3.out",
      })
      // Animate loadingScreen to slide out in the same way
      .to(
        loadingScreen,
        {
          x: "-100%", // Slide up out of the screen
          opacity: 0, // Fade out
          duration: 0.6,
          ease: "power3.inOut",
          onComplete: () => {
            loadingScreen.style.display = "none"; // Ensure it's removed from the flow
            window.scrollTo(0, 0); // Reset scroll position
          },
        },
        "+=0.2" // Slight delay after backgroundEffect animation
      )
      // Animate navbar and bottom-text to pop up and slide in
      .fromTo(
        [navbar, bottomText],
        {
          opacity: 0,
          y: 20, // Start position (20px below)
        },
        {
          opacity: 1,
          y: 0, // End position (original position)
          duration: 1.5,
          ease: "power3.out",
          stagger: 0.3, // Delay between navbar and bottom-text
        },
        "<0.5" // Start 0.5 seconds after loadingScreen animation
      );
  };

  // Wait for assets to load or fallback to default timer
  const fallbackTimer = setTimeout(() => {
    handleLoadedAnimations();
  }, defaultDuration);

  window.addEventListener("load", () => {
    clearTimeout(fallbackTimer);
    handleLoadedAnimations();
  });
});

// Create the custom cursor element
const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);

const updateCursor = (x, y) => {
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
};

document.addEventListener("mousemove", (event) => {
  updateCursor(event.clientX, event.clientY);
  cursor.style.display = "block";
});

document.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  updateCursor(touch.clientX, touch.clientY);
  cursor.style.display = "block";
});

document.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  updateCursor(touch.clientX, touch.clientY);
});

document.addEventListener("touchend", () => {
  cursor.style.display = "none";
});

document.querySelectorAll("a, button, .hover-target").forEach((element) => {
  element.addEventListener("mouseenter", () => {
    cursor.classList.add("hovered");
  });

  element.addEventListener("mouseleave", () => {
    cursor.classList.remove("hovered");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const marqueeContainer = document.querySelector(".scroll-banner__container");
  const marqueeItems = document.querySelectorAll(".scroll-banner__item");
  let currentScroll = 0;
  let isScrollingDown = true;

  const marqueeAnimation = gsap
    .to(marqueeItems, {
      xPercent: -100,
      repeat: -1,
      duration: 3,
      ease: "linear",
    })
    .totalProgress(0.5);

  gsap.set(marqueeContainer, { xPercent: -50 });

  window.addEventListener("scroll", () => {
    const newScroll = window.pageYOffset;
    isScrollingDown = newScroll > currentScroll;

    gsap.to(marqueeAnimation, {
      timeScale: isScrollingDown ? 1 : -1,
    });

    currentScroll = newScroll;
  });

  const container = document.querySelector(".items");
  let imageIndex = 1;
  let animationTimeout = null;
  let currentlyAnimating = false;

  function addNewItem(x, y) {
    const newItem = document.createElement("div");
    newItem.className = "item";

    const size = Math.max(window.innerWidth, window.innerHeight) * 0.08;
    newItem.style.width = `${size}px`;
    newItem.style.height = `${size}px`;
    newItem.style.left = `${x - size / 2}px`;
    newItem.style.top = `${y - size / 2}px`;

    const img = document.createElement("img");
    img.src = `./assets/img${imageIndex}.jpg`;
    img.style.objectFit = "cover";
    newItem.appendChild(img);

    imageIndex = (imageIndex % 15) + 1;

    container.appendChild(newItem);
    manageItemLimit();
  }

  function manageItemLimit() {
    while (container.children.length > 20) {
      container.removeChild(container.firstChild);
    }
  }

  function startAnimation() {
    if (currentlyAnimating || container.children.length === 0) return;
    currentlyAnimating = true;

    gsap.to(".item", {
      y: window.innerHeight * 1.5,
      scale: 0.5,
      opacity: 0,
      duration: 0.5,
      stagger: 0.025,
      onComplete: function () {
        this.targets().forEach((item) => {
          if (item.parentNode) {
            item.parentNode.removeChild(item);
          }
        });
        currentlyAnimating = false;
      },
    });
  }

  function handleMouseMove(event) {
    clearTimeout(animationTimeout);
    addNewItem(event.pageX, event.pageY);
    animationTimeout = setTimeout(startAnimation, 100);
  }

  function handleTouchMove(event) {
    clearTimeout(animationTimeout);
    const touch = event.touches[0];
    addNewItem(touch.pageX, touch.pageY);
    animationTimeout = setTimeout(startAnimation, 100);
  }

  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("touchmove", handleTouchMove, { passive: true });

  // Resize handler for responsive scaling
  window.addEventListener("resize", () => {
    document.querySelectorAll(".item").forEach((item) => {
      const size = Math.max(window.innerWidth, window.innerHeight) * 0.08;
      item.style.width = `${size}px`;
      item.style.height = `${size}px`;
    });
  });
});

function toggleDropdown() {
  const dropdownContent = document.querySelector(".dropdown-content");
  const currentState = dropdownContent.style.display;

  // Toggle the display state
  if (currentState === "block") {
    dropdownContent.style.display = "none";
  } else {
    dropdownContent.style.display = "block";
  }
}

const items = document.querySelectorAll(".hover-sound");
const hoverSound = document.getElementById("hover-sound");

// Add event listeners to play sound on hover
items.forEach((item) => {
  item.addEventListener("mouseover", () => {
    hoverSound.currentTime = 0; // Reset to the start of the sound
    hoverSound.play();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  function updateTime() {
    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    const timeInAmravati = new Intl.DateTimeFormat("en-IN", options).format(
      new Date()
    );
    document.getElementById("timeDisplay").textContent = timeInAmravati;
  }

  // Update time every second
  updateTime(); // Initial call to set time immediately
  setInterval(updateTime, 1000); // Updates every 1 second
});

// Text Shuffle
document.addEventListener("DOMContentLoaded", () => {
  // Select all elements with the shuffle effect
  const shuffleElements = document.querySelectorAll(".shuffle-text");

  shuffleElements.forEach((element) => {
    element.addEventListener("mouseenter", shuffleAnimation);
  });
});

// Function to generate a random character
function getRandomCharacter() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return chars[Math.floor(Math.random() * chars.length)];
}

// Shuffle animation logic
document.addEventListener("DOMContentLoaded", () => {
  const shuffleElements = document.querySelectorAll(".shuffle-text");

  shuffleElements.forEach((element) => {
    element.addEventListener("mouseenter", shuffleAnimation);
  });
});

function getRandomCharacter() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return chars[Math.floor(Math.random() * chars.length)];
}

function shuffleAnimation(event) {
  const target = event.currentTarget;

  // Prevent overlapping animations
  if (target.dataset.animating) {
    return;
  }

  target.dataset.animating = true;

  const originalText = target.textContent;
  const textLength = originalText.length;
  const maxShuffles = 10; // Number of shuffle iterations
  const intervalDuration = 50; // Time (ms) between each shuffle
  let shuffles = 0;

  const animationInterval = setInterval(() => {
    if (shuffles >= maxShuffles) {
      clearInterval(animationInterval);
      target.textContent = originalText; // Reset to original text
      delete target.dataset.animating;
    } else {
      let shuffledText = "";
      for (let i = 0; i < textLength; i++) {
        shuffledText += getRandomCharacter();
      }
      target.textContent = shuffledText; // Update with shuffled characters
      shuffles++;
    }
  }, intervalDuration);
}

// Menu Hover Effect
const dropdownLinks = document.querySelectorAll(".dropdown-link");

dropdownLinks.forEach((link) => {
  const imageWrapper = link.querySelector(".dropdown-link-image_wrapper");

  const onMouseEnterOrTouchStart = () => {
    gsap.set(imageWrapper, {
      scale: 0.8,
    });
    gsap.to(imageWrapper, { opacity: 1, scale: 1, yPercent: 0, rotation: 0 });
  };

  const onMouseLeaveOrTouchEnd = () => {
    gsap.to(imageWrapper, {
      opacity: 0,
      scale: 1,
    });
  };

  const onMouseMoveOrTouchMove = (event) => {
    const bounds = link.getBoundingClientRect();
    let x, y;

    if (event.type === "mousemove") {
      // Mouse input
      ({ x, y } = event);
    } else if (event.type === "touchmove") {
      // Touch input
      const touch = event.touches[0];
      x = touch.clientX;
      y = touch.clientY;
    }

    gsap.to(imageWrapper, {
      duration: 2,
      x: x - bounds.left - bounds.width / 2,
      y: y - bounds.top - bounds.height / 2,
    });
  };

  // Event listeners for both mouse and touch
  link.addEventListener("mouseenter", onMouseEnterOrTouchStart);
  link.addEventListener("mouseleave", onMouseLeaveOrTouchEnd);
  link.addEventListener("mousemove", onMouseMoveOrTouchMove);

  link.addEventListener("touchstart", onMouseEnterOrTouchStart);
  link.addEventListener("touchend", onMouseLeaveOrTouchEnd);
  link.addEventListener("touchmove", onMouseMoveOrTouchMove);
});

// Cultural Page
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Initialize scroll handler
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 750);
  });
  gsap.ticker.lagSmoothing(0);

  // Populate gallery dynamically
  function populateGallery() {
    const imagesContainers = document.querySelectorAll(".images");
    imagesContainers.forEach((container) => {
      for (let j = 0; j < imagesPerProject; j++) {
        if (imageIndex > totalImages) imageIndex = 1;
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("img");

        const img = document.createElement("img");
        img.src = `assets/img${imageIndex}.jpg`;
        img.alt = `Project Image ${imageIndex}`;
        imgContainer.appendChild(img);

        container.appendChild(imgContainer);
        imageIndex++;
      }
    });
  }

  const imagesPerProject = 6; // Number of images per project
  const totalImages = 6; // Total number of images
  let imageIndex = 1;

  populateGallery();

  // Update the preview image
  const previewImg = document.querySelector(".preview-img img");
  const imgElements = document.querySelectorAll(".img img");

  imgElements.forEach((img) => {
    ScrollTrigger.create({
      trigger: img,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => {
        previewImg.src = img.src; // Update preview image
      },
      onEnterBack: () => {
        previewImg.src = img.src; // Update preview image
      },
    });
  });

  // Indicator movement and project name activation
  const indicator = document.querySelector(".indicator");
  const indicatorStep = 18;
  const names = gsap.utils.toArray(".name");
  gsap.set(".indicator", { top: "0px" });

  const projects = gsap.utils.toArray(".project");
  projects.forEach((project, index) => {
    ScrollTrigger.create({
      trigger: project,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => {
        gsap.to(indicator, {
          top: Math.max(0, index * indicatorStep) + "px",
          duration: 0.3,
          ease: "power2.out",
        });

        names.forEach((name, i) =>
          name.classList.toggle("active", i === index)
        );
      },
      onLeaveBack: () => {
        const targetPosition = index - 1 < 0 ? 0 : (index - 1) * indicatorStep;
        gsap.to(indicator, {
          top: targetPosition + "px",
          duration: 0.3,
          ease: "power2.out",
        });

        names.forEach((name, i) =>
          name.classList.toggle("active", i === (index - 1 < 0 ? 0 : index - 1))
        );
      },
    });
  });

  // Mask animation
  projects.forEach((project, i) => {
    const mask = project.querySelector(".mask");
    const digitWrapper = project.querySelector(".digit-wrapper");
    const firstDigit = project.querySelector(".first");
    const secondDigit = project.querySelector(".second");

    gsap.set([mask, digitWrapper, firstDigit, secondDigit], { y: 0 });
    gsap.set(mask, { position: "absolute", top: 0 });

    ScrollTrigger.create({
      trigger: project,
      start: "top bottom",
      end: "bottom top",
      anticipatePin: 1,
      fastScrollEnd: true,
      preventOverlaps: true,
      onUpdate: (self) => {
        const projectRect = project.getBoundingClientRect();
        const windowCenter = window.innerHeight / 2;
        const nextProject = projects[i + 1];
        const velocityAdjustment = Math.min(scrollVelocity * 0.1, 100);
        const pushPoint =
          window.innerHeight * (0.85 + velocityAdjustment / window.innerHeight);

        if (projectRect.top <= windowCenter) {
          if (!mask.isFixed) {
            mask.isFixed = true;
            gsap.set(mask, { position: "fixed", top: "50vh" });
          }

          if (nextProject) {
            const nextRect = nextProject.getBoundingClientRect();

            if (nextRect.top <= pushPoint && activeIndex !== i + 1) {
              gsap.killTweensOf([mask, digitWrapper, firstDigit, secondDigit]);

              activeIndex = i + 1;
              gsap.to(mask, {
                y: -80,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true,
              });
              gsap.to(digitWrapper, {
                y: -80,
                duration: 0.5,
                delay: 0.5,
                ease: "power2.out",
                overwrite: true,
              });
              gsap.to(firstDigit, {
                y: -80,
                duration: 0.75,
                ease: "power2.out",
                overwrite: true,
              });
              gsap.to(secondDigit, {
                y: -80,
                duration: 0.75,
                delay: 0.1,
                ease: "power2.out",
                overwrite: true,
              });
            }
          }
        } else {
          mask.isFixed = false;
          gsap.set(mask, { position: "absolute", top: 0 });
        }

        if (self.direction === -1 && projectRect.top > windowCenter) {
          mask.isFixed = false;
          gsap.set(mask, { position: "absolute", top: 0 });

          if (i > 0 && activeIndex === i) {
            const prevProject = projects[i - 1];
            if (prevProject) {
              const prevMask = prevProject.querySelector(".mask");
              const prevWrapper = prevProject.querySelector(".digit-wrapper");
              const prevFirst = prevProject.querySelector(".first");
              const prevSecond = prevProject.querySelector(".second");

              gsap.killTweensOf([prevMask, prevWrapper, prevFirst, prevSecond]);

              activeIndex = i - 1;
              gsap.to([prevMask, prevWrapper], {
                y: 0,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true,
              });
              gsap.to(prevFirst, {
                y: 0,
                duration: 0.75,
                ease: "power2.out",
                overwrite: true,
              });
              gsap.to(prevSecond, {
                y: 0,
                duration: 0.75,
                delay: 0.1,
                ease: "power2.out",
                overwrite: true,
              });
            }
          }
        }
      },
      onEnter: () => {
        if (i === 0) activeIndex = 0;
      },
    });
  });

  // Track scroll velocity
  let activeIndex = -1;
  let lastScrollTop = 0;
  let scrollVelocity = 0;

  window.addEventListener(
    "scroll",
    () => {
      const st = window.pageYOffset;
      scrollVelocity = Math.abs(st - lastScrollTop);
      lastScrollTop = st;
    },
    { passive: true }
  );
});
