// Achieve Academy User Portal JS

document.addEventListener('DOMContentLoaded', () => {
  initPortalNavigation();
  renderPerformanceChart();
  initLeaderboardSort();
  initCertificateClaim();
  initDownloadTrackers();
});

// 1. Dashboard Tab Navigation
function initPortalNavigation() {
  const tabs = document.querySelectorAll('.portal-nav-tab');
  const sections = document.querySelectorAll('.portal-section');

  // Mobile dropdown toggle
  const toggleBtn = document.getElementById('portal-menu-toggle');
  const dropdown = document.getElementById('portal-dropdown');
  if (toggleBtn && dropdown) {
    toggleBtn.addEventListener('click', () => {
      dropdown.classList.toggle('hidden');
      const chevron = toggleBtn.querySelector('.chevron-icon');
      if (chevron) chevron.classList.toggle('rotate-180');
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
        const chevron = toggleBtn.querySelector('.chevron-icon');
        if (chevron) chevron.classList.remove('rotate-180');
      }
    });
  }
  if (tabs.length === 0 || sections.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetSectionId = tab.getAttribute('data-section');
      
      // Update Tab Styles
      tabs.forEach(t => {
        t.classList.remove('bg-blue-50', 'dark:bg-blue-950/20', 'text-blue-600', 'dark:text-blue-400', 'font-semibold');
        t.classList.add('text-slate-600', 'dark:text-slate-400');
      });
      tab.classList.add('bg-blue-50', 'dark:bg-blue-950/20', 'text-blue-600', 'dark:text-blue-400', 'font-semibold');
      tab.classList.remove('text-slate-600', 'dark:text-slate-400');

      // Update Active Sections
      sections.forEach(sec => {
        if (sec.id === targetSectionId) {
          sec.classList.remove('hidden');
        } else {
          sec.classList.add('hidden');
        }
      });

      // Mobile dropdown: update label + auto-close
      const activeLabel = document.getElementById('portal-active-label');
      const dropdown = document.getElementById('portal-dropdown');
      const toggleBtn = document.getElementById('portal-menu-toggle');
      if (activeLabel && tab.dataset.label) {
        activeLabel.textContent = tab.dataset.label;
      }
      if (dropdown && !dropdown.classList.contains('lg:block')) {
        dropdown.classList.add('hidden');
      }
      if (dropdown) {
        dropdown.classList.add('hidden');
      }
      if (toggleBtn) {
        const chevron = toggleBtn.querySelector('.chevron-icon');
        if (chevron) chevron.classList.remove('rotate-180');
      }
    });
  });
}

// 2. Custom SVG Chart Renderer (Simulates Chart.js with pure SVG & JS)
function renderPerformanceChart() {
  const chartWrapper = document.getElementById('perf-chart-wrapper');
  if (!chartWrapper) return;

  // Mock test performance scores (percentages)
  const data = [74, 82, 80, 92, 88, 95];
  const labels = ['Mock 1', 'Mock 2', 'Mock 3', 'Mock 4', 'Mock 5', 'Mock 6'];

  const width = chartWrapper.clientWidth || 500;
  const height = 220;
  const padding = 35;
  
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const maxVal = 100;
  
  // Calculate points
  const points = data.map((val, idx) => {
    const x = padding + (idx * (chartWidth / (data.length - 1)));
    const y = padding + chartHeight - (val * (chartHeight / maxVal));
    return { x, y, val, label: labels[idx] };
  });

  // Create SVG string
  let svgContent = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="overflow-visible text-slate-400 dark:text-slate-600">
      <!-- Grid lines -->
      <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="currentColor" stroke-dasharray="4" stroke-width="0.5" />
      <line x1="${padding}" y1="${padding + chartHeight/2}" x2="${width - padding}" y2="${padding + chartHeight/2}" stroke="currentColor" stroke-dasharray="4" stroke-width="0.5" />
      <line x1="${padding}" y1="${padding + chartHeight}" x2="${width - padding}" y2="${padding + chartHeight}" stroke="currentColor" stroke-width="1" />
      
      <!-- Axis Labels (Y) -->
      <text x="${padding - 8}" y="${padding + 4}" text-anchor="end" class="text-[10px] fill-current">100%</text>
      <text x="${padding - 8}" y="${padding + chartHeight/2 + 4}" text-anchor="end" class="text-[10px] fill-current">50%</text>
      <text x="${padding - 8}" y="${padding + chartHeight + 4}" text-anchor="end" class="text-[10px] fill-current">0%</text>

      <!-- Fill area under curve -->
      <path d="M ${points[0].x} ${padding + chartHeight} ${points.map(p => `L ${p.x} ${p.y}`).join(' ')} L ${points[points.length - 1].x} ${padding + chartHeight} Z" fill="url(#gradient-chart)" opacity="0.15" />
      
      <!-- Line Path -->
      <path d="${points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  `;

  // Draw points and hover details
  points.forEach(p => {
    svgContent += `
      <!-- Circle points -->
      <circle cx="${p.x}" cy="${p.y}" r="5" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.5" class="cursor-pointer transition-all hover:r-7" />
      <!-- Value labels -->
      <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" class="text-[10px] font-bold fill-blue-600 dark:fill-blue-400">${p.val}%</text>
      <!-- X Labels -->
      <text x="${p.x}" y="${padding + chartHeight + 18}" text-anchor="middle" class="text-[10px] fill-slate-500 dark:fill-slate-400 font-medium">${p.label}</text>
    `;
  });

  // Gradients definition
  svgContent += `
      <defs>
        <linearGradient id="gradient-chart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2563EB" />
          <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  `;

  chartWrapper.innerHTML = svgContent;
}

