
/* =========================================
   JAYDEN'S MATRIX PORTFOLIO
   Vanilla JavaScript
========================================= */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* =====================================
     1. MATRIX BACKGROUND
  ===================================== */

  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas?.getContext('2d');
  const hero = document.getElementById('home');

  let columns = [];
  let fontSize = 14;
  let frame = null;
  let matrixRunning = false;

  const glyphs =
    '01アイウエオカキクケコサシスセソ<>[]{}#$%&';

  function isMatrixAreaActive() {
    if (!hero) return window.scrollY < window.innerHeight;

    const heroBottom = hero.offsetTop + hero.offsetHeight;

    // Stop before the Home section ends.
    return window.scrollY < heroBottom - 100;
  }

  function resizeMatrix() {
    if (!canvas || !ctx) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    fontSize = window.innerWidth < 600 ? 12 : 14;

    columns = Array.from(
      { length: Math.ceil(window.innerWidth / fontSize) },
      () => Math.random() * (window.innerHeight / fontSize)
    );
  }

  function stopMatrix() {
    if (!canvas || !ctx) return;

    matrixRunning = false;

    if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }

    canvas.style.opacity = '0';

    ctx.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
  }

  function drawMatrix() {
    if (!canvas || !ctx || reduceMotion) {
      stopMatrix();
      return;
    }

    if (document.hidden || !isMatrixAreaActive()) {
      stopMatrix();
      return;
    }

    ctx.fillStyle = 'rgba(5, 11, 8, 0.085)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.font = `${fontSize}px monospace`;

    columns.forEach((y, x) => {
      const glyph =
        glyphs[Math.floor(Math.random() * glyphs.length)];

      ctx.fillStyle =
        Math.random() > 0.975 ? '#caffd6' : '#45ff86';

      ctx.fillText(glyph, x * fontSize, y * fontSize);

      if (
        y * fontSize > window.innerHeight &&
        Math.random() > 0.975
      ) {
        columns[x] = 0;
      } else {
        columns[x] += 0.55;
      }
    });

    frame = requestAnimationFrame(drawMatrix);
  }

  function updateMatrix() {
    if (!canvas || !ctx || reduceMotion) return;

    const shouldRun =
      !document.hidden && isMatrixAreaActive();

    if (!shouldRun) {
      stopMatrix();
      return;
    }

    if (!matrixRunning) {
      matrixRunning = true;
      canvas.style.opacity = '0.17';
      frame = requestAnimationFrame(drawMatrix);
    }
  }

  if (canvas && ctx && !reduceMotion) {
    resizeMatrix();
    updateMatrix();

    window.addEventListener('resize', () => {
      resizeMatrix();
      stopMatrix();
      updateMatrix();
    });

    window.addEventListener('scroll', updateMatrix, {
      passive: true
    });

    document.addEventListener('visibilitychange', updateMatrix);
  }

  /* =====================================
     2. TYPING EFFECT
  ===================================== */

  const typedText = document.getElementById('typed-text');

  const phrases = [
    'Developer',
    'Network Computing Student',
    'IoT Explorer',
    'Problem Solver'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    if (!typedText) return;

    const phrase = phrases[phraseIndex];

    typedText.textContent = phrase.slice(0, charIndex);

    if (!deleting && charIndex < phrase.length) {
      charIndex++;
      setTimeout(typeLoop, 75);
    } else if (!deleting) {
      deleting = true;
      setTimeout(typeLoop, 1400);
    } else if (charIndex > 0) {
      charIndex--;
      setTimeout(typeLoop, 35);
    } else {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, 300);
    }
  }

  if (typedText) {
    if (reduceMotion) {
      typedText.textContent = phrases[0];
    } else {
      typeLoop();
    }
  }

  /* =====================================
     3. PROFILE IMAGE FALLBACK
  ===================================== */

  const profileImage = document.querySelector(
    '#profile-placeholder img'
  );

  const profileFallback = document.getElementById(
    'profile-fallback'
  );

  function showProfileFallback() {
    if (profileImage) {
      profileImage.style.display = 'none';
    }

    if (profileFallback) {
      profileFallback.style.display = 'grid';
    }
  }

  if (profileImage && profileFallback) {
    profileImage.addEventListener('error', showProfileFallback);

    if (profileImage.complete && profileImage.naturalWidth === 0) {
      showProfileFallback();
    }
  }

  /* =====================================
     4. PROJECT IMAGE FALLBACKS
     One image slot for each project.
  ===================================== */

  document.querySelectorAll('.project-image img').forEach(image => {
    const projectImage = image.closest('.project-image');

    function showMissingImage() {
      projectImage?.classList.add('image-missing');
    }

    image.addEventListener('error', showMissingImage);

    if (image.complete && image.naturalWidth === 0) {
      showMissingImage();
    }
  });

  /* =====================================
     5. SCROLL REVEAL
  ===================================== */

  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay =
        `${Math.min(index % 4, 3) * 70}ms`;

      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(item => {
      item.classList.add('visible');
    });
  }

  /* =====================================
     6. MOBILE NAVIGATION
  ===================================== */

  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');

  function closeMenu() {
    nav?.classList.remove('open');
    menuToggle?.classList.remove('active');

    menuToggle?.setAttribute('aria-expanded', 'false');
  }

  menuToggle?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('open') ?? false;

    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });

  /* =====================================
     7. PROJECT FILTERS
  ===================================== */

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(item => {
        item.classList.toggle('active', item === button);
      });

      const filter = button.dataset.filter;

      projectCards.forEach(card => {
        const matches =
          filter === 'all' ||
          card.dataset.category === filter;

        card.classList.toggle('is-hidden', !matches);

        if (matches) {
          card.classList.add('visible');
        }
      });
    });
  });

  /* =====================================
     8. ACTIVE NAVIGATION
  ===================================== */

  const navLinks = [
    ...document.querySelectorAll('.nav-link')
  ];

  const sections = [
    ...document.querySelectorAll('main section[id]')
  ];

  const backTop = document.getElementById('back-top');

  function onScroll() {
    const scrollY = window.scrollY;

    backTop?.classList.toggle('visible', scrollY > 450);

    let current = 'home';

    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 150) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }

  window.addEventListener('scroll', onScroll, {
    passive: true
  });

  window.addEventListener('resize', onScroll);

  onScroll();

  /* =====================================
     9. BACK TO TOP
  ===================================== */

  backTop?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  });

  /* =====================================
     10. ANIMATED COUNTERS
  ===================================== */

  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(node) {
    const target = Number(node.dataset.count) || 0;

    if (reduceMotion) {
      node.textContent = String(target);
      return;
    }

    const start = performance.now();
    const duration = 800;

    function tick(now) {
      const progress = Math.min(
        (now - start) / duration,
        1
      );

      node.textContent = String(
        Math.floor(target * progress)
      );

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(counter => {
      counter.textContent = counter.dataset.count;
    });
  }

  /* =====================================
     11. AUTOMATIC FOOTER YEAR
  ===================================== */

  const year = document.getElementById('year');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

})();
