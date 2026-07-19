// Main JS entrypoint for the Medical Landing Page

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
