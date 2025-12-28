// Language Management
let currentLang = localStorage.getItem('language') || 'en';

// Set initial language on HTML element (can be done immediately)
document.documentElement.lang = currentLang;
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

// Helper function to get nested translation
function getNestedTranslation(obj, path) {
  try {
    return path.split('.').reduce((current, key) => {
      // Handle array index notation like "items.0.name"
      if (!isNaN(key)) {
        return current ? current[parseInt(key)] : undefined;
      }
      return current ? current[key] : undefined;
    }, obj);
  } catch (error) {
    console.error('Error getting translation for path:', path, error);
    return undefined;
  }
}

// Apply translations
function applyTranslations() {
  // Check if translations object exists
  if (typeof translations === 'undefined') {
    console.error('Translations object not found! Make sure translations.js is loaded before script.js');
    return;
  }
  
  const lang = currentLang;
  console.log('Applying translations for language:', lang);
  
  // Update all elements with data-translate attribute
  let translatedCount = 0;
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    const translation = getNestedTranslation(translations[lang], key);
    if (translation) {
      element.textContent = translation;
      translatedCount++;
    } else {
      console.warn('Translation not found for key:', key);
    }
  });
  console.log('Translated', translatedCount, 'text elements');
  
  // Update all placeholders with data-translate-placeholder attribute
  let placeholderCount = 0;
  document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
    const key = element.getAttribute('data-translate-placeholder');
    const translation = getNestedTranslation(translations[lang], key);
    if (translation) {
      element.placeholder = translation;
      placeholderCount++;
    } else {
      console.warn('Translation not found for placeholder key:', key);
    }
  });
  console.log('Translated', placeholderCount, 'placeholder elements');
  
  // Update language toggle buttons text (both desktop and mobile)
  const langToggle = document.getElementById('langToggle');
  const langToggleMobile = document.getElementById('langToggleMobile');
  
  if (langToggle) {
    const langText = langToggle.querySelector('.lang-text');
    if (langText) {
      langText.textContent = lang === 'en' ? 'عربي' : 'English';
      console.log('Desktop language toggle button updated');
    }
  } else {
    console.warn('Desktop language toggle button not found');
  }
  
  if (langToggleMobile) {
    const langTextMobile = langToggleMobile.querySelector('.lang-text');
    if (langTextMobile) {
      langTextMobile.textContent = lang === 'en' ? 'عربي' : 'English';
      console.log('Mobile language toggle button updated');
    }
  } else {
    console.warn('Mobile language toggle button not found');
  }
  
  // Update body font family for Arabic
  if (lang === 'ar') {
    document.body.style.fontFamily = "'Cairo', 'Inter', sans-serif";
  } else {
    document.body.style.fontFamily = "'Inter', sans-serif";
  }
  
  console.log('Translation complete!');
}

// Toggle language
function toggleLanguage() {
  console.log('Toggling language from', currentLang);
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  localStorage.setItem('language', currentLang);
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  applyTranslations();
  
  // Reinitialize testimonial slider to update direction
  initTestimonialSlider();
  
  // Close mobile menu if open
  const navMenu = document.querySelector('.nav-menu');
  const navToggle = document.querySelector('.nav-toggle');
  if (navMenu && navToggle) {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  }
  
  console.log('Language toggled to', currentLang);
}

// Initialize navigation and other DOM-dependent code
function initNavigation() {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });
  }
}

// Initialize smooth scroll
function initSmoothScroll() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.05)";
  }

  lastScroll = currentScroll;
});

// Animated counter for stats
const animateCounter = (element, target, duration = 2000) => {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target + "+";
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start) + "+";
    }
  }, 16);
};

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".portfolio-item, .team-member, .section-header"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Portfolio Filter
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    // Add active class to clicked button
    button.classList.add("active");

    const filterValue = button.getAttribute("data-filter");

    portfolioItems.forEach((item) => {
      const category = item.getAttribute("data-category");

      if (filterValue === "all" || category === filterValue) {
        item.classList.remove("hidden");
        item.style.opacity = "1";
        item.style.transform = "scale(1)";
      } else {
        item.classList.add("hidden");
        item.style.opacity = "0";
        item.style.transform = "scale(0.8)";
      }
    });
  });
});

// Portfolio card hover effects
portfolioItems.forEach((item) => {
  const card = item.querySelector(".portfolio-card");

  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });
});

