// Analytics Tracking System
// Tracks section views, user events, and scroll depth

class Analytics {
  constructor() {
    this.visitorId = null;
    this.sessionId = null;
    this.supabase = null;
    this.initialized = false;
    
    // Track which sections have been viewed
    this.viewedSections = new Set();
    this.sectionTimers = new Map();
    
    // Track scroll depth milestones
    this.scrollDepthReached = new Set();
    
    // Track which events have been sent (prevent duplicates)
    this.eventsSent = new Set();
  }

  async init() {
    if (this.initialized) return;
    
    // Get visitor ID from session or generate new one
    this.visitorId = sessionStorage.getItem('visitorId');
    if (!this.visitorId) {
      this.visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('visitorId', this.visitorId);
    }
    
    // Generate session ID
    this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Wait for Supabase to be ready
    this.supabase = await window.waitForSupabase();
    
    if (this.supabase) {
      console.log('Analytics initialized with visitor ID:', this.visitorId);
      this.initialized = true;
      this.setupTracking();
    } else {
      console.warn('Analytics: Supabase not available, tracking disabled');
    }
  }

  setupTracking() {
    // Setup section view tracking
    this.trackSectionViews();
    
    // Setup scroll depth tracking
    this.trackScrollDepth();
    
    // Setup CTA button tracking
    this.trackCTAButtons();
    
    // Setup portfolio tracking
    this.trackPortfolioInteractions();
    
    // Setup contact tracking
    this.trackContactInteractions();
    
    // Setup form submission tracking
    this.trackFormSubmission();
  }

