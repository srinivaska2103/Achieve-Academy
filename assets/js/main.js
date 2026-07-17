// Achieve Academy Global Javascript

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Dark/Light Mode
  initTheme();

  // 2. Initialize LTR/RTL Layout Direction
  initDirection();

  // 3. Hydrate Shared Components: Header & Footer (skip for auth/portal pages)
  const noNavPages = ['login.html','signup.html', '404.html', 'coming-soon.html', 'user-portal.html','book-now.html'];
  const currentPageName = window.location.pathname.split('/').pop() || 'index.html';
  if (!noNavPages.includes(currentPageName)) {
    hydrateHeader();
    hydrateFooter();
  }

  // 4. Initialize Preloader
  initPreloader();

  // 5. Initialize Scroll Progress & Sticky Elements
  initScrollEffects();

  // 6. Scroll Reveal Animation Engine
  initScrollReveal();

  // 7. Event Delegations (Ripple Effects, Newsletter validation, Mobile Menu)
  initInteractiveListeners();
});

// Theme Management (Sync with localStorage)
function initTheme() {
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  // Custom event so specific pages can respond
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }));
}

// Direction Management (LTR/RTL Sync with localStorage)
function initDirection() {
  const storedDir = localStorage.getItem('direction') || 'ltr';
  document.documentElement.setAttribute('dir', storedDir);
  updateDirectionButtonLabel(storedDir);
}

function toggleDirection() {
  const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
  const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', newDir);
  localStorage.setItem('direction', newDir);
  updateDirectionButtonLabel(newDir);
  
  // Custom event so sliders/carousels can adjust their orientation
  window.dispatchEvent(new CustomEvent('directionChanged', { detail: { direction: newDir } }));
}

function updateDirectionButtonLabel(dir) {
  const btns = document.querySelectorAll('.dir-toggle-text');
  btns.forEach(btn => {
    btn.textContent = dir === 'ltr' ? 'LTR' : 'RTL';
  });
}

// Academic Emblem Logo SVG Markup
const academicLogoSVG = `
<svg class="h-10 w-10 flex-shrink-0" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="5" fill="none" class="text-blue-800 dark:text-blue-500" />
  <path d="M35 52v8c0 8 15 10 15 10s15-2 15-10v-8" fill="currentColor" class="text-blue-600 opacity-20 dark:text-blue-800" />
  <polygon points="50,30 80,45 50,60 20,45" fill="currentColor" class="text-blue-800 dark:text-blue-500" stroke="currentColor" stroke-width="2" />
  <path d="M50,45 L25,52 L25,62" stroke="currentColor" stroke-width="3" />
  <circle cx="25" cy="64" r="2.5" fill="currentColor" />
  <path d="M50,80 L50,18" stroke="#F59E0B" stroke-width="6" />
  <path d="M42,26 L50,16 L58,26" stroke="#F59E0B" stroke-width="6" />
</svg>
`;