// Project data for modal
let projectData = {
  xvFZjo5PgG0: {
    category: "Web Design",
    title: "E-Commerce Platform",
    description:
      "We developed a cutting-edge e-commerce platform that revolutionized online shopping experiences. The project involved creating an intuitive user interface, seamless checkout flow, and robust backend infrastructure to handle thousands of transactions daily.",
    testimonial:
      "Innovate Studio transformed our online presence completely. The new platform increased our sales by 150% and customer satisfaction is at an all-time high. Their attention to detail and understanding of our business needs was exceptional.",
    clientName: "John Smith",
    clientRole: "CEO, TechCorp",
    images: [
      "https://via.placeholder.com/600x400/667eea/ffffff?text=Project+Image+1",
      "https://via.placeholder.com/600x400/764ba2/ffffff?text=Project+Image+2",
      "https://via.placeholder.com/600x400/f093fb/ffffff?text=Project+Image+3",
    ],
    additionalText:
      "The platform features advanced analytics, personalized recommendations, and a mobile-first design approach. We integrated payment gateways, inventory management, and customer relationship management systems to create a comprehensive solution.",
  },
};

// Project Data
projectData = {
  zUjvpoeulSs: {
    category: "Game Development",
    title: "Arcania",
    description:
      "Arcania is an epic 5v5 MOBA game where strategy meets action. Connect with your friends, form unstoppable teams, and engage in intense battles across beautifully crafted arenas. Master unique heroes, each with their own abilities and playstyles, as you fight for dominance in this competitive multiplayer experience.",
    testimonial:
      "Innovate Studio brought our MOBA vision to life with incredible attention to detail. The gameplay is smooth, the mechanics are balanced, and our player community has grown exponentially. They exceeded every expectation and delivered a truly competitive gaming experience.",
    clientName: "Alex Martinez",
    clientRole: "Game Director, Arcania Studios",
    clientImage: "https://randomuser.me/api/portraits/men/45.jpg",
    projectLink: "#",
    videoId: "Nmhs6U8127g",
    technologies: ["Unity", "Photon Engine", "C#", "Node.js", "PostgreSQL", "AWS"],
    details: [
      {
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        title: "Strategic Team-Based Combat",
        text: "Experience intense 5v5 battles where teamwork and strategy are paramount. Each hero features unique abilities and roles - from devastating damage dealers to stalwart defenders. Coordinate with your team, execute perfectly timed combos, and outmaneuver opponents in dynamic arena environments that reward skill and tactical thinking."
      },
      {
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        title: "Diverse Hero Roster",
        text: "Choose from a growing roster of heroes, each with distinct personalities, backstories, and gameplay mechanics. Whether you prefer aggressive assassins, supportive healers, or tactical marksmen, there's a hero that matches your playstyle. Regular updates introduce new heroes and balance changes to keep the meta fresh and exciting."
      },
      {
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        title: "Competitive Ranked System",
        text: "Climb the ranks in our competitive ladder system. From Bronze to Legendary, prove your skills against players worldwide. Seasonal rewards, leaderboards, and tournaments provide endless competitive opportunities. Our advanced matchmaking ensures fair, balanced matches that challenge you to improve with every game."
      }
    ]
  },
  "5Is173XQeyg": {
    category: "Game Development",
    title: "Crypto Blasters",
    description:
      "Take to the skies in Crypto Blasters, featuring revolutionary drone flying mechanics developed from the ground up by our talented team. Engage in fast-paced aerial combat with intuitive controls that make you feel like a true ace pilot. Customize your drone, master advanced maneuvers, and dominate the skies in this adrenaline-fueled experience.",
    testimonial:
      "The flying mechanics in Crypto Blasters are absolutely phenomenal! Innovate Studio created something truly special - the controls are intuitive yet deep, and the aerial combat is unlike anything else on the market. Our players can't get enough of the drone customization and competitive dogfights.",
    clientName: "Emma Rodriguez",
    clientRole: "CEO, SkyNet Gaming",
    clientImage: "https://randomuser.me/api/portraits/women/68.jpg",
    projectLink: "#",
    videoId: "ayJOgFpfXtE",
    technologies: ["Unreal Engine", "C++", "Blockchain Integration", "Multiplayer Networking", "Azure"],
    details: [
      {
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        title: "Revolutionary Flight Physics",
        text: "Our custom-built flight system delivers an unparalleled sense of freedom and control. Experience realistic momentum, drift mechanics, and environmental effects as you navigate through stunning aerial battlegrounds. The physics engine responds to every input with precision, creating an authentic piloting experience that's easy to learn but challenging to master."
      },
      {
        image: "https://images.unsplash.com/photo-1507499036636-f716246c2c23?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        title: "Deep Customization System",
        text: "Build your perfect drone with hundreds of parts, weapons, and upgrades. Mix and match components to create unique loadouts that match your combat style. From lightning-fast interceptors to heavily-armored gunships, every configuration offers distinct advantages. Unlock rare parts through gameplay and showcase your custom designs in the hangar."
      },
      {
        image: "https://images.unsplash.com/photo-1614729939124-032f0b9c5e17?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        title: "Intense Multiplayer Battles",
        text: "Engage in thrilling multiplayer matches across diverse game modes. From team deathmatches to objective-based scenarios, every battle tests your piloting skills and tactical awareness. Advanced matchmaking ensures competitive balance while clan systems let you team up with friends for coordinated strikes. Rise through the ranks and earn exclusive rewards."
      }
    ]
  },
  FiEdMhpgbAI: {
    category: "Game Development",
    title: "Metaforza",
    description:
      "Metaforza delivers the ultimate racing experience with breathtaking graphics, heart-pounding speed, and realistic vehicle physics. Race through stunning environments, from neon-lit city streets to treacherous mountain passes. Customize your dream car and compete against rivals in this high-octane racing game that pushes the limits of visual fidelity and performance.",
    testimonial:
      "Innovate Studio captured the essence of what makes racing games great. Metaforza's graphics are stunning, the physics feel authentic, and the sense of speed is incredible. Our racing community has embraced it wholeheartedly, and the competitive scene is thriving. Truly a masterpiece in racing game development.",
    clientName: "Marcus Chen",
    clientRole: "Creative Director, SpeedDemon Games",
    clientImage: "https://randomuser.me/api/portraits/men/32.jpg",
    projectLink: "#",
    videoId: "AiqVLIg834g",
    technologies: ["Unreal Engine 5", "C++", "Photogrammetry", "Real-time Ray Tracing", "Steam SDK"],
    details: [
      {
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        title: "Photorealistic Graphics",
        text: "Experience racing like never before with cutting-edge graphics powered by Unreal Engine 5. Real-time ray tracing creates stunning reflections and lighting, while photogrammetry-scanned environments deliver unprecedented realism. Dynamic weather and time-of-day systems transform each track, ensuring every race feels fresh and visually spectacular."
      },
      {
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        title: "Authentic Car Collection",
        text: "Drive meticulously recreated vehicles from the world's most prestigious manufacturers. Each car features authentic handling characteristics, engine sounds recorded from real vehicles, and detailed interiors. From classic muscle cars to modern supercars and futuristic prototypes, build your ultimate garage and feel the unique personality of every machine."
      },
      {
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        title: "Career Mode & Online Championships",
        text: "Forge your legacy in an expansive career mode that takes you from amateur racer to racing legend. Compete in diverse championships, unlock sponsorships, and build your reputation. Take the competition online with ranked matches, seasonal leagues, and special events. Prove you're the fastest with global leaderboards and competitive tournaments."
      }
    ]
  },
  KBXnfm4q1NU: {
    category: "Game Development",
    title: "Rampage",
    description:
      "Rampage is an addictive rogue-like bullet heaven game that throws you into endless waves of chaos. Survive hordes of enemies, collect powerful upgrades, and create devastating build combinations. Each run is unique with procedurally generated levels and random power-ups. How long can you survive the rampage?",
    testimonial:
      "Innovate Studio perfectly captured the addictive 'one more run' feeling that makes bullet heaven games so compelling. Rampage's upgrade system is genius - the synergies between powers create amazing moments. Our players are obsessed, with some logging hundreds of hours trying different builds and chasing high scores.",
    clientName: "Jessica Park",
    clientRole: "Indie Developer & Founder",
    clientImage: "https://randomuser.me/api/portraits/women/44.jpg",
    projectLink: "#",
    videoId: "KBXnfm4q1NU",
    technologies: ["Unity", "C#", "Procedural Generation", "Particle Systems", "Steam API"],
    details: [
      {
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        title: "Endless Replayability",
        text: "No two runs are ever the same in Rampage. Procedurally generated levels keep you on your toes, while a vast array of weapons, abilities, and upgrades create countless build possibilities. Experiment with different combinations to discover powerful synergies. The rogue-like structure means every decision matters - will you risk it all for a legendary upgrade?"
      },
      {
        image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        title: "Screen-Filling Action",
        text: "Experience pure bullet heaven chaos as you mow down thousands of enemies in spectacular fashion. Advanced particle systems create mesmerizing visual effects when your maxed-out abilities unleash destruction. The game scales from tense early moments to absurd late-game power fantasies where you become an unstoppable force of nature."
      },
      {
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        title: "Strategic Depth",
        text: "Behind the chaotic action lies deep strategic gameplay. Choose your character from a diverse roster, each with unique starting abilities and scaling potential. Plan your upgrade path, balance offense and defense, and adapt to the evolving threats. Meta progression unlocks new content and abilities, giving you more tools for future runs. Master the art of survival and top the global leaderboards."
      }
    ]
  },
};

