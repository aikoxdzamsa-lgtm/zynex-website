/* =====================================================
   ZYNEX AI — OFFICIAL WEBSITE
   Full JavaScript
   ===================================================== */

"use strict";

/* =====================================================
   CONFIGURATION
   ===================================================== */

// Flutter Web აპლიკაცია:
// C:\src\ai_tutor\zynex-website\app

const ZYNEX_APP_URL = "./app/";

// Android APK:
// C:\src\ai_tutor\zynex-website\downloads\Zynex.apk

const ZYNEX_ANDROID_URL = "./downloads/Zynex.apk";

let deferredInstallPrompt = null;

/* =====================================================
   NOTIFICATION SYSTEM
   ===================================================== */

function showToast(message, type = "info") {
  let container = document.getElementById("zynex-toasts");

  if (!container) {
    container = document.createElement("div");

    container.id = "zynex-toasts";

    Object.assign(container.style, {
      position: "fixed",
      bottom: "25px",
      right: "25px",
      zIndex: "99999",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      maxWidth: "calc(100vw - 40px)",
      pointerEvents: "none"
    });

    document.body.appendChild(container);
  }

  const toast = document.createElement("div");

  toast.textContent = message;

  const isError = type === "error";
  const isSuccess = type === "success";

  Object.assign(toast.style, {
    padding: "16px 22px",
    borderRadius: "14px",
    background: isError
      ? "linear-gradient(135deg, #532339, #251824)"
      : isSuccess
        ? "linear-gradient(135deg, #173b34, #142522)"
        : "linear-gradient(135deg, #292142, #181725)",
    color: "#ffffff",
    border: isError
      ? "1px solid rgba(255,100,130,.4)"
      : "1px solid rgba(180,140,255,.35)",
    boxShadow: "0 15px 45px rgba(0,0,0,.4)",
    fontSize: "13px",
    lineHeight: "1.6",
    opacity: "0",
    transform: "translateY(15px)",
    transition: "opacity .3s ease, transform .3s ease",
    pointerEvents: "auto"
  });

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(15px)";

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4500);
}

/* =====================================================
   LAUNCH ZYNEX AI
   ===================================================== */

function launchZynex() {
  if (!ZYNEX_APP_URL) {
    showToast(
      "Zynex AI is not connected yet.",
      "error"
    );
    return;
  }

  // ჩვენი ნამდვილი Flutter აპლიკაცია
  // გაიხსნება იმავე საიტზე.

  window.location.assign(ZYNEX_APP_URL);
}

/* =====================================================
   CHECK IF APK EXISTS
   ===================================================== */

async function apkExists() {
  try {
    const response = await fetch(ZYNEX_ANDROID_URL, {
      method: "HEAD",
      cache: "no-store"
    });

    if (!response.ok) {
      return false;
    }

    const contentType =
      response.headers.get("content-type") || "";

    // თუ სერვერმა HTML დააბრუნა APK-ის ნაცვლად,
    // ეს ნიშნავს, რომ APK არ მოიძებნა.

    if (contentType.includes("text/html")) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("APK check error:", error);
    return false;
  }
}

/* =====================================================
   DOWNLOAD ANDROID APK
   ===================================================== */

async function downloadAndroid() {
  if (!ZYNEX_ANDROID_URL) {
    showToast(
      "Android APK is not available yet.",
      "error"
    );
    return;
  }

  showToast("Checking Zynex Android download...");

  const available = await apkExists();

  if (!available) {
    showToast(
      "Zynex APK is not uploaded yet. We will add it soon.",
      "error"
    );
    return;
  }

  // გადმოწერა
  const link = document.createElement("a");

  link.href = ZYNEX_ANDROID_URL;
  link.download = "Zynex.apk";

  document.body.appendChild(link);

  link.click();

  link.remove();

  showToast(
    "Zynex APK download started!",
    "success"
  );
}

/* =====================================================
   PWA INSTALLATION
   ===================================================== */

