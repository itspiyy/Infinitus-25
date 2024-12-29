// Loading Screen
document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.querySelector(".loading-screen");
  const loadingText = document.querySelector(".loading-screen p"); // Select the paragraph in loading-screen
  const introOne = document.querySelector(".intro-one"); // Select intro-one div
  const introTwo = document.querySelector(".intro-two"); // Select intro-two div
  const navbar = document.querySelector(".navbar");
  const bottomText = document.querySelector(".bottom-text");
  const scrollBanner = document.querySelector(".scroll-banner");
  const loadingVideo = document.querySelector(".loading-video");
  const defaultDuration = 2000; // Shortened to 2 seconds

  loadingVideo.addEventListener("contextmenu", (e) => e.preventDefault());

  // Define GSAP timeline
  const timeline = gsap.timeline();

  // Run animations after the video starts playing
  const handleLoadedAnimations = () => {
    timeline
      // Animate introOne and introTwo slightly earlier
      .fromTo(
        introOne,
        {
          x: "-500%", // Start position (off-screen to the left)
          opacity: 0,
        },
        {
          x: "0%", // Slide to center
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.5" // Start 0.5 seconds earlier than loadingText
      )
      .fromTo(
        introTwo,
        {
          x: "500%", // Start position (off-screen to the right)
          opacity: 0,
        },
        {
          x: "0%", // Slide to center
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.5" // Start 0.5 seconds earlier than loadingText
      )
      // Animate loadingText slightly later than introOne and introTwo
      .to(
        loadingText,
        {
          opacity: 1,
          duration: 0.5, // Fade-in duration
        },
        "-=0.3" // Slightly after introOne and introTwo start
      )
      // Hold briefly, then fade out all together
      .to(
        [loadingText, introOne, introTwo],
        {
          opacity: 0,
          duration: 0.3, // Fade-out duration
        },
        "+=0.3" // Hold for a brief moment
      )
      // Slide the loading screen (with the video) upwards
      .to(
        loadingScreen,
        {
          opacity: 0, // Fade out
          duration: 0.75,
          ease: "power3.inOut",
          onComplete: () => {
            loadingScreen.style.display = "none"; // Remove the loading screen
            window.scrollTo(0, 0); // Reset scroll position
          },
        },
        "+=0.1" // Slight delay after text fade out
      )
      // Animate scroll-banner first
      .fromTo(
        scrollBanner,
        {
          x: 10, // Start slightly to the right
          opacity: 0, // Start fully transparent
        },
        {
          x: 0, // Move to original position
          opacity: 1, // Fully visible
          duration: 0.4, // Fade-in duration
          ease: "power3.out",
        },
        "+=0.1" // Start slightly after loading screen animation
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
          y: 0, // End position
          duration: 0.8, // Animation duration
          ease: "power3.out",
          stagger: 0.3, // Stagger animation between navbar and bottom-text
        }
      );
  };

  // Start animations after a 2-second timeout or when the video starts playing
  const fallbackTimer = setTimeout(() => {
    handleLoadedAnimations();
  }, defaultDuration);

  loadingVideo.addEventListener("loadeddata", () => {
    clearTimeout(fallbackTimer);
    setTimeout(() => {
      handleLoadedAnimations();
    }, defaultDuration);
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

// DropDown Menu
function toggleDropdown() {
  const dropdownContent = document.querySelector(".dropdown-content");
  const isVisible = dropdownContent.style.opacity === "1"; // Use opacity for smoother toggling

  if (isVisible) {
    // Animate dropdown out smoothly
    gsap.to(dropdownContent, {
      duration: 0.4,
      opacity: 0,
      // y: 50,
      ease: "power1.inOut", // Smooth easing for hiding
      onComplete: () => {
        dropdownContent.style.display = "none"; // Hide after animation
      },
    });
  } else {
    dropdownContent.style.display = "block"; // Show before animation starts
    gsap.fromTo(
      dropdownContent,
      { opacity: 0 }, // Initial state
      {
        duration: 0.25,
        opacity: 1,
        y: 0,
        ease: "power1.in", // Smooth and elegant ease-out for showing
      }
    );
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
      x: -400,
      y: 0, // Base starting position
    });
    gsap.to(imageWrapper, {
      opacity: 1,
      scale: 1, // Slight zoom-in effect
      duration: 0.5, // Smooth duration
      ease: "power3.out", // Easing for natural animation
    });
  };

  const onMouseLeaveOrTouchEnd = () => {
    gsap.to(imageWrapper, {
      opacity: 0,
      x: -220,
      y: 100, // Slight offset to create a "drop" effect
      scale: 0.9, // Slight shrink for smooth exit
      duration: 0.5,
      ease: "power3.in", // Smooth ease-in for fading out
    });
  };

  const onMouseMove = (event) => {
    const offsetX = (event.clientX - window.innerWidth / 2) * 0.03; // Smaller factor for subtle movement
    const offsetY = (event.clientY - window.innerHeight / 2) * 0.03;

    gsap.to(imageWrapper, {
      x: -220 + offsetX, // Maintain base offset while adding cursor effect
      y: 150 + offsetY, // Maintain base offset while adding cursor effect
      duration: 0.5, // Shorter duration for smoother movement
      ease: "power3.out", // Smooth easing
    });
  };

  // Event listeners for mouse and touch
  link.addEventListener("mouseenter", onMouseEnterOrTouchStart);
  link.addEventListener("mouseleave", onMouseLeaveOrTouchEnd);
  link.addEventListener("mousemove", onMouseMove);
});

