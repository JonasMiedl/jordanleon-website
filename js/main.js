// ===== Jordan Leon – Fitness Coaching =====

// Sticky-Navigation: Hintergrund beim Scrollen
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile-Menü
const burger = document.getElementById('navBurger');
const links = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const open = links.classList.toggle('is-open');
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
});

// Menü schließen, wenn ein Link geklickt wird
links.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    links.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  })
);

// Reveal-Animationen beim Scrollen
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
