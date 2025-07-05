document.addEventListener("DOMContentLoaded", function () {
  const heroStatement = document.querySelector(".hero-statement");
  const canvas = document.getElementById("drawing-canvas");
  const customCursor = document.querySelector(".custom-cursor");

  const soundAssets = [
    "sounds/pop1.wav",
    "sounds/pop2.wav",
    "sounds/pop3.wav",
    "sounds/pop4.wav",
  ];

  const stampAssets = [
    "assets/Confused.svg",
    "assets/Cool.svg",
    "assets/Cry.svg",
    "assets/Hello.svg",
    "assets/Sad.svg",
    "assets/Shocked.svg",
    "assets/Thumbs-Down.svg",
    "assets/Thumbs-Up.svg",
    "assets/Unimpressed.svg",
    "assets/Wow.svg",
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

  // Set canvas dimensions for high-DPI displays
  const dpr = window.devicePixelRatio || 1;
  const rect = heroStatement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

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
    stampImage.src = newStampSrc;
    customCursor.style.backgroundImage = `url('${newStampSrc}')`;
    stampImage.onload = () => {
      isImageReady = true;
    };

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

    const aspectRatio = stampImage.naturalWidth / stampImage.naturalHeight;

    // Add more variance to the size of the rendered sticker
    const minHeight = 80;
    const maxHeight = 500;
    const newHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    const newWidth = newHeight * aspectRatio;

    const x =
      e.clientX - heroStatement.getBoundingClientRect().left - newWidth / 2;
    const y =
      e.clientY - heroStatement.getBoundingClientRect().top - newHeight / 2;

    // Use calculated width and height to draw the image
    ctx.drawImage(stampImage, x, y, newWidth, newHeight);

    const randomSoundSrc =
      soundAssets[Math.floor(Math.random() * soundAssets.length)];
    const clickSound = new Audio(randomSoundSrc);
    clickSound.play();
  });
});