// Dynamic Header Hydration
function hydrateHeader() {
  const header = document.getElementById('global-header');
  if (!header) return;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const menuItems = [
    { name: 'Home', link: 'index.html' },
    { name: 'Home 2', link: 'home2.html' },
    { name: 'About Us', link: 'about.html' },
    { name: 'Courses', link: 'services.html' },
    { name: 'Gallery', link: 'gallery.html' },
    { name: 'Pricing', link: 'pricing.html' },
    { name: 'Contact', link: 'contact.html' },
    { name: 'User Portal', link: 'user-portal.html' }
  ];

  let menuHTML = '';
  menuItems.forEach(item => {
    const isActive = currentPath === item.link;
    const activeClass = isActive 
      ? 'text-blue-600 dark:text-blue-400 font-semibold' 
      : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400';
    menuHTML += `<li><a href="${item.link}" class="text-sm font-medium transition-colors duration-200 ${activeClass}">${item.name}</a></li>`;
  });

  header.className = 'fixed top-0 left-0 w-full z-50 transition-all duration-300 glass-nav shadow-sm';
  header.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <a href="index.html" class="flex items-center gap-3">
          ${academicLogoSVG}
          <div class="flex flex-col">
            <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">Achieve Academy</span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase mt-1">Your Success Begins Here</span>
          </div>
        </a>

        <!-- Center Nav Items -->
        <nav class="hidden lg:block">
          <ul class="flex items-center gap-6">
            ${menuHTML}
          </ul>
        </nav>

        <!-- Right Tools & CTAs -->
        <div class="hidden lg:flex items-center gap-3">
          <!-- Direction Toggle -->
          <button onclick="toggleDirection()" class="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold" title="Toggle Language Direction">
            <span class="dir-toggle-text">LTR</span>
          </button>

          <!-- Theme Toggle -->
          <button onclick="toggleTheme()" class="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Toggle Dark/Light Mode">
            <!-- Sun -->
            <svg class="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21M4.22 19.78l1.58-1.58M18.22 5.75l1.58-1.58M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" /></svg>
            <!-- Moon -->
            <svg class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
          </button>

          <!-- CTAs -->
          <a href="login.html" class="px-5 h-10 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-200 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center">
            Login
          </a>
          <a href="book-now.html" class="gradient-btn px-5 h-10 rounded-lg text-sm font-medium text-white shadow-sm flex items-center justify-center gap-1">
            Book Now
            <svg class="w-4 h-4 rtl-flip" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </a>
        </div>

        <!-- Mobile Controls & Menu Button -->
        <div class="flex items-center gap-2 lg:hidden">
          <!-- Mobile Theme Toggle -->
        

          <!-- Toggle Button -->
          <button id="mobile-menu-btn" class="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle Mobile Menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Overlay -->
    <div id="mobile-drawer" class="fixed inset-0 top-20 w-full bg-slate-900/40 backdrop-blur-sm z-40 hidden transition-opacity duration-300 opacity-0">
      <div class="absolute top-0 right-0 w-80 max-w-full h-screen bg-white dark:bg-slate-900 p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
        <div>
          <!-- Direction & Theme Toggle settings inside drawer -->
          <div class="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <span class="text-sm font-semibold text-slate-500 dark:text-slate-400">Settings</span>
            <div class="flex items-center gap-2">
              <!-- Dark Toggle inside drawer -->
              <button onclick="toggleTheme()" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Toggle Dark/Light Mode">
                <!-- Sun -->
                <svg class="w-4 h-4 block dark:hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21M4.22 19.78l1.58-1.58M18.22 5.75l1.58-1.58M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" /></svg>
                <!-- Moon -->
                <svg class="w-4 h-4 hidden dark:block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
              </button>
              <!-- Direction Toggle -->
              <button onclick="toggleDirection()" class="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-semibold flex items-center gap-1">
                <span class="dir-toggle-text">LTR</span> Direction
              </button>
            </div>
          </div>

          <nav class="mt-8">
            <ul class="space-y-4">
              ${menuItems.map(item => {
                const isActive = currentPath === item.link;
                const activeClass = isActive 
                  ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                  : 'text-slate-700 dark:text-slate-300';
                return `<li><a href="${item.link}" class="block py-2 text-base font-medium transition-colors ${activeClass}">${item.name}</a></li>`;
              }).join('')}
            </ul>
          </nav>
        </div>

        <div class="mt-auto pt-8 pb-20 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
              <a href="login.html" class="w-full text-center py-3 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-200 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 font-medium transition-colors">
  Login
</a>
        <a href="book-now.html" class="w-full text-center py-3 rounded-lg gradient-btn text-white font-medium shadow-sm">Book Now</a>
        </div>
      </div>
    </div>
  `;

  // Mobile menu action logic
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const isHidden = drawer.classList.contains('hidden');
      if (isHidden) {
        drawer.classList.remove('hidden');
        setTimeout(() => {
          drawer.classList.remove('opacity-0');
        }, 10);
      } else {
        drawer.classList.add('opacity-0');
        setTimeout(() => {
          drawer.classList.add('hidden');
        }, 300);
      }
    });

    // Close when clicking overlay backdrop
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) {
        drawer.classList.add('opacity-0');
        setTimeout(() => {
          drawer.classList.add('hidden');
        }, 300);
      }
    });
  }

  // Update direction label to match correctly after load
  initDirection();
}

// Dynamic Footer Hydration
function hydrateFooter() {
  const footer = document.getElementById('global-footer');
  if (!footer) return;

  footer.className = 'bg-slate-900 text-slate-300 dark:bg-slate-950 border-t border-slate-800 py-16 px-4 sm:px-6 lg:px-8';
  footer.innerHTML = `
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <!-- Brand Info -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            ${academicLogoSVG}
            <div class="flex flex-col">
              <span class="text-xl font-bold tracking-tight text-white leading-none">Achieve Academy</span>
              <span class="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">Your Success Begins Here</span>
            </div>
          </div>
          <p class="text-sm text-slate-400 leading-relaxed">
            Premium Coaching Institute for Union and State Public Services, Engineering, and Medical entrance examinations. We turn raw dedication into stellar top rank results.
          </p>
          <div class="flex items-center gap-4">
            <a href="#" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-600 transition-colors flex items-center justify-center text-white" aria-label="Facebook">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6.5C12 5.67 12.5 5 13.5 5H15V2h-2.5C9.5 2 9 3.5 9 5.5V8z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-pink-600 transition-colors flex items-center justify-center text-white" aria-label="Instagram">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-700 transition-colors flex items-center justify-center text-white" aria-label="LinkedIn">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-red-600 transition-colors flex items-center justify-center text-white" aria-label="YouTube">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.108C19.53 3.53 12 3.53 12 3.53s-7.53 0-9.388.525A3.003 3.003 0 00.5 6.163C0 8.024 0 12 0 12s0 3.976.5 5.837a3.003 3.003 0 002.11 2.108c1.858.525 9.388.525 9.388.525s7.53 0 9.388-.525a3.002 3.002 0 002.11-2.108c.5-1.861.5-5.837.5-5.837s0-3.976-.5-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center text-white" aria-label="Twitter X">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-6">Quick Links</h3>
          <ul class="space-y-3 text-sm">
            <li><a href="index.html" class="hover:text-blue-400 transition-colors">Home</a></li>
            <li><a href="home2.html" class="hover:text-blue-400 transition-colors">Home 2 Layout</a></li>
            <li><a href="about.html" class="hover:text-blue-400 transition-colors">About Us</a></li>
            <li><a href="services.html" class="hover:text-blue-400 transition-colors">Courses & Services</a></li>
            <li><a href="gallery.html" class="hover:text-blue-400 transition-colors">Photo Gallery</a></li>
            <li><a href="pricing.html" class="hover:text-blue-400 transition-colors">Pricing Plans</a></li>
            <li><a href="contact.html" class="hover:text-blue-400 transition-colors">Contact</a></li>
            <li><a href="user-portal.html" class="hover:text-blue-400 transition-colors">User Portal</a></li>
            
          </ul>
        </div>

        <!-- Useful Links -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-6">Useful Links</h3>
          <ul class="space-y-3 text-sm">
          <li><a href="404.html" class="hover:text-blue-400 transition-colors">404 Error Page</a></li>
            <li><a href="coming-soon.html" class="hover:text-blue-400 transition-colors">Coming Soon</a></li>
            <li><a href="book-now.html" class="hover:text-blue-400 transition-colors">Admissions 2026</a></li>
            <li><a href="services.html" class="hover:text-blue-400 transition-colors">Online & Offline Batches</a></li>
            <li><a href="about.html#faculty" class="hover:text-blue-400 transition-colors">Expert Faculty</a></li>
            <li><a href="index.html#mock-tests" class="hover:text-blue-400 transition-colors">Free Mock Tests</a></li>
            <li><a href="index.html#results" class="hover:text-blue-400 transition-colors">Top Rank Achievements</a></li>
            <li><a href="contact.html" class="hover:text-blue-400 transition-colors">Academic Helpdesk</a></li>
          </ul>
        </div>

        <!-- Contact & Newsletter -->
        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-6">Newsletter</h3>
            <p class="text-xs text-slate-400 mb-4 leading-relaxed">
              Subscribe to stay updated with mock test schedules, study syllabus alerts, and result reports.
            </p>
            <form id="newsletter-form" class="flex flex-col gap-2 w-full">
              <input type="email" required placeholder="Your email address" class="w-full px-4 py-2 text-sm bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500">
              <button type="submit" class="gradient-btn px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center w-full">
                Subscribe
              </button>
            </form>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-2">Get In Touch</h3>
            <p class="text-xs text-slate-400">
              Email: info@achieveacademy.edu<br>
              Phone: +1 (800) 456-7890<br>
              Hours: Mon - Sat (8:00 AM - 8:00 PM)
            </p>
          </div>
        </div>
      </div>

      <!-- Copyright Area -->
      <div class="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row justify-between gap-4">
        <span>&copy; 2026 Achieve Academy. All rights reserved. Designed with premium educational standards.</span>
        <div class="flex gap-6">
          <a href="#" class="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-slate-400 transition-colors">Terms of Service</a>
          <a href="#" class="hover:text-slate-400 transition-colors">Cookie Settings</a>
        </div>
      </div>
    </div>
  `;
}

// Preloader Handler
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });
  }
}

// Scroll Progress Indicator, Sticky Header and Floating CTA
function initScrollEffects() {
  const header = document.getElementById('global-header');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPos = window.scrollY;

    // 1. Progress Bar Width
    if (scrollProgress && windowHeight > 0) {
      const progressPercent = (scrollPos / windowHeight) * 100;
      scrollProgress.style.width = `${progressPercent}%`;
    }

    // 2. Header Glassmorphism Adjustments
    if (header) {
      if (scrollPos > 40) {
        header.classList.add('shadow-md', 'backdrop-blur-xl');
        header.classList.remove('shadow-sm');
      } else {
        header.classList.add('shadow-sm');
        header.classList.remove('shadow-md');
      }
    }

    // 3. Back To Top visibility
    if (backToTopBtn) {
      if (scrollPos > 300) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Scroll Reveal Observer Engine
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once it has revealed, we don't need to observe it again
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(element => {
      element.classList.add('active');
    });
  }
}

// Ripple Effect and Newsletter Validation
function initInteractiveListeners() {
  // Ripple Effect
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.gradient-btn, .ripple-btn');
    if (!target) return;

    // Create ripple element
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    // Position ripple
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    target.appendChild(ripple);
    
    // Remove ripple after transition finishes
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });

  // Newsletter Submit Listener
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const submitBtn = newsletterForm.querySelector('button');
      if (!input || !submitBtn) return;

      const userEmail = input.value.trim();
      if (!userEmail) return;

      // Disable inputs and show success transition
      input.disabled = true;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      `;

      setTimeout(() => {
        // Hydrate Newsletter Area with Success Animation
        const parent = newsletterForm.parentElement;
        parent.innerHTML = `
          <div class="text-center py-4 bg-slate-800/50 rounded-xl border border-emerald-500/20 px-6 animate-pulse-slow">
            <svg class="w-10 h-10 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h4 class="text-sm font-semibold text-white">Subscription Successful!</h4>
            <p class="text-xs text-slate-400 mt-1">Welcome aboard. You will now receive notifications on tests and rank reports.</p>
          </div>
        `;
      }, 1500);
    });
  }
}
