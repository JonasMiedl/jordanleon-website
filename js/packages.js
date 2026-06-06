// ===== Coaching-Pakete =====
// Preise & Features hier anpassen – alles Weitere (Karten, Rabatt-Umrechnung)
// wird automatisch daraus generiert.

const PRICING_CONFIG = {
  // Laufzeiten-Toggle: Rabatt als Dezimalwert (0.10 = -10 %)
  terms: [
    { id: 'monatlich', label: 'Monatlich', discount: 0 },
    { id: '3monate', label: '3 Monate', discountLabel: '−10 %', discount: 0.10 },
    { id: '6monate', label: '6 Monate', discountLabel: '−15 %', discount: 0.15 },
  ],

  packages: [
    {
      name: 'STARTER',
      basePrice: 89, // €/Monat inkl. MwSt.
      target: 'Für den sauberen Einstieg.',
      popular: false,
      cta: 'Jetzt starten',
      features: [
        'Individueller Trainingsplan',
        'Grundlegender Ernährungsleitfaden',
        'Monatliche Plan-Anpassung',
        'Support per Chat (Antwort innerhalb 48h)',
      ],
    },
    {
      name: 'PRO',
      basePrice: 149,
      target: 'Für sichtbare Ergebnisse – und zwar richtig.',
      popular: true,
      cta: 'Platz sichern',
      features: [
        'Individueller Trainingsplan',
        'Maßgeschneiderter Ernährungsplan',
        'Wöchentliche Check-ins',
        'Persönlicher Support per Chat (Antwort innerhalb 24h)',
        'Übungsvideos & Technik-Feedback',
      ],
    },
    {
      name: 'ELITE',
      basePrice: 249,
      target: 'Maximale Betreuung. Dein Ziel, mein Fokus.',
      popular: false,
      cta: 'Platz sichern',
      features: [
        'Alles aus PRO',
        '24/7 persönlicher Support',
        'Wöchentliche 1:1 Video-Calls',
        'Laufende Plan-Anpassung in Echtzeit',
        'Priorisiertes Feedback',
      ],
    },
  ],
};

// ----- Rendering (ab hier nichts anpassen) -----

const formatPrice = (value) => {
  const rounded = Math.round(value * 100) / 100;
  return rounded.toLocaleString('de-DE', {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  }) + ' €';
};

const pricingGrid = document.getElementById('pricingGrid');
const pricingToggle = document.getElementById('pricingToggle');

if (pricingGrid && pricingToggle) {
  let activeTerm = PRICING_CONFIG.terms[0];

  // Toggle-Buttons erzeugen
  PRICING_CONFIG.terms.forEach((term, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pricing__term' + (i === 0 ? ' is-active' : '');
    btn.setAttribute('aria-pressed', String(i === 0));
    btn.innerHTML = term.discountLabel
      ? `${term.label} <span class="pricing__discount">${term.discountLabel}</span>`
      : term.label;
    btn.addEventListener('click', () => {
      activeTerm = term;
      pricingToggle.querySelectorAll('.pricing__term').forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      updatePrices();
    });
    pricingToggle.appendChild(btn);
  });

  // Karten erzeugen
  PRICING_CONFIG.packages.forEach((pkg) => {
    const card = document.createElement('article');
    card.className = 'plan reveal' + (pkg.popular ? ' plan--popular' : '');
    card.innerHTML = `
      ${pkg.popular ? '<span class="plan__badge">Beliebt</span>' : ''}
      <h3 class="plan__name">${pkg.name}</h3>
      <p class="plan__price">
        <s class="plan__old" hidden></s>
        <span class="plan__amount" data-base="${pkg.basePrice}">${formatPrice(pkg.basePrice)}</span>
        <span class="plan__period">/ Monat</span>
      </p>
      <p class="plan__tax">inkl. MwSt.</p>
      <p class="plan__target">${pkg.target}</p>
      <ul class="plan__features">
        ${pkg.features.map((f) => `<li>${f}</li>`).join('')}
      </ul>
      <a href="#kontakt" class="btn plan__cta" aria-label="${pkg.name}-Paket anfragen: ${pkg.cta}">${pkg.cta}</a>
    `;
    pricingGrid.appendChild(card);
  });

  // Preise gemäß gewählter Laufzeit aktualisieren
  function updatePrices() {
    pricingGrid.querySelectorAll('.plan__price').forEach((priceEl) => {
      const amountEl = priceEl.querySelector('.plan__amount');
      const oldEl = priceEl.querySelector('.plan__old');
      const base = parseFloat(amountEl.dataset.base);
      const discounted = base * (1 - activeTerm.discount);
      amountEl.textContent = formatPrice(discounted);
      if (activeTerm.discount > 0) {
        oldEl.textContent = formatPrice(base);
        oldEl.hidden = false;
      } else {
        oldEl.hidden = true;
      }
    });
  }
}
