const toggleBtn = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#navLinks");

if (toggleBtn && navLinks) {
  toggleBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // Close on link click
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => io.observe(el));

// ---------- Scroll spy active links ----------
const sections = ["inicio", "proyectos", "sobremi", "certificados", "contacto"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navItems = document.querySelectorAll(".nav-link-item");

function setActiveLink() {
  const y = window.scrollY + 120;
  let current = "inicio";

  sections.forEach((sec) => {
    if (sec.offsetTop <= y) current = sec.id;
  });

  navItems.forEach((a) => {
    const href = a.getAttribute("href");
    const id = href?.startsWith("#") ? href.slice(1) : "";
    a.classList.toggle("active", id === current);
  });
}

window.addEventListener("scroll", setActiveLink);
setActiveLink();

// ---------- Typewriter ----------
function typewriter(el, text, speed = 18) {
  let i = 0;
  el.textContent = "";
  const tick = () => {
    el.textContent += text[i] || "";
    i++;
    if (i <= text.length) requestAnimationFrame(() => setTimeout(tick, speed));
  };
  tick();
}

const tw = document.querySelector(".typewriter");
if (tw) typewriter(tw, tw.dataset.text || "");

// ---------- WhatsApp quick send + copy ----------
const msg = document.getElementById("msg");
const copyBtn = document.getElementById("copyMsg");
const sendWp = document.getElementById("sendWp");

function buildWpLink(text) {
  const phone = "573209025487";
  const encoded = encodeURIComponent(text.trim());
  return `https://wa.me/${phone}?text=${encoded}`;
}

if (sendWp && msg) {
  sendWp.href = buildWpLink(msg.value);

  msg.addEventListener("input", () => {
    sendWp.href = buildWpLink(msg.value);
  });
}

if (copyBtn && msg) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(msg.value);
      copyBtn.innerHTML = 'Copiado <i class="bi bi-check2"></i>';
      setTimeout(() => {
        copyBtn.innerHTML = 'Copiar <i class="bi bi-clipboard"></i>';
      }, 1300);
    } catch (e) {
      alert("No se pudo copiar. Intenta manualmente.");
    }
  });
}

// ---------- Certificates modal ----------
const certModal = document.getElementById("certModal");
const certModalImg = document.getElementById("certModalImg");

document.querySelectorAll("[data-cert]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-cert");
    if (!src) return;
    certModalImg.src = src;
    certModal.classList.add("show");
    certModal.setAttribute("aria-hidden", "false");
  });
});

if (certModal) {
  certModal.addEventListener("click", (e) => {
    const close = e.target.closest("[data-close='true']");
    if (close) {
      certModal.classList.remove("show");
      certModal.setAttribute("aria-hidden", "true");
      certModalImg.src = "";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && certModal.classList.contains("show")) {
      certModal.classList.remove("show");
      certModal.setAttribute("aria-hidden", "true");
      certModalImg.src = "";
    }
  });
}

// ---------- Lightweight particles (no libs) ----------
const canvas = document.getElementById("particles");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const particles = Array.from({ length: prefersReduce ? 0 : 48 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 1 + Math.random() * 2.2,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    a: 0.25 + Math.random() * 0.35,
  }));

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // dots
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(208,139,241,${p.a})`;
      ctx.fill();
    }

    // lines (subtle)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.strokeStyle = `rgba(208,139,241,${(1 - d / 120) * 0.12})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  if (!prefersReduce) draw();
}

