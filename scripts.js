document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  // --- Modal Logic ---
  const modal = document.getElementById("project-modal");
  const trigger = document.getElementById("project-one-trigger");
  const closeButton = document.querySelector(".modal-close");
  const videoIframe = modal ? modal.querySelector(".video-iframe") : null;
  const originalVideoSrc = videoIframe ? videoIframe.src : "";

  console.log("Modal elements:", { modal, trigger, closeButton });

  function showModal() {
    console.log("showModal called");
    document.body.classList.add("modal-open");
    modal.classList.add("is-visible");
    if (videoIframe && videoIframe.src !== originalVideoSrc) {
      videoIframe.src = originalVideoSrc;
    }
    requestAnimationFrame(() => {
      if (closeButton) {
        closeButton.focus();
      }
    });
  }

  function hideModal() {
    console.log("hideModal called");
    document.body.classList.remove("modal-open");
    modal.classList.remove("is-visible");
    if (videoIframe) {
      videoIframe.src = ""; // This stops the video by removing the source
    }
  }

  if (trigger) {
    trigger.addEventListener("click", (e) => {
      console.log("Trigger clicked");
      e.preventDefault();
      showModal();
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", hideModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        hideModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-visible")) {
        hideModal();
      }
    });
  }
});