// Cultural Events
// Cultural Events
let culturalTarget = 0;
let culturalCurrent = 0;
let culturalEase = 0.075;

const culturalSlider = document.querySelector(".slider");
const culturalSliderWrapper = document.querySelector(".slider-wrapper");
const culturalSlides = document.querySelectorAll(".slide");

let culturalMaxScroll = culturalSliderWrapper.offsetWidth - window.innerWidth;

function culturalLerp(start, end, factor) {
  return start + (end - start) * factor;
}

function culturalUpdateScaleAndPosition() {
  culturalSlides.forEach((slide) => {
    const rect = slide.getBoundingClientRect();
    const centerPosition = (rect.left + rect.right) / 2;
    const distanceFromCenter = centerPosition - window.innerWidth / 2;

    let scale, offsetX;
    if (distanceFromCenter > 0) {
      scale = Math.min(1.75, 1 + distanceFromCenter / window.innerWidth);
      offsetX = (scale - 1) * 300;
    } else {
      scale = Math.max(
        0.5,
        1 - Math.abs(distanceFromCenter) / window.innerWidth
      );
      offsetX = 0;
    }

    gsap.set(slide, { scale: scale, x: offsetX });
  });
}

function culturalUpdate() {
  culturalCurrent = culturalLerp(culturalCurrent, culturalTarget, culturalEase);

  gsap.set(".slider-wrapper", {
    x: -culturalCurrent,
  });

  culturalUpdateScaleAndPosition();

  requestAnimationFrame(culturalUpdate);
}

window.addEventListener("resize", () => {
  culturalMaxScroll = culturalSliderWrapper.offsetWidth - window.innerWidth;
});

window.addEventListener("wheel", (e) => {
  culturalTarget += e.deltaY;
  culturalTarget = Math.max(0, culturalTarget);
  culturalTarget = Math.min(culturalMaxScroll, culturalTarget);
});

culturalUpdate();

// Technical Events

let technicalTarget = 0; // Tracks the target scroll position
let technicalCurrent = 0; // Tracks the current position of the slider
let technicalEase = 0.075; // Controls the smooth scrolling effect

const technicalSlider = document.querySelector(".image-slider");
const technicalSliderWrapper = document.querySelector(".image-slider-wrapper");
const technicalSlides = document.querySelectorAll(".image-slide");

// Calculate the maximum scrollable distance
let technicalMaxScroll = technicalSliderWrapper.offsetWidth - window.innerWidth;

// Linear interpolation function for smooth scrolling
function technicalLerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Update scale and position of each slide based on its distance from the center
function technicalUpdateScaleAndPosition() {
  technicalSlides.forEach((imageSlide) => {
    const rect = imageSlide.getBoundingClientRect();
    const centerPosition = (rect.left + rect.right) / 2;
    const distanceFromCenter = centerPosition - window.innerWidth / 2;

    let scale, offsetX;

    if (distanceFromCenter > 0) {
      scale = Math.min(1.75, 1 + distanceFromCenter / window.innerWidth);
      offsetX = (scale - 1) * 300;
    } else {
      scale = Math.max(
        0.5,
        1 - Math.abs(distanceFromCenter) / window.innerWidth
      );
      offsetX = 0;
    }

    gsap.set(imageSlide, { scale: scale, x: offsetX });
  });
}

// Continuously update the slider's position and the scale of slides
function technicalUpdate() {
  // Smoothly interpolate the current position towards the target
  technicalCurrent = technicalLerp(
    technicalCurrent,
    technicalTarget,
    technicalEase
  );

  // Move the slider wrapper
  gsap.set(technicalSliderWrapper, {
    x: -technicalCurrent,
  });

  // Update scale and position for each slide
  technicalUpdateScaleAndPosition();

  // Request the next animation frame
  requestAnimationFrame(technicalUpdate);
}

// Recalculate the maximum scrollable distance on window resize
window.addEventListener("resize", () => {
  technicalMaxScroll = technicalSliderWrapper.offsetWidth - window.innerWidth;
});

// Update the target position on mouse wheel scroll
window.addEventListener("wheel", (e) => {
  technicalTarget += e.deltaY;
  technicalTarget = Math.max(0, technicalTarget); // Prevent scrolling beyond start
  technicalTarget = Math.min(technicalMaxScroll, technicalTarget); // Prevent scrolling beyond end
});

// Initialize the animation
technicalUpdate();
