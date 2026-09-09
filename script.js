(function () {
  const WORDS = [
    { text: "Welcome", dir: "ltr", tracking: "-0.02em", duration: 500 },
    { text: "مرحباً", dir: "ltr", tracking: "-0.01em", duration: 380 },
    { text: "Bienvenue", dir: "ltr", tracking: "-0.02em", duration: 300 },
    { text: "Willkommen", dir: "ltr", tracking: "-0.02em", duration: 240 },
    { text: "Bienvenido", dir: "ltr", tracking: "-0.02em", duration: 190 },
    { text: "Benvenuto", dir: "ltr", tracking: "-0.02em", duration: 150 },
    { text: "selamat datang", dir: "ltr", tracking: "0.05em", duration: 120 },
    { text: "환영합니다", dir: "ltr", tracking: "0.02em", duration: 100 },
    { text: "欢迎", dir: "ltr", tracking: "0.08em", duration: 90 },
    {
      text: "ようこそ",
      dir: "rtl",
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
const hero = document.querySelector(".hero-section");
const glow = document.querySelector(".cursor-glow");

hero.addEventListener("mousemove", (e) => {
  // Mengambil posisi kursor relatif terhadap elemen hero
  const rect = hero.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Mengirim koordinat ke CSS
  glow.style.setProperty("--x", `${x}px`);
  glow.style.setProperty("--y", `${y}px`);
});
const footerHero = document.querySelector(".footer-hero");
const footerGlow = document.getElementById("footerGlow");

if (footerHero && footerGlow) {
  footerHero.addEventListener("mousemove", (e) => {
    const rect = footerHero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    footerGlow.style.setProperty("--x", `${x}px`);
    footerGlow.style.setProperty("--y", `${y}px`);
  });
}
// ================= REVEAL ON SCROLL (INTERSECTION OBSERVER) =================
document.addEventListener("DOMContentLoaded", () => {
  // Target elemen yang akan diberi animasi saat di-scroll
  const animatedTargets = document.querySelectorAll(
    ".spinner-container, .skill-item, .project-card, #contact",
  );

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2, // Elemen mulai dianimasikan jika 20% bagiannya sudah terlihat di layar
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Tambahkan class 'in-view' untuk memicu animasi CSS
        entry.target.classList.add("in-view");
        // Hentikan pantauan agar animasi hanya berjalan 1 kali saat pertama di-scroll
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedTargets.forEach((target) => scrollObserver.observe(target));
});
