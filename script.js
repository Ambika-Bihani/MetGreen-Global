const loader = document.getElementById("page-loader");

function showLoader() {
  loader.classList.add("visible");
}

document.querySelectorAll("a[href]").forEach((link) => {
  const href = link.getAttribute("href");
  if (
    href &&
    !href.startsWith("#") &&
    !href.startsWith("mailto:") &&
    !href.startsWith("tel:") &&
    !href.startsWith("javascript:")
  ) {
    link.addEventListener("click", (e) => {
      const url = new URL(link.href, location.href);
      if (url.hostname === location.hostname) {
        showLoader();
      }
    });
  }
});

window.addEventListener("load", () => {
  loader.classList.remove("visible");
});

window.addEventListener("pageshow", (e) => {
  if (e.persisted) loader.classList.remove("visible");
});

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".primary-nav");
const quoteForm = document.querySelector("#quote-form");
const formStatus = document.querySelector(".form-status");
const slides = [...document.querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll("[data-dot]")];
const arrows = [...document.querySelectorAll("[data-direction]")];
let activeSlide = 0;
let slideTimer;

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    if (isActive) {
      slide.classList.remove("active");
      void slide.offsetWidth; // force reflow to restart animation
    }
    slide.classList.toggle("active", isActive);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeSlide);
  });
}

function restartSlider() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(activeSlide + 1), 6000);
}

arrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    showSlide(activeSlide + Number(arrow.dataset.direction));
    restartSlider();
  });
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.dot));
    restartSlider();
  });
});

if (slides.length) {
  restartSlider();
}

if (quoteForm && formStatus) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = quoteForm.elements.email.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formStatus.textContent = "Please enter a valid email address.";
      return;
    }

    formStatus.textContent = "Thank you. Your enquiry is ready to connect to email or backend storage.";
    quoteForm.reset();
  });
}

// Footer "Let's Connect" query box — this is a static site with no backend
// to receive submissions, so the form hands the visitor's free-text query
// off to their own email client, addressed to the team inbox, rather than
// silently doing nothing (the previous onsubmit="return false;").
const QUERY_INBOX = "metgreenglobalfze@gmail.com";
document.querySelectorAll(".footer-newsletter-form").forEach((form) => {
  const queryInput = form.querySelector("input");
  if (!queryInput) return;

  let status = form.querySelector(".newsletter-status");
  if (!status) {
    status = document.createElement("p");
    status.className = "newsletter-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    form.insertAdjacentElement("afterend", status);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = queryInput.value.trim();

    if (!query) {
      status.textContent = "Please enter your query.";
      return;
    }

    const subject = encodeURIComponent("Website Query: MetGreen Global");
    const body = encodeURIComponent(query);
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${QUERY_INBOX}&su=${subject}&body=${body}`;
    window.open(gmailComposeUrl, "_blank", "noopener,noreferrer");

    status.textContent = "Opening Gmail to send this to our team…";
    form.reset();
  });
});