  // Track section views using Intersection Observer
  trackSectionViews() {
    const sections = [
      { id: 'home', name: 'hero' },
      { id: 'portfolio', name: 'portfolio' },
      { id: 'testimonials', name: 'testimonials' },
      { id: 'team', name: 'team' },
      { id: 'contact', name: 'contact' }
    ];

    const observerOptions = {
      threshold: 0.5, // Section is considered viewed when 50% visible
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionName = entry.target.dataset.analyticsSection;
        
        if (entry.isIntersecting) {
          // Section entered view
          if (!this.viewedSections.has(sectionName)) {
            this.viewedSections.add(sectionName);
            this.sectionTimers.set(sectionName, Date.now());
            console.log('Section viewed:', sectionName);
          }
        } else {
          // Section left view - calculate duration
          if (this.sectionTimers.has(sectionName)) {
            const startTime = this.sectionTimers.get(sectionName);
            const duration = Math.round((Date.now() - startTime) / 1000); // seconds
            this.sectionTimers.delete(sectionName);
            
            // Log section view with duration
            this.logSectionView(sectionName, duration);
          }
        }
      });
    }, observerOptions);

    // Add data attributes and observe sections
    sections.forEach(({ id, name }) => {
      const element = document.getElementById(id);
      if (element) {
        element.dataset.analyticsSection = name;
        observer.observe(element);
      }
    });
  }

  // Track scroll depth (25%, 50%, 75%, 100%)
  trackScrollDepth() {
    const milestones = [25, 50, 75, 100];
    
    const checkScrollDepth = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollPercentage = Math.round((scrollTop + windowHeight) / documentHeight * 100);
      
      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !this.scrollDepthReached.has(milestone)) {
          this.scrollDepthReached.add(milestone);
          this.logScrollDepth(milestone);
          console.log('Scroll depth reached:', milestone + '%');
        }
      });
    };

    // Throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkScrollDepth, 200);
    });
    
    // Initial check
    checkScrollDepth();
  }

  // Track CTA button clicks
  trackCTAButtons() {
    // "View Our Work" button
    const viewWorkBtn = document.querySelector('a[href="#portfolio"].btn-primary');
    if (viewWorkBtn) {
      viewWorkBtn.addEventListener('click', () => {
        this.logEvent('click', 'cta', 'view_our_work', 'View Our Work button');
      });
    }

    // "Get In Touch" button in hero
    const getInTouchBtn = document.querySelector('a[href="#contact"].btn-secondary');
    if (getInTouchBtn) {
      getInTouchBtn.addEventListener('click', () => {
        this.logEvent('click', 'cta', 'get_in_touch_hero', 'Get In Touch button (Hero)');
      });
    }
  }

  // Track portfolio interactions
  trackPortfolioInteractions() {
    // Track portfolio item clicks
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('.portfolio-title')?.textContent || 'Unknown';
        const category = card.querySelector('.portfolio-category')?.textContent || 'Unknown';
        const videoId = card.querySelector('iframe')?.dataset.videoId || '';
        
        this.logEvent('click', 'portfolio', `portfolio_item_${videoId}`, `${title} - ${category}`);
      });
    });

    // Track video plays in modal
    const modalVideo = document.getElementById('modalVideo');
    if (modalVideo) {
      // Track when modal opens (video auto-plays)
      const videoModal = document.getElementById('videoModal');
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.target.classList.contains('active')) {
            const modalTitle = document.getElementById('modalTitle')?.textContent || 'Unknown';
            this.logEvent('video_play', 'portfolio', 'portfolio_video_play', modalTitle);
          }
        });
      });
      
      if (videoModal) {
        observer.observe(videoModal, { attributes: true, attributeFilter: ['class'] });
      }
    }
  }

  // Track contact interactions
  trackContactInteractions() {
    // Track WhatsApp clicks
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.logEvent('click', 'contact', 'whatsapp_click', 'WhatsApp contact');
      });
    });

    // Track phone clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.logEvent('click', 'contact', 'phone_click', 'Phone contact');
      });
    });

    // Track email clicks
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.logEvent('click', 'contact', 'email_click', 'Email contact');
      });
    });
  }

  // Track form submission
  trackFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      // Track when user clicks send button (before submission)
      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.addEventListener('click', (e) => {
          // Check if form is valid before tracking
          if (contactForm.checkValidity()) {
            this.logEvent('click', 'contact', 'send_message_click', 'Send Message button clicked');
          }
        });
      }

      // Track successful form submission
      // We'll need to hook into the existing form submission handler
      // Store reference to track submission success
      const originalSubmitHandler = contactForm.onsubmit;
      
      contactForm.addEventListener('submit', async (e) => {
        // The form submission will be handled by the existing code
        // We just track it here after a short delay to ensure it went through
        setTimeout(() => {
          this.logEvent('form_submit', 'contact', 'contact_form_submit', 'Contact form successfully submitted');
        }, 500);
      });
    }
  }

  // Log an event to Supabase
  async logEvent(eventType, eventCategory, eventLabel, eventValue = null) {
    if (!this.initialized || !this.supabase) return;
    
    // Prevent duplicate events (same event within 1 second)
    const eventKey = `${eventType}_${eventCategory}_${eventLabel}`;
    if (this.eventsSent.has(eventKey)) return;
    
    this.eventsSent.add(eventKey);
    setTimeout(() => this.eventsSent.delete(eventKey), 1000);

    const eventData = {
      visitor_id: this.visitorId,
      event_type: eventType,
      event_category: eventCategory,
      event_label: eventLabel,
      event_value: eventValue,
      session_id: this.sessionId,
      timestamp: new Date().toISOString()
    };

    try {
      const { error } = await this.supabase
        .from('analytics_events')
        .insert([eventData]);
      
      if (error) {
        console.error('Analytics: Error logging event:', error);
      } else {
        console.log('Analytics: Event logged:', eventType, eventCategory, eventLabel);
      }
    } catch (error) {
      console.error('Analytics: Error logging event:', error);
    }
  }

  // Log section view to Supabase
  async logSectionView(sectionName, duration) {
    if (!this.initialized || !this.supabase) return;

    const viewData = {
      visitor_id: this.visitorId,
      section_name: sectionName,
      view_duration: duration,
      session_id: this.sessionId,
      timestamp: new Date().toISOString()
    };

    try {
      const { error } = await this.supabase
        .from('analytics_section_views')
        .insert([viewData]);
      
      if (error) {
        console.error('Analytics: Error logging section view:', error);
      } else {
        console.log('Analytics: Section view logged:', sectionName, duration + 's');
      }
    } catch (error) {
      console.error('Analytics: Error logging section view:', error);
    }
  }

  // Log scroll depth to Supabase
  async logScrollDepth(depthPercentage) {
    if (!this.initialized || !this.supabase) return;

    const scrollData = {
      visitor_id: this.visitorId,
      depth_percentage: depthPercentage,
      session_id: this.sessionId,
      timestamp: new Date().toISOString()
    };

    try {
      const { error } = await this.supabase
        .from('analytics_scroll_depth')
        .insert([scrollData]);
      
      if (error) {
        console.error('Analytics: Error logging scroll depth:', error);
      } else {
        console.log('Analytics: Scroll depth logged:', depthPercentage + '%');
      }
    } catch (error) {
      console.error('Analytics: Error logging scroll depth:', error);
    }
  }
}

// Initialize analytics when page loads
const analytics = new Analytics();

// Wait for both DOM and Supabase to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => analytics.init(), 1000); // Small delay to ensure Supabase is loaded
  });
} else {
  setTimeout(() => analytics.init(), 1000);
}

// Export for global access
window.analytics = analytics;
