document.addEventListener('DOMContentLoaded', () => {
  // =========================================
  // 1. Dark/Light Theme Switcher
  // =========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set initial theme: check saved, otherwise check system, default to dark
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else if (savedTheme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else if (!systemPrefersDark) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });

  // =========================================
  // 2. Header Scroll Effect
  // =========================================
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // =========================================
  // 3. Mobile Navigation Menu
  // =========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinksContainer.classList.toggle('active');
    });

    // Close menu when clicking links
    const links = navLinksContainer.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinksContainer.classList.remove('active');
      }
    });
  }

  // =========================================
  // 4. Experience Timeline Filtering
  // =========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineContainer = document.querySelector('.timeline-container');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // Animate filter transition
      timelineItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          // Give a tiny timeout for layout recalculation before showing
          setTimeout(() => {
            item.style.display = 'block';
            // Trigger animation fade-in by removing absolute positioning properties if needed
          }, 50);
        } else {
          item.classList.add('hidden');
          setTimeout(() => {
            item.style.display = 'none';
          }, 400); // matches CSS transition duration
        }
      });
      
      // Toggle a class on timeline container for visual cues
      timelineContainer.classList.add('filtering');
      setTimeout(() => {
        timelineContainer.classList.remove('filtering');
      }, 500);
    });
  });

  // =========================================
  // 5. Expandable Experience Details (Accordion)
  // =========================================
  const timelineCards = document.querySelectorAll('.timeline-card');

  timelineCards.forEach(card => {
    const body = card.querySelector('.timeline-card-body');
    
    card.addEventListener('click', (e) => {
      // Don't expand if user clicked a direct external link within the card (if any)
      if (e.target.tagName === 'A') return;

      const isExpanded = card.classList.contains('expanded');
      
      // Close other expanded cards in the same view if preferred, 
      // but standard portfolio details are fine to expand multiple at once.
      
      if (isExpanded) {
        card.classList.remove('expanded');
        body.style.maxHeight = null;
      } else {
        card.classList.add('expanded');
        // Set max-height dynamically to enable smooth transition
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // =========================================
  // 6. Navigation Link Active State on Scroll
  // =========================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 100; // offset for sticky navbar

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // =========================================
  // 7. Contact Form Handling & Validation
  // =========================================
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form inputs
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');
      
      // Simple validation check
      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        alert('Please fill out all required fields.');
        return;
      }
      
      // Change button state to sending
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      // Construct mailto link as fallback since we don't have a backend server
      const subject = encodeURIComponent(`Portfolio Contact from ${nameInput.value}`);
      const bodyText = encodeURIComponent(`Name: ${nameInput.value}\nEmail: ${emailInput.value}\n\nMessage:\n${messageInput.value}`);
      
      // Create temporary link and click it to open mail client
      setTimeout(() => {
        window.location.href = `mailto:howard@howardcampbell.biz?subject=${subject}&body=${bodyText}`;
        
        // Show success and reset form
        submitBtn.innerHTML = '✓ Sent!';
        submitBtn.style.background = 'var(--accent-secondary)';
        
        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1000);
    });
  }
});
