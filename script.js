/* ==========================================================================
   MINIMALIST PORTFOLIO INTERACTIVE LOGIC & I18N SWITCHER
   ========================================================================== */

let currentLang = 'fr';
let currentTheme = localStorage.getItem('theme') || 'dark';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initI18n();
  initSkillFilters();
  initProjectFilters();
  initContactForm();
  initNavScroll();
  initPortraitToggle();
  initMobileMenu();
  initScrollReveal();
});

function initPortraitToggle() {
  const card = document.getElementById('portraitShowcaseCard');
  if (card) {
    card.addEventListener('click', (e) => {
      // Don't toggle if clicking directly on a button inside
      if (e.target.closest('a') || e.target.closest('button')) return;
      card.classList.toggle('active');
    });
  }
}

/* --- Theme Switcher --- */
function initTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
  
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
      updateThemeIcon();
    });
  }
}

function updateThemeIcon() {
  const icon = document.querySelector('#themeToggleBtn i');
  if (icon) {
    icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
  }
}

/* --- Internationalization (FR / EN) --- */
function initI18n() {
  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'fr' ? 'en' : 'fr';
      langBtn.innerHTML = currentLang === 'fr' 
        ? '<i class="fas fa-globe"></i> EN' 
        : '<i class="fas fa-globe"></i> FR';
      applyTranslations();
    });
  }
  applyTranslations();
}

function applyTranslations() {
  const dict = typeof window !== 'undefined' && window.translations ? window.translations : (typeof translations !== 'undefined' ? translations : null);
  if (!dict) return;
  const langData = dict[currentLang];
  if (!langData) return;

  // Query all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const keyPath = el.getAttribute('data-i18n');
    const value = getNestedValue(langData, keyPath);
    if (value) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else {
        el.innerHTML = value;
      }
    }
  });

  // Re-render project cards and skills to match active language
  renderSkillCards();
  renderProjectCards();
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((prev, curr) => (prev && prev[curr] !== undefined) ? prev[curr] : null, obj);
}

/* --- Skills Rendering & Search Filter --- */
const skillCategories = [
  {
    id: "lang",
    icon: "fas fa-code",
    titleKey: "skills.cat_languages",
    skills: ["Python", "Java", "C", "C++", "SQL", "PHP"]
  },
  {
    id: "frameworks",
    icon: "fas fa-layer-group",
    titleKey: "skills.cat_frameworks",
    skills: ["Spring Boot", "Angular", "Symfony", "SDL", "Qt Framework"]
  },
  {
    id: "cloud",
    icon: "fas fa-cloud",
    titleKey: "skills.cat_cloud",
    skills: ["FinOps", "Cloud Cost Optimization", "Infrastructure Metrics", "Data Modeling"]
  },
  {
    id: "db",
    icon: "fas fa-database",
    titleKey: "skills.cat_databases",
    skills: ["MongoDB", "Oracle Database", "SQL Server", "MySQL", "Power BI", "Power Query", "Data Visualization", "Business Intelligence"]
  },
  {
    id: "tools",
    icon: "fas fa-tools",
    titleKey: "skills.cat_tools",
    skills: ["GitHub", "REST API", "FlutterFlow", "Adobe Creative Suite", "Canva", "Excel & Data Analytics"]
  }
];

function renderSkillCards(filterId = 'all', searchQuery = '') {
  const container = document.getElementById('skillsGrid');
  if (!container) return;

  container.innerHTML = '';
  const dict = window.translations || (typeof translations !== 'undefined' ? translations : null);
  const langData = dict ? dict[currentLang] : null;
  if (!langData) return;

  skillCategories.forEach(cat => {
    if (filterId !== 'all' && cat.id !== filterId) return;

    // Filter skills by search
    const matchingSkills = cat.skills.filter(s => 
      s.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (searchQuery && matchingSkills.length === 0) return;

    const card = document.createElement('div');
    card.className = 'skill-category-card glass-card';
    card.innerHTML = `
      <div class="category-header">
        <div class="category-icon"><i class="${cat.icon}"></i></div>
        <div class="category-title">${getNestedValue(langData, cat.titleKey)}</div>
      </div>
      <div class="tags-container">
        ${(searchQuery ? matchingSkills : cat.skills).map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    `;
    container.appendChild(card);
  });
}

function initSkillFilters() {
  const pillBtns = document.querySelectorAll('.skills-controls .pill-btn');
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      const searchVal = document.getElementById('skillSearchInput')?.value || '';
      renderSkillCards(filter, searchVal);
    });
  });

  const searchInput = document.getElementById('skillSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activePill = document.querySelector('.skills-controls .pill-btn.active');
      const filter = activePill ? activePill.getAttribute('data-filter') : 'all';
      renderSkillCards(filter, e.target.value);
    });
  }
}

