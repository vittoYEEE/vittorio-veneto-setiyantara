(function () {
  const WORDS = [
    { text: "Welcome", dir: "ltr", tracking: "-0.02em", duration: 500 },
    { text: "مرحباً", dir: "rtl", tracking: "-0.01em", duration: 380 },
    { text: "Bienvenue", dir: "ltr", tracking: "-0.02em", duration: 300 },
    { text: "Willkommen", dir: "ltr", tracking: "-0.02em", duration: 240 },
    { text: "Bienvenido", dir: "ltr", tracking: "-0.02em", duration: 190 },
    { text: "Benvenuto", dir: "ltr", tracking: "-0.02em", duration: 150 },
    { text: "Selamat datang", dir: "ltr", tracking: "0.05em", duration: 120 },
    { text: "환영합니다", dir: "ltr", tracking: "0.02em", duration: 100 },
    { text: "欢迎", dir: "ltr", tracking: "0.08em", duration: 90 },
    {
      text: "ようこそ",
      dir: "ltr",
      tracking: "0em",
      duration: 1400,
      isLast: true,
    },
  ];

  const wordEls = Array.from(document.querySelectorAll(".wordText"));
  const tickerMasks = Array.from(document.querySelectorAll(".ticker-mask"));
  const loader = document.getElementById("loader");
  const curtainLeft = document.getElementById("curtainLeft");
  const curtainRight = document.getElementById("curtainRight");
  const divider = document.getElementById("divider");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function fitFontSize() {
    let size = Math.min(
      window.innerWidth * 0.12,
      window.innerHeight * 0.22,
      140,
    );
    wordEls.forEach((el) => (el.style.fontSize = size + "px"));
    let guard = 0;
    while (
      wordEls[0].scrollWidth > window.innerWidth * 0.88 &&
      size > 16 &&
      guard < 60
    ) {
      size -= 2;
      wordEls.forEach((el) => (el.style.fontSize = size + "px"));
      guard++;
    }
  }

  function setText(entry) {
    wordEls.forEach((el) => {
      el.dir = entry.dir;
      el.style.letterSpacing = entry.tracking;
      el.textContent = entry.text;
    });
    fitFontSize();
  }

  function showWord(entry, cb, index) {
    wordEls.forEach((el) => el.classList.remove("show"));
    setText(entry);

    if (index === 0) {
      requestAnimationFrame(() =>
        tickerMasks.forEach((t) => t.classList.add("show")),
      );
    }

    const fade = Math.max(50, Math.round(entry.duration * 0.3));
    const hold = Math.max(0, entry.duration - fade * 2);
    wordEls.forEach((el) => (el.style.transitionDuration = fade + "ms"));

    requestAnimationFrame(() => {
      requestAnimationFrame(() =>
        wordEls.forEach((el) => el.classList.add("show")),
      );
    });

    setTimeout(() => {
      if (entry.isLast) {
        cb();
      } else {
        wordEls.forEach((el) => el.classList.remove("show"));
        setTimeout(cb, fade);
      }
    }, fade + hold);
  }

  function runSequence(i) {
    if (i >= WORDS.length) return;
    showWord(
      WORDS[i],
      () => {
        if (WORDS[i].isLast) {
          tickerMasks.forEach((t) => t.classList.remove("show"));
          divider.classList.add("grow");
          // Teks terakhir dipastikan tetap terlihat (show) lalu tirai mulai dibelah
          setTimeout(startSplit, reducedMotion ? 150 : 350);
        } else {
          runSequence(i + 1);
        }
      },
      i,
    );
  }

  function startSplit() {
    const splitDuration = reducedMotion ? 300 : 1000;
    curtainLeft.classList.add("open");
    curtainRight.classList.add("open");

    setTimeout(() => divider.classList.add("fade"), splitDuration * 0.5);

    setTimeout(() => {
      loader.style.display = "none";
    }, splitDuration + 80);
  }

  window.addEventListener("resize", fitFontSize);

  requestAnimationFrame(() => runSequence(0));
})();
// ================= REVEAL ON SCROLL (INTERSECTION OBSERVER) =================
document.addEventListener("DOMContentLoaded", () => {
  const revealTargets = [
    ["#about .text-about", 100],
    ["#tools .tools-showcase", 80],
    ["#tools .skills-bar-container", 220],
    ["#project h1", 80],
    ["#project .projects-container", 220],
    ["#contact .text-contact", 100],
    ["#contact .social", 220],
    ["#contact-footer .footer-content", 140],
  ]
    .map(([selector, delay]) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", `${delay}ms`);
      return element;
    })
    .filter(Boolean);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealTargets.forEach((target) => scrollObserver.observe(target));
});

