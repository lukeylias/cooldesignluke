document.addEventListener("DOMContentLoaded", function () {
  const heroStatement = document.querySelector(".hero-statement");
  const canvas = document.getElementById("drawing-canvas");
  const ctx = canvas.getContext("2d");
  const customCursor = document.querySelector(".custom-cursor");

  const soundAssets = [
    "sounds/pop1.wav",
    "sounds/pop2.wav",
    "sounds/pop3.wav",
    "sounds/pop4.wav",
  ];

  const stampAssets = [
    "assets/Circle_01.svg",
    "assets/Circle_02.svg",
    "assets/Cone_01.svg",
    "assets/Cube_01.svg",
    "assets/HexagonalPrism_01.svg",
    "assets/PentagonalPrism_01.svg",
    "assets/Pyramid_01.svg",
    "assets/RectangularPrism_01.svg",
    "assets/Sphere_2Axis.svg",
    "assets/Sphere_3Axis.svg",
    "assets/Square_01.svg",
    "assets/Trapezpoid_01.svg",
    "assets/Triangle_01.svg",
    "assets/Triangle_02.svg",
    "assets/Triangular.svg",
  ];

  const stampImage = new Image();
  let lastStampSrc = "";
  let currentStampSize = 100;
  let isImageReady = false;

  // --- Cursor Animation Variables ---
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  const easing = 0.08; // Adjust for more/less drag
  let animationFrameId = null;

  // Set canvas dimensions to match the hero-statement section
  canvas.width = heroStatement.offsetWidth;
  canvas.height = heroStatement.offsetHeight;

  // Improve image quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // --- Animation Loop ---
  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * easing;
    cursorY += dy * easing;

    const halfSize = currentStampSize / 2;
    customCursor.style.transform = `translate3d(${cursorX - halfSize}px, ${
      cursorY - halfSize
    }px, 0)`;

    animationFrameId = requestAnimationFrame(animateCursor);
  }

  // --- Custom Cursor Logic ---
  heroStatement.addEventListener("mouseenter", (e) => {
    customCursor.style.display = "block";
    isImageReady = false;

    // Initialize cursor position to avoid jump
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorX = e.clientX;
    cursorY = e.clientY;

    let newStampSrc;
    do {
      newStampSrc = stampAssets[Math.floor(Math.random() * stampAssets.length)];
    } while (newStampSrc === lastStampSrc);

    lastStampSrc = newStampSrc;

    // Load SVG as a data URL to maintain quality
    fetch(newStampSrc)
      .then((response) => response.text())
      .then((svgText) => {
        const encodedSvg = window.btoa(svgText);
        stampImage.src = `data:image/svg+xml;base64,${encodedSvg}`;
        customCursor.style.backgroundImage = `url('${stampImage.src}')`;
        stampImage.onload = () => {
          isImageReady = true;
        };
      });

    // Randomize the size
    currentStampSize = Math.floor(Math.random() * 50) + 75; // e.g., 75px to 125px
    customCursor.style.width = `${currentStampSize}px`;
    customCursor.style.height = `${currentStampSize}px`;

    // Start animation
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    animateCursor();
  });

  heroStatement.addEventListener("mouseleave", () => {
    customCursor.style.display = "none";
    // Stop animation
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  });

  heroStatement.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // --- Stamping Logic ---
  heroStatement.addEventListener("click", (e) => {
    if (!isImageReady) return;

    const halfSize = currentStampSize / 2;
    const x = e.clientX - heroStatement.getBoundingClientRect().left - halfSize; // Adjust for centering
    const y = e.clientY - heroStatement.getBoundingClientRect().top - halfSize; // Adjust for centering
    ctx.drawImage(stampImage, x, y, currentStampSize, currentStampSize);

    const randomSoundSrc =
      soundAssets[Math.floor(Math.random() * soundAssets.length)];
    const clickSound = new Audio(randomSoundSrc);
    clickSound.play();
  });
});