// 3. Leaderboard Table Sorting System
function initLeaderboardSort() {
  const table = document.getElementById('leaderboard-table');
  if (!table) return;

  const headers = table.querySelectorAll('th[data-sort]');
  const tbody = table.querySelector('tbody');

  headers.forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      const type = header.getAttribute('data-sort');
      let rows = Array.from(tbody.querySelectorAll('tr'));
      const isAsc = header.classList.toggle('asc-sort');

      rows.sort((rowA, rowB) => {
        let valA = rowA.querySelector(`td[data-${type}]`).getAttribute(`data-${type}`);
        let valB = rowB.querySelector(`td[data-${type}]`).getAttribute(`data-${type}`);

        if (type === 'rank' || type === 'score') {
          return isAsc ? parseFloat(valA) - parseFloat(valB) : parseFloat(valB) - parseFloat(valA);
        }
        return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });

      // Update UI pointers
      headers.forEach(h => {
        const span = h.querySelector('.sort-indicator');
        if (span) span.textContent = '↕';
      });
      const currentIndicator = header.querySelector('.sort-indicator');
      if (currentIndicator) {
        currentIndicator.textContent = isAsc ? '▲' : '▼';
      }

      // Re-append sorted rows
      tbody.innerHTML = '';
      rows.forEach(r => tbody.appendChild(r));
    });
  });
}

// 4. Mock Student Certificate Claiming System
function initCertificateClaim() {
  const claimBtns = document.querySelectorAll('.claim-cert-btn');
  if (claimBtns.length === 0) return;

  // Create Modal element and append to body
  const modal = document.createElement('div');
  modal.id = 'certificate-modal';
  modal.className = 'fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 hidden opacity-0 transition-opacity duration-300';
  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-xl w-full p-8 border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
      <!-- Top banner color -->
      <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-500"></div>

      <!-- Close Button -->
      <button id="cert-modal-close" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <!-- Badge Icon -->
      <div class="w-16 h-16 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      </div>

      <h3 class="text-xl font-bold text-slate-900 dark:text-white">Verify & Download Certificate</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
        Congratulations! You have completed the prerequisite requirements and mock milestones for this course.
      </p>

      <!-- Certificate mock mockup inside card -->
      <div class="my-6 p-6 border-4 border-double border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-lg flex flex-col items-center justify-center relative">
        <h4 class="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-1">Certificate of Completion</h4>
        <span class="text-[10px] text-slate-400">Awarded to:</span>
        <span id="cert-student-name" class="text-base font-semibold text-slate-900 dark:text-white mt-1 border-b border-slate-300 dark:border-slate-700 pb-1 px-4">Alex Morgan</span>
        <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-2 max-w-[280px]">
          For demonstrating exceptional proficiency in the UPSC CSE Foundation Module & General Studies 2026.
        </p>
        <div class="mt-4 flex justify-between w-full text-[8px] text-slate-400">
          <span>Date: July 1, 2026</span>
          <span>Reg ID: AC-9844102</span>
        </div>
      </div>

      <div class="flex gap-4">
        <button id="cert-cancel-btn" class="w-1/2 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors text-sm">Cancel</button>
        <button id="cert-download-btn" class="w-1/2 py-2.5 rounded-lg gradient-btn text-white font-medium shadow-sm text-sm">Download PDF</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalClose = document.getElementById('cert-modal-close');
  const modalCancel = document.getElementById('cert-cancel-btn');
  const modalDownload = document.getElementById('cert-download-btn');
  const studentNameEl = document.getElementById('cert-student-name');

  claimBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const studentName = btn.getAttribute('data-student') || 'Alex Morgan';
      studentNameEl.textContent = studentName;

      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
      }, 10);
    });
  });

  const closeModal = () => {
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  };

  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);
  
  modalDownload.addEventListener('click', () => {
    modalDownload.disabled = true;
    modalDownload.innerHTML = 'Generating...';
    setTimeout(() => {
      alert('Your PDF Certificate has been generated and downloaded successfully!');
      modalDownload.disabled = false;
      modalDownload.innerHTML = 'Download PDF';
      closeModal();
    }, 1200);
  });
}

// 5. Download Trackers (Counts total downloads in mock portal)
function initDownloadTrackers() {
  const downloadBtns = document.querySelectorAll('.portal-download-btn');
  const countBadge = document.getElementById('download-badge-count');

  if (downloadBtns.length === 0) return;

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<span class="inline-block animate-bounce">✓</span> Downloaded`;
      btn.className = btn.className.replace('bg-blue-600', 'bg-emerald-600').replace('hover:bg-blue-700', '');

      // Increment download notifications badge
      if (countBadge) {
        let currentCount = parseInt(countBadge.textContent, 10) || 0;
        countBadge.textContent = currentCount + 1;
        countBadge.classList.add('scale-110');
        setTimeout(() => countBadge.classList.remove('scale-110'), 200);
      }

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.className = btn.className.replace('bg-emerald-600', 'bg-blue-600').replace('', 'hover:bg-blue-700');
      }, 3000);
    });
  });
}