// Video Modal Functionality
const initVideoModal = () => {
  const videoModal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  const closeModal = document.getElementById("closeModal");
  const portfolioCards = document.querySelectorAll(".portfolio-card");

  if (!videoModal || !modalVideo) return;

  portfolioCards.forEach((card) => {
    const media = card.querySelector(".portfolio-media");
    const iframe = media?.querySelector(".portfolio-video");
    const portfolioInfo = card.querySelector(".portfolio-info");

    if (iframe && portfolioInfo) {
      const videoId = iframe.getAttribute("data-video-id");

      // Make iframe non-interactive
      iframe.style.pointerEvents = "none";

      // Get project info from card
      const category =
        portfolioInfo.querySelector(".portfolio-category")?.textContent || "";
      const title =
        portfolioInfo.querySelector(".portfolio-title")?.textContent || "";
      const description =
        portfolioInfo.querySelector(".portfolio-description")?.textContent ||
        "";

      // Add click handler to card
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        if (videoId) {
          // Get project data or use defaults
          const data = projectData[videoId] || {
            category: category,
            title: title,
            description: description,
            testimonial:
              "Working with Innovate Studio was an incredible experience. They delivered beyond our expectations and helped us achieve our goals.",
            clientName: "Client Name",
            clientRole: "Client Role",
            images: [
              "https://via.placeholder.com/600x400/667eea/ffffff?text=Project+Image",
            ],
            additionalText:
              "This project showcases our expertise in creating innovative digital solutions that drive business growth and enhance user experiences.",
          };

          // Set video - use long video from projectData if available, otherwise use card video
          const videoToPlay = data.videoId || videoId;
          const origin = encodeURIComponent(window.location.origin);
          modalVideo.referrerPolicy = "strict-origin-when-cross-origin";
          modalVideo.src = `https://www.youtube-nocookie.com/embed/${videoToPlay}?autoplay=1&controls=1&modestbranding=1&rel=0&enablejsapi=1&origin=${origin}`;

          // Populate modal
          document.getElementById("modalCategory").textContent = data.category;
          document.getElementById("modalTitle").textContent = data.title;
          document.getElementById("modalDescription").textContent =
            data.description;
          
          // Update mobile title
          const modalMobileTitle = document.getElementById("modalMobileTitle");
          if (modalMobileTitle) {
            modalMobileTitle.textContent = data.title;
          }

          // Update testimonial section
          const testimonialSection = document.getElementById("testimonialSection");
          if (data.testimonial) {
            const testimonial = document.getElementById("modalTestimonial");
            testimonial.textContent = data.testimonial;

            // Update client info
            const clientInfo = document.getElementById("modalClientInfo");
            clientInfo.innerHTML = `
              <img src="${data.clientImage || 'https://via.placeholder.com/60/667eea/ffffff?text=' + (data.clientName ? data.clientName.charAt(0) : 'C')}" alt="${data.clientName}" class="client-avatar">
              <div class="client-details">
                <strong id="modalClientName">${data.clientName}</strong>
                <span id="modalClientRole">${data.clientRole}</span>
              </div>
            `;
            testimonialSection.style.display = "block";
          } else {
            testimonialSection.style.display = "none";
          }

          // Update project link
          const projectLink = document.getElementById("projectLink");
          if (data.projectLink) {
            projectLink.href = data.projectLink;
            projectLink.style.display = "inline-flex";
          } else {
            projectLink.style.display = "none";
          }

          // Populate technologies
          const techContainer = document.getElementById("projectTechnologies");
          techContainer.innerHTML = data.technologies
            ? data.technologies
                .map((tech) => `<span class="tech-tag">${tech}</span>`)
                .join("")
            : "";

          // Populate project details with images and text
          const detailsSection = document.getElementById("modalDetailsSection");
          if (data.details && data.details.length > 0) {
            detailsSection.innerHTML = data.details.map((detail) => `
              <div class="detail-block">
                ${detail.image ? `<img src="${detail.image}" alt="${detail.title || data.title}" class="detail-image">` : ''}
                <div class="detail-text">
                  ${detail.title ? `<h4>${detail.title}</h4>` : ''}
                  <p>${detail.text}</p>
                </div>
              </div>
            `).join('');
            detailsSection.style.display = "block";
          } else if (data.images && data.images.length > 0) {
            // Fallback: show images with generic text
            detailsSection.innerHTML = data.images.map((imgSrc, index) => `
              <div class="detail-block">
                <img src="${imgSrc}" alt="${data.title} - Screenshot ${index + 1}" class="detail-image">
                <div class="detail-text">
                  <p>${data.additionalText || 'This project showcases our expertise in creating innovative digital solutions.'}</p>
                </div>
              </div>
            `).join('');
            detailsSection.style.display = "block";
          } else {
            detailsSection.style.display = "none";
          }

          videoModal.classList.add("active");
          document.body.style.overflow = "hidden";
        }
      });
    }
  });

  // Close modal handlers (both desktop and mobile)
  const closeModalMobile = document.getElementById("closeModalMobile");
  
  const closeModalHandler = () => {
    videoModal.classList.remove("active");
    modalVideo.src = "";
    document.body.style.overflow = "";
  };
  
  if (closeModal) {
    closeModal.addEventListener("click", closeModalHandler);
  }
  
  if (closeModalMobile) {
    closeModalMobile.addEventListener("click", closeModalHandler);
  }

  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) {
        videoModal.classList.remove("active");
        modalVideo.src = "";
        document.body.style.overflow = "";
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      videoModal &&
      videoModal.classList.contains("active")
    ) {
      videoModal.classList.remove("active");
      if (modalVideo) modalVideo.src = "";
      document.body.style.overflow = "";
    }
  });
};

