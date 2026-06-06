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

// Transformationen: Karten ohne Bild ausblenden, Sektion verstecken wenn leer
const transformationsSection = document.getElementById('transformationen');

if (transformationsSection) {
  const cards = transformationsSection.querySelectorAll('.transformation');
  let missing = 0;

  const hideSectionIfEmpty = () => {
    if (missing === cards.length) {
      transformationsSection.style.display = 'none';
      const navLink = document.querySelector('[data-nav="transformationen"]');
      if (navLink) navLink.style.display = 'none';
    }
  };

  cards.forEach((card) => {
    const img = card.querySelector('img');
    img.addEventListener('error', () => {
      card.remove();
      missing++;
      hideSectionIfEmpty();
    });
  });
}

// Partner-Codes kopieren
document.querySelectorAll('.sponsor__copy').forEach((btn) => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.code);
      btn.textContent = '✓ Kopiert';
      btn.classList.add('is-copied');
      setTimeout(() => {
        btn.textContent = 'Kopieren';
        btn.classList.remove('is-copied');
      }, 2000);
    } catch {
      // Fallback: Code markieren lassen
      btn.textContent = btn.dataset.code;
    }
  });
});

// Newsletter-Anmeldung
// TODO: Brevo-Formular-URL eintragen (Brevo → Kontakte → Formulare → Formular erstellen
// → "Teilen"-Tab → Link kopieren). Solange die URL leer ist, wird ein Hinweis angezeigt.
const NEWSLETTER_FORM_ACTION = '';

const newsletterForm = document.getElementById('newsletterForm');
const newsletterMsg = document.getElementById('newsletterMsg');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    newsletterMsg.className = 'newsletter__msg';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newsletterMsg.textContent = 'Bitte gib eine gültige E-Mail-Adresse ein.';
      newsletterMsg.classList.add('is-error');
      return;
    }

    if (!NEWSLETTER_FORM_ACTION) {
      newsletterMsg.textContent =
        'Die Newsletter-Anmeldung startet in Kürze – folge mir solange auf Instagram @jordan__leon!';
      newsletterMsg.classList.add('is-ok');
      newsletterForm.reset();
      return;
    }

    try {
      const data = new FormData();
      data.append('EMAIL', email);
      await fetch(NEWSLETTER_FORM_ACTION, { method: 'POST', body: data, mode: 'no-cors' });
      newsletterMsg.textContent = 'Fast geschafft! Bitte bestätige die E-Mail in deinem Postfach.';
      newsletterMsg.classList.add('is-ok');
      newsletterForm.reset();
    } catch {
      newsletterMsg.textContent = 'Etwas ist schiefgelaufen – bitte versuch es später erneut.';
      newsletterMsg.classList.add('is-error');
    }
  });
}
