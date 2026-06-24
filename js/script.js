const sections = Array.from(document.querySelectorAll("main section[id], footer#contato"));
const navLinks = Array.from(document.querySelectorAll(".top-links a"));
const contactForm = document.querySelector(".contact-form");
const carousel = document.querySelector(".feature-carousel");
const carouselCards = carousel ? Array.from(carousel.querySelectorAll(".carousel-card")) : [];

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", active);
  });
};

const setCarouselState = (activeIndex = 0) => {
  if (!carouselCards.length) return;

  const total = carouselCards.length;
  const index = ((activeIndex % total) + total) % total;

  carouselCards.forEach((card, cardIndex) => {
    card.classList.remove(
      "carousel-card-far-left",
      "carousel-card-left",
      "carousel-card-center",
      "carousel-card-right",
      "carousel-card-far-right",
      "is-hidden"
    );

    const diff = (cardIndex - index + total) % total;

    if (diff === 0) {
      card.classList.add("carousel-card-center");
    } else if (diff === 1) {
      card.classList.add("carousel-card-right");
    } else if (diff === 2) {
      card.classList.add("carousel-card-far-right");
    } else if (diff === total - 1) {
      card.classList.add("carousel-card-left");
    } else if (diff === total - 2) {
      card.classList.add("carousel-card-far-left");
    } else {
      card.classList.add("is-hidden");
    }
  });
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveLink(visible.target.id);
      }
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5],
    }
  );

  sections.forEach((section) => observer.observe(section));
} else {
  setActiveLink("inicio");
}

setActiveLink("inicio");

if (carouselCards.length) {
  let currentIndex = 0;
  let autoplayId = null;
  let paused = false;

  const advanceCarousel = () => {
    currentIndex = (currentIndex + 1) % carouselCards.length;
    setCarouselState(currentIndex);
  };

  const startAutoplay = () => {
    if (autoplayId || carouselCards.length < 2) return;
    autoplayId = window.setInterval(() => {
      if (!paused) {
        advanceCarousel();
      }
    }, 3200);
  };

  const stopAutoplay = () => {
    if (!autoplayId) return;
    window.clearInterval(autoplayId);
    autoplayId = null;
  };

  setCarouselState(currentIndex);
  startAutoplay();

  carousel.addEventListener("mouseenter", () => {
    paused = true;
  });

  carousel.addEventListener("mouseleave", () => {
    paused = false;
  });

  carousel.addEventListener("focusin", () => {
    paused = true;
  });

  carousel.addEventListener("focusout", () => {
    paused = false;
  });

  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
  });

  window.addEventListener("beforeunload", stopAutoplay);
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button");
  if (!button) return;

  const originalText = button.textContent;
  button.textContent = "Enviado!";
  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    contactForm.reset();
  }, 1600);
});
