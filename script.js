// Grundfunktionen: Lightbox, Hover Tilt, Scroll reveal, Tastatursteuerung
(() => {
  const gallery = document.getElementById('gGallery');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lb-image');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.querySelector('.lb-close');
  const lbPrev = document.querySelector('.lb-prev');
  const lbNext = document.querySelector('.lb-next');

  let currentIndex = 0;

  // sichere Anzeige, falls Bilder fehlen: setze Platzhalter
  items.forEach((btn, i) => {
    const img = btn.querySelector('img');
    img.addEventListener('error', () => {
      img.src = 'https://via.placeholder.com/800x600?text=Bild+nicht+gefunden';
    });

    // Klick öffnet Lightbox
    btn.addEventListener('click', () => openLightbox(i));
    // Enter/Space öffnen ebenfalls durch Button automatisch

    // kleine Tilt-Effekt-Implementierung
    btn.addEventListener('mousemove', (ev) => {
      const rect = btn.getBoundingClientRect();
      const x = (ev.clientX - rect.left) / rect.width;
      const y = (ev.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * -8; // vertikale Neigung
      const tiltY = (x - 0.5) * 8;  // horizontale Neigung
      btn.style.setProperty('--tiltX', `${tiltX}deg`);
      btn.style.setProperty('--tiltY', `${tiltY}deg`);
      btn.classList.add('tilt');
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('--tiltX', `0deg`);
      btn.style.setProperty('--tiltY', `0deg`);
      btn.classList.remove('tilt');
    });
  });

  function openLightbox(index) {
    const srcImg = items[index].querySelector('img');
    const caption = items[index].dataset.caption || srcImg.alt || '';
    lbImage.src = srcImg.src;
    lbImage.alt = srcImg.alt || 'Kupfergolem';
    lbCaption.textContent = caption;
    lightbox.setAttribute('aria-hidden', 'false');
    currentIndex = index;
    // Fokus setzen für Tastaturnavigation
    lbClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    lbImage.src = '';
    lbCaption.textContent = '';
    document.body.style.overflow = '';
  }

  function showIndex(index) {
    const len = items.length;
    if (len === 0) return;
    const next = ((index % len) + len) % len;
    openLightbox(next);
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => showIndex(currentIndex - 1));
  lbNext.addEventListener('click', () => showIndex(currentIndex + 1));

  // Overlay click: schließen wenn auf Hintergrund geklickt
  lightbox.addEventListener('click', (ev) => {
    if (ev.target === lightbox) closeLightbox();
  });

  // Tastatursteuerung
  window.addEventListener('keydown', (ev) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (ev.key === 'Escape') closeLightbox();
      if (ev.key === 'ArrowLeft') showIndex(currentIndex - 1);
      if (ev.key === 'ArrowRight') showIndex(currentIndex + 1);
    } else {
      // galerie keyboard: Enter und Space handled by button; Tab naturally cycles
    }
  });

  // Scroll reveal mittels IntersectionObserver
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transition = 'transform 600ms cubic-bezier(.2,.9,.2,1), opacity 600ms';
        e.target.style.transform = 'translateY(0)';
        e.target.style.opacity = '1';
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});

  // initial set invisible and translate
  document.querySelectorAll('.gallery-item, .features, .about, .section-title, .hero-inner').forEach(el => {
    el.style.transform = 'translateY(18px)';
    el.style.opacity = '0';
    io.observe(el);
  });

  // kleine Hilfsfunktion: falls die Seite keine Bilder findet, ersetze durch Platzhalter
  // (bereits handled via img error)
})();
