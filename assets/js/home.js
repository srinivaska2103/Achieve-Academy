// Achieve Academy Home JS Logic

document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initTestimonialSlider();
  initFaqAccordion();
  initMockTestSimulator();
});

// 1. Stats Counter Animation Engine
function initCounters() {
  const statValues = document.querySelectorAll('.counter-val');
  if (statValues.length === 0) return;

  const countTo = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    let count = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // ~60fps

    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        clearInterval(timer);
        element.textContent = target.toLocaleString() + suffix;
      } else {
        element.textContent = Math.floor(count).toLocaleString() + suffix;
      }
    }, 16);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countTo(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(val => observer.observe(val));
}

// 2. Custom Testimonials Slider
function initTestimonialSlider() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  const slides = container.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('test-prev-btn');
  const nextBtn = document.getElementById('test-next-btn');
  const indicatorsContainer = document.getElementById('test-indicators');

  if (slides.length === 0) return;

  let activeIndex = 0;
  let autoPlayTimer;

  // Create indicators
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${
      idx === 0 ? 'bg-blue-600 w-6' : 'bg-slate-300 dark:bg-slate-700'
    }`;
    dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoPlay();
    });
    indicatorsContainer.appendChild(dot);
  });

  const indicators = indicatorsContainer.querySelectorAll('button');

  const updateSlideClasses = () => {
    slides.forEach((slide, idx) => {
      slide.style.display = idx === activeIndex ? 'block' : 'none';
      
      // Animations for slides
      if (idx === activeIndex) {
        slide.classList.add('animate-pulse-slow');
      } else {
        slide.classList.remove('animate-pulse-slow');
      }
    });

    indicators.forEach((dot, idx) => {
      if (idx === activeIndex) {
        dot.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 bg-blue-600 w-6';
      } else {
        dot.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 bg-slate-300 dark:bg-slate-700';
      }
    });
  };

  const goToSlide = (idx) => {
    activeIndex = (idx + slides.length) % slides.length;
    updateSlideClasses();
  };

  const nextSlide = () => goToSlide(activeIndex + 1);
  const prevSlide = () => goToSlide(activeIndex - 1);

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

  const startAutoPlay = () => {
    autoPlayTimer = setInterval(nextSlide, 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  };

  // Initial display setup
  updateSlideClasses();
  startAutoPlay();
}

// 3. FAQ Accordion Animation Wrapper
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (!trigger || !answer || !icon) return;

    trigger.addEventListener('click', () => {
      const isOpen = !answer.classList.contains('hidden');

      // Close all other FAQs for clean navigation
      document.querySelectorAll('.faq-answer').forEach(ans => ans.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(ic => ic.classList.remove('rotate-180'));
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('border-blue-500/35'));

      if (!isOpen) {
        answer.classList.remove('hidden');
        icon.classList.add('rotate-180');
        item.classList.add('border-blue-500/35');
      }
    });
  });
}

// 4. Interactive Free Mock Test Simulator
function initMockTestSimulator() {
  const questions = [
    {
      question: "Which of the following bodies is responsible for conducting civil services examinations in India?",
      options: ["Staff Selection Commission", "Union Public Service Commission", "NITI Aayog", "Election Commission"],
      correct: 1,
      explanation: "The Union Public Service Commission (UPSC) is India's premier central recruiting agency, established under Article 315 of the Constitution."
    },
    {
      question: "A train moving at 54 km/h crosses a standing pole in 10 seconds. What is the length of the train?",
      options: ["120 meters", "180 meters", "150 meters", "200 meters"],
      correct: 2,
      explanation: "Speed in m/s = 54 * (5/18) = 15 m/s. Length = Speed * Time = 15 * 10 = 150 meters."
    },
    {
      question: "Which particle is regarded as the core fundamental building block of protons and neutrons?",
      options: ["Quark", "Electron", "Neutrino", "Photon"],
      correct: 0,
      explanation: "Quarks are elementary particles that combine to form hadrons, such as protons and neutrons."
    }
  ];

  const questionEl = document.getElementById('mock-question');
  const optionsContainer = document.getElementById('mock-options');
  const nextBtn = document.getElementById('mock-next-btn');
  const scoreCard = document.getElementById('mock-score-card');
  const explanationEl = document.getElementById('mock-explanation');
  
  if (!questionEl || !optionsContainer || !nextBtn) return;

  let currentIdx = 0;
  let score = 0;
  let selectedOption = null;

  const loadQuestion = () => {
    selectedOption = null;
    explanationEl.classList.add('hidden');
    explanationEl.innerHTML = '';
    nextBtn.classList.add('hidden');
    
    const qData = questions[currentIdx];
    questionEl.textContent = `Q${currentIdx + 1}: ${qData.question}`;
    
    optionsContainer.innerHTML = '';
    qData.options.forEach((opt, idx) => {
      const button = document.createElement('button');
      button.className = 'w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200';
      button.innerHTML = `
        <span>${opt}</span>
        <span class="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs"></span>
      `;
      
      button.addEventListener('click', () => selectOption(idx, button));
      optionsContainer.appendChild(button);
    });
  };

  const selectOption = (optIdx, button) => {
    if (selectedOption !== null) return; // Answered already
    selectedOption = optIdx;

    const qData = questions[currentIdx];
    const buttons = optionsContainer.querySelectorAll('button');

    buttons.forEach((btn, idx) => {
      // Disable hover styles
      btn.classList.remove('hover:bg-slate-50', 'dark:hover:bg-slate-800');
      btn.disabled = true;

      const badge = btn.querySelector('span:last-child');
      
      if (idx === qData.correct) {
        btn.classList.add('border-emerald-500', 'bg-emerald-50/50', 'dark:bg-emerald-950/20');
        badge.className = 'w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs';
        badge.innerHTML = '✓';
      } else if (idx === optIdx) {
        btn.classList.add('border-rose-500', 'bg-rose-50/50', 'dark:bg-rose-950/20');
        badge.className = 'w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs';
        badge.innerHTML = '✗';
      }
    });

    if (optIdx === qData.correct) {
      score++;
    }

    // Show Explanation
    explanationEl.className = 'mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-600 text-xs text-slate-700 dark:text-slate-300 leading-relaxed';
    explanationEl.innerHTML = `<strong>Explanation:</strong> ${qData.explanation}`;

    nextBtn.classList.remove('hidden');
    if (currentIdx === questions.length - 1) {
      nextBtn.textContent = 'View Final Results';
    } else {
      nextBtn.textContent = 'Next Question';
    }
  };

  nextBtn.addEventListener('click', () => {
    if (currentIdx < questions.length - 1) {
      currentIdx++;
      loadQuestion();
    } else {
      // Show Final scorecard
      questionEl.parentElement.classList.add('hidden');
      scoreCard.classList.remove('hidden');
      document.getElementById('mock-score-text').textContent = `You scored ${score} out of ${questions.length}!`;
    }
  });

  // Re-take simulator action
  const resetBtn = document.getElementById('mock-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      questionEl.parentElement.classList.remove('hidden');
      scoreCard.classList.add('hidden');
      loadQuestion();
    });
  }

  // Initial simulator start
  loadQuestion();
}
