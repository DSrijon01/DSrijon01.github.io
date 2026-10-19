/**
 * Srijon Biswas - Portfolio Interactive Scripts
 * Handles Theme Toggling, Typewriter Effect, Project Filtering, Modals, and Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('srijon_portfolio_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('srijon_portfolio_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fas fa-sun';
      } else {
        themeIcon.className = 'fas fa-moon';
      }
    }
  }

  // --------------------------------------------------------------------------
  // 2. Typewriter Effect in Hero
  // --------------------------------------------------------------------------
  const typingElement = document.getElementById('typingText');
  if (typingElement) {
    const roles = [
      "Software Engineer (SDET) & Quant Analyst",
      "MBA in Finance Candidate @ AIT Thailand",
      "Financial Analysis & Valuation (DCF)",
      "Fin-Tech & Health-Tech Specialist",
      "Statistical & Quantitative Modeling",
      "Unity 3D / 2D Game Developer"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingDelay = 85;
    const deletingDelay = 45;
    const pauseDelay = 1800;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeout = isDeleting ? deletingDelay : typingDelay;

      if (!isDeleting && charIndex === currentRole.length) {
        timeout = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeout = 400;
      }

      setTimeout(typeLoop, timeout);
    }

    typeLoop();
  }

  // --------------------------------------------------------------------------
  // 3. Project Filtering
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4. Project Details Modal
  // --------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTechStack = document.getElementById('modalTechStack');
  const modalCodeBtn = document.getElementById('modalCodeBtn');
  const modalLiveBtn = document.getElementById('modalLiveBtn');

  const detailButtons = document.querySelectorAll('.btn-details');

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      if (!card) return;

      const title = card.querySelector('.project-title')?.textContent || '';
      const fullDesc = card.getAttribute('data-full-desc') || card.querySelector('.project-description')?.textContent || '';
      const thumbSrc = card.querySelector('.project-thumb')?.getAttribute('src') || '';
      const techTags = card.querySelectorAll('.tech-tag');
      const codeLink = card.getAttribute('data-code-url') || '';
      const liveLink = card.getAttribute('data-live-url') || '';

      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = fullDesc;
      if (modalImage) modalImage.src = thumbSrc;

      if (modalTechStack) {
        modalTechStack.innerHTML = '';
        techTags.forEach(tag => {
          const span = document.createElement('span');
          span.className = 'tech-tag';
          span.textContent = tag.textContent;
          modalTechStack.appendChild(span);
        });
      }

      if (modalCodeBtn) {
        if (codeLink) {
          modalCodeBtn.href = codeLink;
          modalCodeBtn.style.display = 'inline-flex';
        } else {
          modalCodeBtn.style.display = 'none';
        }
      }

      if (modalLiveBtn) {
        if (liveLink) {
          modalLiveBtn.href = liveLink;
          modalLiveBtn.style.display = 'inline-flex';
        } else {
          modalLiveBtn.style.display = 'none';
        }
      }

      if (modalBackdrop) modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('open')) {
      closeModal();
    }
  });

  // --------------------------------------------------------------------------
  // 5. One-Click Copy Email & Toast Notification
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toastNotice = document.getElementById('toastNotice');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'srijonbiswas17@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard!');
      }).catch(() => {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('Email copied to clipboard!');
      });
    });
  }

  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.querySelector('.toast-msg').textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 6. Mobile Menu Toggle
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close menu when link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. Active Scroll-Spy for Navbar Links
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 8. Back to Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