// Ensure homepage YouTube embeds have correct origin and referrer policy
const fixHomepageYouTubeEmbeds = () => {
 const origin = encodeURIComponent(window.location.origin);
 document.querySelectorAll('iframe.portfolio-video').forEach((iframe) => {
   try {
     const videoId = iframe.getAttribute('data-video-id');
     if (!videoId) return;
     iframe.referrerPolicy = 'strict-origin-when-cross-origin';
     const params = `autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=0&modestbranding=1&rel=0&enablejsapi=1&origin=${origin}`;
     const newSrc = `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
     if (iframe.src !== newSrc) iframe.src = newSrc;
   } catch (e) {
     // no-op
   }
 });
};

// Testimonial Slider Auto-Swipe
let currentTestimonialSlide = 0;
let testimonialAutoSwipe;

const initTestimonialSlider = () => {
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.pagination-dot');
  const totalSlides = document.querySelectorAll('.testimonial-slide').length;

  if (!track || !dots.length) return;

  const updateSlider = (slideIndex) => {
    // Check if RTL
    const isRTL = document.documentElement.dir === 'rtl';
    
    // Use positive translateX for RTL, negative for LTR
    if (isRTL) {
      track.style.transform = `translateX(${slideIndex * 100}%)`;
    } else {
      track.style.transform = `translateX(-${slideIndex * 100}%)`;
    }
    
    // Update active dot
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === slideIndex);
    });
    
    currentTestimonialSlide = slideIndex;
  };

  const nextSlide = () => {
    const nextIndex = (currentTestimonialSlide + 1) % totalSlides;
    updateSlider(nextIndex);
  };

  const startAutoSwipe = () => {
    testimonialAutoSwipe = setInterval(nextSlide, 4000); // Auto-swipe every 4 seconds
  };

  const stopAutoSwipe = () => {
    clearInterval(testimonialAutoSwipe);
  };

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateSlider(index);
      stopAutoSwipe();
      setTimeout(startAutoSwipe, 1000); // Restart auto-swipe after 1 second
    });
  });

  // Pause on hover
  const sliderContainer = document.querySelector('.testimonial-slider');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSwipe);
    sliderContainer.addEventListener('mouseleave', startAutoSwipe);
  }

  // Start auto-swipe
  startAutoSwipe();
  
  // Initial update to set correct position
  updateSlider(0);
};

// Initialize everything when DOM is ready
function initAll() {
  console.log('=== Initializing website ===');
  console.log('Document ready state:', document.readyState);
  
  // Initialize translations
  console.log('1. Initializing translations...');
  applyTranslations();
  
  // Initialize language toggle (both desktop and mobile)
  console.log('2. Setting up language toggle...');
  const langToggle = document.getElementById('langToggle');
  const langToggleMobile = document.getElementById('langToggleMobile');
  
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
    console.log('✓ Desktop language toggle button found and connected');
  } else {
    console.error('✗ Desktop language toggle button NOT found!');
  }
  
  if (langToggleMobile) {
    langToggleMobile.addEventListener('click', toggleLanguage);
    console.log('✓ Mobile language toggle button found and connected');
  } else {
    console.error('✗ Mobile language toggle button NOT found!');
  }
  
  // Initialize navigation
  console.log('3. Initializing navigation...');
  initNavigation();
  
  // Initialize smooth scroll
  console.log('4. Initializing smooth scroll...');
  initSmoothScroll();
  
  // Initialize video features
  console.log('5. Initializing video features...');
  fixHomepageYouTubeEmbeds();
  initVideoModal();
  initTestimonialSlider();
  
  console.log('=== Initialization complete ===');
}

// Initialize when DOM is ready
console.log('Script loaded, waiting for DOM...');
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}


// Visitor tracking
let messages = JSON.parse(localStorage.getItem("portfolioMessages") || "[]");

// Track visitor
const trackVisitor = () => {
  const visitorId = sessionStorage.getItem("visitorId") || generateVisitorId();
  sessionStorage.setItem("visitorId", visitorId);

  // Get visitor location (simplified - in production use a geolocation API)
  getVisitorLocation().then((location) => {
    saveVisitorData(visitorId, location);
    updateCurrentVisitorCount();
  });
};

const generateVisitorId = () => {
  return (
    "visitor_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  );
};

const getVisitorLocation = async () => {
  // Try to get location from IP geolocation service
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      country: data.country_name || "Unknown",
      city: data.city || "Unknown",
      ip: data.ip || "Unknown",
      region: data.region || "Unknown",
    };
  } catch (error) {
    // Fallback if API fails
    return {
      country: "Unknown",
      city: "Unknown",
      ip: "Unknown",
      region: "Unknown",
    };
  }
};

const saveVisitorData = async (visitorId, location) => {
  const visitorData = {
    visitor_id: visitorId,
    timestamp: new Date().toISOString(),
    country: location.country,
    city: location.city,
    region: location.region,
    ip: location.ip,
    page: window.location.pathname,
    user_agent: navigator.userAgent,
  };

  // Try to save to Supabase
  try {
    const supabase = await window.waitForSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('visitors')
        .insert([visitorData]);
      
      if (error) {
        console.error('Error saving visitor to Supabase:', error);
        // Fallback to localStorage
        saveVisitorToLocalStorage(visitorId, location);
      } else {
        console.log('Visitor saved to Supabase successfully');
      }
    } else {
      // Fallback to localStorage
      saveVisitorToLocalStorage(visitorId, location);
    }
  } catch (error) {
    console.error('Error with Supabase:', error);
    // Fallback to localStorage
    saveVisitorToLocalStorage(visitorId, location);
  }
};

const saveVisitorToLocalStorage = (visitorId, location) => {
  const visitorData = {
    id: visitorId,
    timestamp: new Date().toISOString(),
    location: location,
    page: window.location.pathname,
    userAgent: navigator.userAgent,
  };

  const visitors = JSON.parse(
    localStorage.getItem("portfolioVisitors") || "[]"
  );
  // Only add if not already tracked in this session
  const existingVisitor = visitors.find(
    (v) =>
      v.id === visitorId &&
      new Date(v.timestamp).toDateString() === new Date().toDateString()
  );

  if (!existingVisitor) {
    visitors.push(visitorData);
    // Keep only last 1000 visitors
    if (visitors.length > 1000) {
      visitors.splice(0, visitors.length - 1000);
    }
    localStorage.setItem("portfolioVisitors", JSON.stringify(visitors));
  }
};

const updateCurrentVisitorCount = () => {
  // Count unique visitors in last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const visitors = JSON.parse(
    localStorage.getItem("portfolioVisitors") || "[]"
  );
  const recentVisitors = visitors.filter(
    (v) => new Date(v.timestamp) > oneHourAgo
  );
  const uniqueVisitors = new Set(recentVisitors.map((v) => v.id));
  localStorage.setItem("currentVisitorCount", uniqueVisitors.size.toString());
};

// Initialize visitor tracking
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", trackVisitor);
} else {
  trackVisitor();
}

// Form submission
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const name = document.getElementById("contactName").value;
    const email = document.getElementById("contactEmail").value;
    const message = document.getElementById("contactMessage").value;

    // Simple validation
    if (name && email && message) {
      // Get visitor location
      const location = await getVisitorLocation();
      const visitorId = sessionStorage.getItem("visitorId") || "unknown";

      // Prepare message data for Supabase
      const messageData = {
        visitor_id: visitorId,
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString(),
        country: location.country,
        city: location.city,
        region: location.region,
        ip: location.ip,
      };

      // Try to save to Supabase
      try {
        const supabase = await window.waitForSupabase();
        if (supabase) {
          const { data, error } = await supabase
            .from('messages')
            .insert([messageData]);
          
          if (error) {
            console.error('Error saving message to Supabase:', error);
            // Fallback to localStorage
            saveMessageToLocalStorage(name, email, message, visitorId, location);
          } else {
            console.log('Message saved to Supabase successfully');
          }
        } else {
          // Fallback to localStorage
          saveMessageToLocalStorage(name, email, message, visitorId, location);
        }
      } catch (error) {
        console.error('Error with Supabase:', error);
        // Fallback to localStorage
        saveMessageToLocalStorage(name, email, message, visitorId, location);
      }

      // Show success message
      alert("Thank you for your message! We'll get back to you soon.");
      contactForm.reset();
    } else {
      alert("Please fill in all fields.");
    }
  });
}

// Helper function to save message to localStorage
const saveMessageToLocalStorage = (name, email, message, visitorId, location) => {
  const messageData = {
    id: Date.now(),
    name: name,
    email: email,
    message: message,
    timestamp: new Date().toISOString(),
    visitorId: visitorId,
    location: location,
  };

  messages.push(messageData);
  // Keep only last 500 messages
  if (messages.length > 500) {
    messages.splice(0, messages.length - 500);
  }
  localStorage.setItem("portfolioMessages", JSON.stringify(messages));
};

// Parallax effect for hero background
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero-background");
  if (hero) {
    const orbs = hero.querySelectorAll(".gradient-orb");
    orbs.forEach((orb, index) => {
      const speed = 0.5 + index * 0.1;
      orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }
});

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded");

  // Animate hero elements
  const heroTitle = document.querySelector(".hero-title");
  const heroSubtitle = document.querySelector(".hero-subtitle");
  const heroButtons = document.querySelector(".hero-buttons");

  if (heroTitle) {
    setTimeout(() => {
      heroTitle.style.opacity = "1";
      heroTitle.style.transform = "translateY(0)";
    }, 100);
  }

  if (heroSubtitle) {
    setTimeout(() => {
      heroSubtitle.style.opacity = "1";
      heroSubtitle.style.transform = "translateY(0)";
    }, 300);
  }

  if (heroButtons) {
    setTimeout(() => {
      heroButtons.style.opacity = "1";
      heroButtons.style.transform = "translateY(0)";
    }, 500);
  }
});

// Performance: Lazy load images (if you add real images later)
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// Add active state to navigation based on scroll position
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");
    const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelectorAll(".nav-menu a").forEach((link) => {
        link.style.color = "";
      });
      if (navLink) {
        navLink.style.color = "var(--primary)";
      }
    }
  });
});

// Add ripple effect to buttons
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Add CSS for ripple effect dynamically
const style = document.createElement("style");
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