const scrollContainer = document.querySelector("[data-scroll-container]");
const liquidDock = document.querySelector(".liquid-dock");
const liquidDockShell = document.querySelector(".liquid-dock-shell");
const liquidTabs = Array.from(document.querySelectorAll(".liquid-tab"));
const liquidPath = document.querySelector(".liquid-path");
const liquidBubble = document.querySelector(".liquid-bubble");
const liquidBubbleIcons = document.querySelector(".liquid-bubble-icons");
const liquidLabel = document.querySelector(".liquid-label");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const fixedElements = [document.getElementById("loader"), liquidDockShell];

fixedElements.forEach((element) => {
  if (element) document.body.appendChild(element);
});

let locomotiveScroll = null;
if (scrollContainer && window.LocomotiveScroll) {
  locomotiveScroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: !prefersReducedMotion,
    lerp: 0.16,
    smartphone: { smooth: false },
    tablet: { smooth: false },
  });
}

if (liquidDock && liquidTabs.length) {
  const dockHeight = 78;
  const dockCorner = 20;
  const notchDepth = 34;
  let dockWidth = 0;
  let dockX = 0;
  let targetX = 0;
  let springVelocity = 0;
  let lastFrameTime = 0;
  let activeTabIndex = Math.max(
    0,
    liquidTabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"),
  );
  let springFrame = 0;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function tabCenter(index) {
    const dockBounds = liquidDock.getBoundingClientRect();
    const tabBounds = liquidTabs[index].getBoundingClientRect();
    return tabBounds.left + tabBounds.width / 2 - dockBounds.left;
  }

  function createDockPath(center, depth) {
    const safeCenter = clamp(
      center,
      dockCorner + 4,
      dockWidth - dockCorner - 4,
    );
    const halfWidth = Math.max(
      10,
      Math.min(
        46,
        safeCenter - dockCorner - 2,
        dockWidth - dockCorner - safeCenter - 2,
      ),
    );
    const currentDepth = clamp(depth, 8, notchDepth);
    const left = safeCenter - halfWidth;
    const right = safeCenter + halfWidth;
    const control = halfWidth * 0.52;

    return [
      `M ${dockCorner} 0`,
      `H ${left.toFixed(2)}`,
      `C ${(left + control).toFixed(2)} 0 ${(safeCenter - control).toFixed(2)} ${currentDepth.toFixed(2)} ${safeCenter.toFixed(2)} ${currentDepth.toFixed(2)}`,
      `C ${(safeCenter + control).toFixed(2)} ${currentDepth.toFixed(2)} ${(right - control).toFixed(2)} 0 ${right.toFixed(2)} 0`,
      `H ${(dockWidth - dockCorner).toFixed(2)}`,
      `Q ${dockWidth} 0 ${dockWidth} ${dockCorner}`,
      `V ${dockHeight - dockCorner}`,
      `Q ${dockWidth} ${dockHeight} ${dockWidth - dockCorner} ${dockHeight}`,
      `H ${dockCorner}`,
      `Q 0 ${dockHeight} 0 ${dockHeight - dockCorner}`,
      `V ${dockCorner}`,
      `Q 0 0 ${dockCorner} 0 Z`,
    ].join(" ");
  }

  function drawDock(speed = 0) {
    const movement = clamp(speed / 620, 0, 1);
    const depth = notchDepth - movement * 18;
    const horizontalStretch = 1 + movement * 0.14;
    const verticalDrop = movement * 12;
    liquidPath.setAttribute("d", createDockPath(dockX, depth));
    liquidBubble.style.left = `${dockX}px`;
    liquidBubble.style.transform = `translate(-50%, ${verticalDrop}px) scaleX(${horizontalStretch})`;
    liquidLabel.style.left = `${dockX}px`;
  }

  function springFrameLoop(time) {
    if (!lastFrameTime) lastFrameTime = time;
    const delta = Math.min((time - lastFrameTime) / 1000, 0.032);
    lastFrameTime = time;

    const acceleration = 190 * (targetX - dockX) - 18 * springVelocity;
    springVelocity += acceleration * delta;
    dockX += springVelocity * delta;

    if (Math.abs(targetX - dockX) < 0.08 && Math.abs(springVelocity) < 0.8) {
      dockX = targetX;
      springVelocity = 0;
      springFrame = 0;
      drawDock();
      return;
    }

    drawDock(Math.abs(springVelocity));
    springFrame = requestAnimationFrame(springFrameLoop);
  }

  function moveDock() {
    if (prefersReducedMotion) {
      dockX = targetX;
      springVelocity = 0;
      drawDock();
      return;
    }
    if (!springFrame) {
      lastFrameTime = 0;
      springFrame = requestAnimationFrame(springFrameLoop);
    }
  }

  function swapDockIcon(tab, first = false) {
    const nextIcon = tab.querySelector("svg").cloneNode(true);
    nextIcon.setAttribute("aria-hidden", "true");

    if (first || !liquidBubbleIcons.firstElementChild) {
      liquidBubbleIcons.replaceChildren(nextIcon);
      return;
    }

    const currentIcon = liquidBubbleIcons.lastElementChild;
    if (currentIcon) {
      currentIcon.classList.remove("icon-enter");
      currentIcon.classList.add("icon-exit");
      window.setTimeout(() => currentIcon.remove(), 210);
    }
    nextIcon.classList.add("icon-enter");
    liquidBubbleIcons.appendChild(nextIcon);
  }

  function activateTab(index, moveFocus = false, scrollToSection = true) {
    const nextIndex = (index + liquidTabs.length) % liquidTabs.length;
    const nextTab = liquidTabs[nextIndex];
    if (moveFocus) nextTab.focus();
    if (nextIndex === activeTabIndex) return;

    activeTabIndex = nextIndex;
    liquidTabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === activeTabIndex;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    targetX = tabCenter(activeTabIndex);
    liquidLabel.textContent = nextTab.getAttribute("aria-label");
    liquidLabel.classList.remove("is-visible");
    requestAnimationFrame(() => liquidLabel.classList.add("is-visible"));
    swapDockIcon(nextTab);
    moveDock();

    const target = document.getElementById(nextTab.dataset.section);
    if (scrollToSection && target) {
      if (locomotiveScroll) locomotiveScroll.scrollTo(target);
      else {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    }
  }

  function syncDockToScroll() {
    const marker = window.innerHeight * 0.4;
    let visibleSection = null;
    let nearestSection = null;
    let nearestDistance = Infinity;

    liquidTabs.forEach((tab) => {
      const section = document.getElementById(tab.dataset.section);
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      if (bounds.top <= marker && bounds.bottom > marker) {
        visibleSection = section;
      }

      const distance =
        marker < bounds.top ? bounds.top - marker : marker - bounds.bottom;
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestSection = section;
      }
    });

    visibleSection ??= nearestSection;

    const visibleIndex = liquidTabs.findIndex(
      (tab) => tab.dataset.section === visibleSection.id,
    );
    if (visibleIndex !== -1 && visibleIndex !== activeTabIndex) {
      activateTab(visibleIndex, false, false);
    }
  }

  function resizeDock() {
    const nextWidth = liquidDock.clientWidth;
    const nextHeight = liquidDock.clientHeight;
    if (nextWidth === dockWidth && nextHeight === dockHeight) return;
    dockWidth = nextWidth;
    liquidDock
      .querySelector(".liquid-shape")
      .setAttribute("viewBox", `0 0 ${dockWidth} ${nextHeight}`);
    targetX = tabCenter(activeTabIndex);
    dockX = targetX;
    springVelocity = 0;
    if (springFrame) cancelAnimationFrame(springFrame);
    springFrame = 0;
    drawDock();
  }

  liquidTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(index));
    tab.addEventListener("pointerdown", () =>
      liquidBubble.classList.add("is-pressed"),
    );
    ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
      tab.addEventListener(eventName, () =>
        liquidBubble.classList.remove("is-pressed"),
      );
    });
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      activateTab(index + direction, true);
    });
  });

  new ResizeObserver(resizeDock).observe(liquidDock);
  window.addEventListener("resize", resizeDock, { passive: true });
  if (locomotiveScroll) {
    locomotiveScroll.on("scroll", syncDockToScroll);
  } else {
    window.addEventListener("scroll", syncDockToScroll, { passive: true });
  }
  swapDockIcon(liquidTabs[activeTabIndex], true);
  resizeDock();
  syncDockToScroll();
}
