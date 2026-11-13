/* Foto Carlos C.A. — Interactive UI Behaviors (Zero external dependencies) */
(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Sticky Header Scroll Elevation
     ------------------------------------------------------------------------ */
  const header = document.querySelector(".site-header");
  if (header) {
    const syncHeaderState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });
  }

  /* ------------------------------------------------------------------------
     2. Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");

  if (menuToggle && mobileDrawer) {
    const closeDrawer = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileDrawer.hidden = true;
    };

    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      mobileDrawer.hidden = isExpanded;
    });

    mobileDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mobileDrawer.hidden) {
        closeDrawer();
        menuToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Before / After Interactive Comparison Slider
     ------------------------------------------------------------------------ */
  const slider = document.getElementById("restoration-compare");
  const handle = document.getElementById("compare-handle");

  if (slider && handle) {
    let currentPercent = 50;
    let isDragging = false;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const setPosition = (percent) => {
      currentPercent = clamp(percent, 2, 98);
      slider.style.setProperty("--compare-pos", currentPercent.toFixed(2) + "%");
      handle.setAttribute("aria-valuenow", String(Math.round(currentPercent)));
    };

    const updateFromClientX = (clientX) => {
      const rect = slider.getBoundingClientRect();
      if (rect.width <= 0) return;
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setPosition(pct);
    };

    slider.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      isDragging = true;
      slider.classList.add("is-dragging");
      if (slider.setPointerCapture) {
        try {
          slider.setPointerCapture(event.pointerId);
        } catch (_) {
          // Ignore pointer capture error on synthetic events
        }
      }
      updateFromClientX(event.clientX);
    });

    slider.addEventListener("pointermove", (event) => {
      if (!isDragging) return;
      updateFromClientX(event.clientX);
    });

    const stopDragging = (event) => {
      if (!isDragging) return;
      isDragging = false;
      slider.classList.remove("is-dragging");
      if (slider.releasePointerCapture && event && event.pointerId !== undefined) {
        try {
          slider.releasePointerCapture(event.pointerId);
        } catch (_) {
          // Ignore
        }
      }
    };

    slider.addEventListener("pointerup", stopDragging);
    slider.addEventListener("pointercancel", stopDragging);

    // Keyboard support on slider handle (WCAG slider pattern)
    handle.addEventListener("keydown", (event) => {
      const step = event.shiftKey ? 10 : 3;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setPosition(currentPercent - step);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setPosition(currentPercent + step);
      } else if (event.key === "Home") {
        event.preventDefault();
        setPosition(2);
      } else if (event.key === "End") {
        event.preventDefault();
        setPosition(98);
      }
    });
  }
})();
