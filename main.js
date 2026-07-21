// Main JS entrypoint for the Medical Landing Page

// --- SECRET CINEMATIC SCROLL (trigger: 1 2 3 Enter) ---
(function () {
  const SEQ = ['1', '2', '3', 'Enter'];
  let buf = [];
  let running = false;
  let rafId = null;

  document.addEventListener('keydown', (e) => {
    if (running) return;
    buf.push(e.key);
    if (buf.length > SEQ.length) buf.shift();
    if (buf.join(',') === SEQ.join(',')) {
      buf = [];
      launchCinematicScroll();
    }
  });

  function isScrollable() {
    return document.documentElement.scrollHeight > window.innerHeight + 4;
  }

  // Force-trigger every IntersectionObserver-driven animation
  // by briefly scrolling elements into view before the main scroll,
  // then resetting so they replay naturally as we scroll past them.
  function resetScrollAnimations() {
    // Reset elements that use common "reveal" patterns:
    // classes that start hidden with opacity:0 / translateY / scale
    const candidates = document.querySelectorAll(
      '[class*="reveal"], [class*="fade"], [class*="animate"], [class*="visible"], [class*="scroll-"]'
    );
    candidates.forEach(el => {
      el.style.transition = 'none';
      el.style.animation = 'none';
    });
    // Re-enable after a frame so observers can re-fire
    requestAnimationFrame(() => {
      candidates.forEach(el => {
        el.style.transition = '';
        el.style.animation = '';
      });
    });
  }

  function launchCinematicScroll() {
    if (!isScrollable()) return;
    running = true;

    // Scroll to very top first
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Small delay so page settles at top
    setTimeout(() => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const duration = Math.max(6000, totalHeight * 2.5); // ~2.5ms per px, min 6s
      const startTime = performance.now();
      const startY = 0;

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-in-out cubic for smooth cinematic feel
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const targetY = Math.round(startY + totalHeight * eased);
        window.scrollTo(0, targetY);

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          running = false;
          rafId = null;
        }
      }

      rafId = requestAnimationFrame(step);
    }, 120);
  }

  // Allow Escape to abort
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && running) {
      if (rafId) cancelAnimationFrame(rafId);
      running = false;
      rafId = null;
    }
  });
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
