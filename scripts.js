document.addEventListener("DOMContentLoaded", function () {
  const heroStatement = document.querySelector(".hero-statement");
  const canvas = document.getElementById("drawing-canvas");
  const ctx = canvas.getContext("2d");
  const customCursor = document.querySelector(".custom-cursor");
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Set canvas dimensions to match the hero-statement section
  canvas.width = heroStatement.offsetWidth;
  canvas.height = heroStatement.offsetHeight;
  ctx.lineWidth = 5; // Make the line thicker
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  heroStatement.addEventListener("mouseenter", (e) => {
    isDrawing = true;
    customCursor.style.display = "block";
    ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
    [lastX, lastY] = [
      e.clientX - heroStatement.getBoundingClientRect().left,
      e.clientY - heroStatement.getBoundingClientRect().top + 48,
    ];
    ctx.beginPath();
  });

  heroStatement.addEventListener("mouseleave", () => {
    isDrawing = false;
    customCursor.style.display = "none";
    ctx.closePath();
  });

  heroStatement.addEventListener("mousemove", (e) => {
    customCursor.style.left = e.clientX + "px";
    customCursor.style.top = e.clientY + "px";
    if (isDrawing) {
      const currentX = e.clientX - heroStatement.getBoundingClientRect().left;
      const currentY =
        e.clientY - heroStatement.getBoundingClientRect().top + 48; // Offset by 48px for bottom-left

      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      [lastX, lastY] = [currentX, currentY];
    }
  });
});