/* --- Projects Filter & Modal --- */
const projectList = [
  {
    id: "p1",
    cat: "cloud",
    img: "assets/images/finops.png",
    key: "projects.p1"
  },
  {
    id: "p2",
    cat: "fullstack",
    img: "assets/images/elearning.png",
    key: "projects.p2"
  },
  {
    id: "p3",
    cat: "fullstack",
    img: "assets/images/finops.png",
    key: "projects.p3"
  },
  {
    id: "p4",
    cat: "desktop",
    img: "assets/images/ev_charging.png",
    key: "projects.p4"
  },
  {
    id: "p5",
    cat: "fullstack",
    img: "assets/images/elearning.png",
    key: "projects.p5"
  },
  {
    id: "p6",
    cat: "desktop",
    img: "assets/images/ev_charging.png",
    key: "projects.p6"
  }
];

function renderProjectCards(filterCat = 'all') {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = '';
  const dict = window.translations || (typeof translations !== 'undefined' ? translations : null);
  const langData = dict ? dict[currentLang] : null;
  if (!langData) return;

  projectList.forEach(proj => {
    if (filterCat !== 'all' && proj.cat !== filterCat) return;

    const data = getNestedValue(langData, proj.key);
    if (!data) return;

    const card = document.createElement('div');
    card.className = 'project-card glass-card';
    card.innerHTML = `
      <div class="project-body">
        <span class="project-tag">${data.tag}</span>
        <h3 class="project-title">${data.title}</h3>
        <p class="project-short">${data.short}</p>
        <div class="project-tech-stack">
          ${data.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
        </div>
        <button class="btn-details" onclick="openProjectModal('${proj.id}')">
          <span>${getNestedValue(langData, 'projects.btn_details')}</span>
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initProjectFilters() {
  const pills = document.querySelectorAll('#projectFilters .pill-btn');
  pills.forEach(p => {
    p.addEventListener('click', () => {
      pills.forEach(b => b.classList.remove('active'));
      p.classList.add('active');
      renderProjectCards(p.getAttribute('data-filter'));
    });
  });
}

function openProjectModal(projId) {
  const proj = projectList.find(p => p.id === projId);
  if (!proj) return;

  const dict = window.translations || (typeof translations !== 'undefined' ? translations : null);
  const langData = dict ? dict[currentLang] : null;
  const data = getNestedValue(langData, proj.key);

  const modalOverlay = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalCardBody');

  if (modalOverlay && modalBody) {
    modalBody.innerHTML = `
      <span class="project-tag">${data.tag}</span>
      <h2 style="font-size: 1.6rem; font-weight: 800; margin: 8px 0 16px;">${data.title}</h2>
      <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 24px;">${data.overview}</p>
      
      <h4 style="font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-blue); margin-bottom: 12px;">Fonctionnalités Clés</h4>
      <ul style="list-style: none; margin-bottom: 24px;">
        ${data.features.map(f => `
          <li style="padding-left: 20px; position: relative; margin-bottom: 8px; color: var(--text-secondary); font-size: 0.95rem;">
            <i class="fas fa-check" style="position: absolute; left: 0; top: 4px; color: var(--accent-blue); font-size: 0.8rem;"></i>
            ${f}
          </li>
        `).join('')}
      </ul>

      <h4 style="font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-blue); margin-bottom: 12px;">Technologies</h4>
      <div class="project-tech-stack">
        ${data.tech.map(t => `<span class="tech-badge" style="padding: 6px 12px; font-size: 0.85rem;">${t}</span>`).join('')}
      </div>
    `;

    modalOverlay.classList.add('active');
  }
}

function closeModal() {
  const modalOverlay = document.getElementById('projectModal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
  }
}

/* --- Contact Form & Clipboard Copy --- */
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const subject = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value;

      const mailtoUrl = `mailto:noumrisourour@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent(message + '\n\nDe: ' + name + ' (' + email + ')')}`;
      
      window.location.href = mailtoUrl;

      const langData = translations[currentLang];
      showToast(getNestedValue(langData, 'contact.toast_success'));
      form.reset();
    });
  }
}

function copyToClipboard(text, msgKey) {
  navigator.clipboard.writeText(text).then(() => {
    const langData = translations[currentLang];
    showToast(getNestedValue(langData, msgKey) || "Copié dans le presse-papier !");
  });
}

function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) return;

  toast.querySelector('.toast-msg').textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* --- Navigation Active Highlight on Scroll --- */
function initNavScroll() {
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navAnchor = document.querySelector(`.nav-links a[href*=${sectionId}]`);

      if (navAnchor) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navAnchor.classList.add('active');
        } else {
          navAnchor.classList.remove('active');
        }
      }
    });
  });
}

/* --- Mobile Hamburger Menu --- */
function initMobileMenu() {
  const menuBtn = document.getElementById('menuToggleBtn');
  const navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }
}

/* --- Scroll-Reveal Animations --- */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Observe all sections and cards
  document.querySelectorAll('.section, .glass-card, .timeline-item, .stat-card, .project-card, .skill-category-card').forEach(el => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });
}