window.addEventListener(
  "beforeinstallprompt",
  (event) => {
    event.preventDefault();

    deferredInstallPrompt = event;
  }
);

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;

  showToast(
    "Zynex was installed successfully!",
    "success"
  );
});

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

async function installZynex() {
  if (isStandalone()) {
    showToast(
      "Zynex is already running as an installed app.",
      "success"
    );
    return;
  }

  if (deferredInstallPrompt) {
    const installEvent = deferredInstallPrompt;

    deferredInstallPrompt = null;

    try {
      await installEvent.prompt();

      const choice = await installEvent.userChoice;

      if (choice.outcome === "accepted") {
        showToast(
          "Installing Zynex...",
          "success"
        );
      }
    } catch (error) {
      console.error("PWA installation error:", error);

      showToast(
        "Could not start installation.",
        "error"
      );
    }

    return;
  }

  const isIOS =
    /iPad|iPhone|iPod/i.test(navigator.userAgent);

  if (isIOS) {
    showToast(
      "On iPhone: tap Share, then Add to Home Screen."
    );
    return;
  }

  showToast(
    "Use your browser menu and select Install app or Add to Home Screen."
  );
}

/* =====================================================
   SMOOTH SCROLL
   ===================================================== */

function setupSmoothScroll() {
  const links = document.querySelectorAll(
    'a[href^="#"]'
  );

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        event.preventDefault();

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

        return;
      }

      let target;

      try {
        target = document.querySelector(targetId);
      } catch (error) {
        return;
      }

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
}

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */

function setupScrollAnimations() {
  const elements = document.querySelectorAll(
    ".feature-card, " +
    ".section-heading, " +
    ".about-content, " +
    ".about-visual, " +
    ".cta-box"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.style.opacity = "1";

        entry.target.style.transform =
          "translateY(0)";

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px 30px 0px"
    }
  );

  elements.forEach((element) => {
    element.style.opacity = "0";

    element.style.transform =
      "translateY(25px)";

    element.style.transition =
      "opacity .7s ease, transform .7s ease";

    observer.observe(element);
  });
}

/* =====================================================
   NAVBAR EFFECT
   ===================================================== */

function setupNavbar() {
  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 30) {
      navbar.style.background =
        "rgba(12,12,22,.85)";

      navbar.style.backdropFilter =
        "blur(20px)";

      navbar.style.borderRadius =
        "0 0 20px 20px";
    } else {
      navbar.style.background =
        "transparent";

      navbar.style.backdropFilter =
        "none";

      navbar.style.borderRadius =
        "0";
    }
  }

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );

  updateNavbar();
}

/* =====================================================
   NAVIGATION BUTTONS
   ===================================================== */

function setupButtons() {
  const launchButton =
    document.getElementById("launchButton");

  const androidButton =
    document.getElementById("androidButton");

  const installButton =
    document.getElementById("installButton");

  if (launchButton) {
    launchButton.addEventListener(
      "click",
      launchZynex
    );
  }

  if (androidButton) {
    androidButton.addEventListener(
      "click",
      downloadAndroid
    );
  }

  if (installButton) {
    installButton.addEventListener(
      "click",
      installZynex
    );
  }

  // ზედა მენიუს და მთავარი გვერდის
  // Launch Zynex ღილაკებიც გავააქტიუროთ.

  document
    .querySelectorAll('a[href="#launch"]')
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        launchZynex();
      });
    });

  // მთავარი Download App ღილაკი
  // გადაგვიყვანს ჩამოტვირთვის სექციაზე.

  document
    .querySelectorAll('a[href="#download"]')
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();

        const section =
          document.getElementById("download");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth"
          });
        }
      });
    });
}

/* =====================================================
   WEBSITE READY
   ===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    setupSmoothScroll();

    setupScrollAnimations();

    setupNavbar();

    setupButtons();

    console.log(
      "%c ZYNEX AI ",
      "background:#9566ff;color:white;" +
      "font-size:20px;font-weight:bold;" +
      "padding:10px;border-radius:8px;"
    );

    console.log(
      "Zynex official website loaded successfully."
    );
  }
);