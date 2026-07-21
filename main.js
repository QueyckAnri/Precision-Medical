// Main JS entrypoint for the Medical Landing Page

// --- CINEMATIC SCROLL BUTTON ---
(function () {
  let running = false;
  let rafId = null;
  let btn = null;

  function isScrollable() {
    return document.documentElement.scrollHeight > window.innerHeight + 4;
  }

  function launchCinematicScroll() {
    if (running) {
      // Second click = abort
      cancelAnimationFrame(rafId);
      running = false;
      rafId = null;
      return;
    }
    if (!isScrollable()) return;
    running = true;

    window.scrollTo({ top: 0, behavior: 'instant' });

    setTimeout(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const duration = Math.max(6000, totalHeight * 2.5);
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        window.scrollTo(0, Math.round(totalHeight * eased));
        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          running = false;
          rafId = null;
        }
      }

      rafId = requestAnimationFrame(step);
    }, 80);
  }

  function injectButton() {
    // Skip on the fixed hero page (index.html) — it has no real scroll
    if (document.querySelector('.hero-root')) return;

    btn = document.createElement('button');
    btn.title = 'Scroll preview';
    btn.setAttribute('aria-label', 'Scroll preview');

    // Inline styles — no class pollution, fully self-contained
    Object.assign(btn.style, {
      position:       'fixed',
      top:            '68px',
      right:          '16px',
      zIndex:         '9999',
      width:          '26px',
      height:         '26px',
      border:         '1px solid rgba(0,0,0,0.12)',
      borderRadius:   '50%',
      background:     'rgba(249,249,249,0.72)',
      backdropFilter: 'blur(6px)',
      cursor:         'pointer',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '0',
      outline:        'none',
      opacity:        '0.45',
      transition:     'opacity 0.2s ease',
      boxShadow:      '0 1px 4px rgba(0,0,0,0.08)',
    });

    // SVG icon — small downward chevron / play arrow
    btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2v8M3 7l3 3 3-3" stroke="rgba(38,35,35,0.55)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    btn.addEventListener('mouseenter', () => { btn.style.opacity = '0.85'; });
    btn.addEventListener('mouseleave', () => { btn.style.opacity = '0.45'; });
    btn.addEventListener('click', launchCinematicScroll);

    document.body.appendChild(btn);
  }

  // Abort on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && running) {
      cancelAnimationFrame(rafId);
      running = false;
      rafId = null;
    }
  });

  // Inject immediately on DOMContentLoaded (button presence doesn't depend on scroll height)
  // and also re-check on load in case it was skipped
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
})();

// --- PAGE TRANSITION ENTRY STATE SETUP ---
const initPageTransition = () => {
  const transitionType = sessionStorage.getItem('page-transition') || 'forward';
  sessionStorage.removeItem('page-transition'); // clear it
  
  const body = document.body;
  if (body) {
    if (transitionType === 'back') {
      body.classList.add('enter-from-top');
    } else {
      body.classList.add('enter-from-bottom');
    }

    // Trigger load state on next frame so transition animates
    requestAnimationFrame(() => {
      void body.offsetWidth;
      body.classList.add('page-loaded');
    });
  }
};

// Run as soon as body is available, or on load
if (document.body) {
  initPageTransition();
} else {
  document.addEventListener('DOMContentLoaded', initPageTransition);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Precision Medical Hero section initialized.');

  // Stat cards interactivity
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach((card) => {
    const dotBtn = card.querySelector('.stat-dots');
    if (dotBtn) {
      dotBtn.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  });

  // Consult button
  const consultBtn = document.getElementById('consult-btn');
  if (consultBtn) {
    consultBtn.addEventListener('click', () => {
      console.log('Consultation requested.');
    });
  }



  // Handle Spline loader hiding
  const splineModel = document.querySelector('.spline-model');
  const splinePlaceholder = document.querySelector('.spline-placeholder');

  if (splineModel) {
    const hidePlaceholder = () => {
      if (splinePlaceholder) {
        splinePlaceholder.style.transition = 'opacity 0.5s ease';
        splinePlaceholder.style.opacity = '0';
        setTimeout(() => { splinePlaceholder.style.display = 'none'; }, 500);
      }
    };

    if (splineModel.tagName.toLowerCase() === 'iframe') {
      splineModel.addEventListener('load', hidePlaceholder);
      // Fallback
      setTimeout(hidePlaceholder, 3000);
    } else {
      // For spline-viewer web component
      splineModel.addEventListener('load', hidePlaceholder);
      setTimeout(hidePlaceholder, 4000);
    }
  }

  // --- PAGE TRANSITION INTERCEPTOR ---
  const transitionLinks = document.querySelectorAll('a');
  transitionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Ignore external, anchor tags, target blank, or modifiers
      if (!href || 
          href.startsWith('http') || 
          href.startsWith('#') || 
          link.getAttribute('target') === '_blank' || 
          e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      // Intercept relative page links
      if (href.endsWith('.html') || href === '/' || href.includes('.html')) {
        e.preventDefault();

        const isGoingHome = href.includes('index.html') || href === './' || href === 'index.html';
        const body = document.body;
        
        if (body) {
          if (isGoingHome) {
            sessionStorage.setItem('page-transition', 'back');
            body.classList.remove('page-loaded');
            body.classList.add('exit-to-bottom');
          } else {
            sessionStorage.setItem('page-transition', 'forward');
            body.classList.remove('page-loaded');
            body.classList.add('exit-to-top');
          }
        }

        setTimeout(() => {
          window.location.href = href;
        }, 550);
      }
    });
  });
});
