/**
 * Portfolio Application — Main Entry Point
 * Initializes all components when the DOM is ready.
 */

/* ==========================================================================
   ThemeManager — Dark/Light Theme Management
   Manages theme state, persists to localStorage, respects system preference.
   ========================================================================== */
const ThemeManager = {
    /**
     * Initialize theme from localStorage or system preference.
     * Falls back to system preference if localStorage is unavailable.
     */
    init() {
        let savedTheme = null;

        try {
            savedTheme = localStorage.getItem('theme');
        } catch (e) {
            // localStorage unavailable (private browsing, etc.) — fall back silently
        }

        if (savedTheme === 'dark' || savedTheme === 'light') {
            this.applyTheme(savedTheme);
        } else {
            // No saved preference — detect system preference
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.applyTheme(systemPrefersDark ? 'dark' : 'light');
        }
    },

    /**
     * Toggle between dark and light themes.
     * Adds a brief transition class for smooth color changes.
     */
    toggleTheme() {
        const current = this.getTheme();
        const next = current === 'dark' ? 'light' : 'dark';

        // Add transitioning class for smooth color animation
        document.body.classList.add('theme-transitioning');

        this.applyTheme(next);

        // Persist to localStorage
        try {
            localStorage.setItem('theme', next);
        } catch (e) {
            // localStorage unavailable — theme still applied for this session
        }

        // Remove transitioning class after animation completes
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    },

    /**
     * Get the current theme from the data-theme attribute.
     * @returns {'dark' | 'light'} Current theme value
     */
    getTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    },

    /**
     * Apply a specific theme to the document.
     * Sets data-theme attribute and updates toggle button aria-label.
     * @param {'dark' | 'light'} theme - The theme to apply
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Update toggle button aria-label to indicate the opposite mode
        const toggleBtn = document.querySelector('[data-theme-toggle]');
        if (toggleBtn) {
            const opposite = theme === 'dark' ? 'light' : 'dark';
            toggleBtn.setAttribute('aria-label', `Switch to ${opposite} mode`);
        }
    }
};

/* ==========================================================================
   ProjectRenderer — Project Card Rendering & Filtering
   Renders project cards from data configuration into the DOM grid.
   Validates: Requirements 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 12.2
   ========================================================================== */

const ProjectRenderer = (() => {
    /** @type {HTMLElement|null} */
    let _container = null;

    /** @type {Array} */
    let _projects = [];

    /**
     * Render all project cards into the container using a document fragment
     * for single-paint batch DOM insertion (Requirement 2.4).
     * @param {HTMLElement} container - The DOM element to render cards into
     * @param {Array} projectList - Array of project objects from data.js
     */
    function render(container, projectList) {
        _container = container;
        _projects = projectList;

        // Clear existing content
        container.innerHTML = '';

        // Create document fragment for batch DOM insertion
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < projectList.length; i++) {
            const card = createCard(projectList[i]);
            // Add stagger class for animation delays (stagger-1 through stagger-12)
            const staggerIndex = (i % 12) + 1;
            card.classList.add('stagger-' + staggerIndex);
            fragment.appendChild(card);
        }

        // Single DOM update for performance
        container.appendChild(fragment);
    }

    /**
     * Create a single project card element.
     * Uses textContent for all dynamic user-facing text to prevent XSS (Requirement 12.2).
     * @param {Object} project - A project object from the data layer
     * @returns {HTMLElement} The constructed article card element
     */
    function createCard(project) {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.setAttribute('data-id', project.id);
        card.setAttribute('data-category', project.category);

        // Accessibility attributes (Requirement 2.5)
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'View details for ' + project.title);

        // Apply restricted styling for private projects (Requirement 2.2)
        if (project.isPrivate) {
            card.classList.add('project-card--restricted');
            _buildRestrictedCardContent(card, project);
        } else {
            _buildPublicCardContent(card, project);
        }

        return card;
    }

    /**
     * Build inner content for a public project card.
     * Displays title, subtitle, and tech stack badges (Requirement 2.3).
     * @param {HTMLElement} card - The card element to populate
     * @param {Object} project - The public project data
     */
    function _buildPublicCardContent(card, project) {
        // Title
        const title = document.createElement('h3');
        title.className = 'project-card__title';
        title.textContent = project.title;
        card.appendChild(title);

        // Subtitle
        const subtitle = document.createElement('p');
        subtitle.className = 'project-card__subtitle';
        subtitle.textContent = project.subtitle;
        card.appendChild(subtitle);

        // Tech stack badges — combine all categories, show first 4
        const techDiv = document.createElement('div');
        techDiv.className = 'project-card__tech';

        const allTech = _getAllTechItems(project.techStack);
        const displayTech = allTech.slice(0, 4);

        for (let i = 0; i < displayTech.length; i++) {
            const badge = document.createElement('span');
            badge.className = 'project-card__badge';
            badge.textContent = displayTech[i];
            techDiv.appendChild(badge);
        }

        card.appendChild(techDiv);
    }

    /**
     * Build inner content for a private/restricted project card.
     * Shows title, subtitle, and restricted label with lock indicator (Requirement 2.2).
     * @param {HTMLElement} card - The card element to populate
     * @param {Object} project - The private project data
     */
    function _buildRestrictedCardContent(card, project) {
        // Title
        const title = document.createElement('h3');
        title.className = 'project-card__title';
        title.textContent = project.title;
        card.appendChild(title);

        // Subtitle
        const subtitle = document.createElement('p');
        subtitle.className = 'project-card__subtitle';
        subtitle.textContent = project.subtitle;
        card.appendChild(subtitle);

        // Restricted label badge with lock indicator
        const techDiv = document.createElement('div');
        techDiv.className = 'project-card__tech';

        const badge = document.createElement('span');
        badge.className = 'project-card__badge';
        badge.textContent = '\u{1F512} ' + project.restrictedLabel;
        techDiv.appendChild(badge);

        card.appendChild(techDiv);
    }

    /**
     * Combine all techStack categories into a flat array.
     * @param {Object} techStack - The techStack object with category arrays
     * @returns {string[]} Flat array of all tech items
     */
    function _getAllTechItems(techStack) {
        const items = [];
        const categories = ['backend', 'frontend', 'database', 'deployment'];
        for (let i = 0; i < categories.length; i++) {
            const arr = techStack[categories[i]];
            if (Array.isArray(arr)) {
                for (let j = 0; j < arr.length; j++) {
                    items.push(arr[j]);
                }
            }
        }
        return items;
    }

    /**
     * Filter displayed projects by category (Requirements 13.1, 13.2, 13.3).
     * Hides non-matching cards using the hidden attribute without removing from DOM.
     * Updates filter button active states and aria-pressed attributes.
     * @param {string} category - Category to filter by, or 'all' to show everything
     */
    function filterByCategory(category) {
        const cards = _container
            ? _container.querySelectorAll('.project-card')
            : document.querySelectorAll('.project-card');

        for (let i = 0; i < cards.length; i++) {
            const cardCategory = cards[i].getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                cards[i].removeAttribute('hidden');
            } else {
                cards[i].setAttribute('hidden', '');
            }
        }

        // Update filter button active states
        const filterButtons = document.querySelectorAll('[data-filter]');
        for (let i = 0; i < filterButtons.length; i++) {
            const btn = filterButtons[i];
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('filter-btn--active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('filter-btn--active');
                btn.setAttribute('aria-pressed', 'false');
            }
        }
    }

    /**
     * Returns array of currently visible (not hidden) card elements.
     * @returns {HTMLElement[]} Array of visible project card elements
     */
    function getVisibleProjects() {
        const cards = _container
            ? _container.querySelectorAll('.project-card')
            : document.querySelectorAll('.project-card');

        const visible = [];
        for (let i = 0; i < cards.length; i++) {
            if (!cards[i].hasAttribute('hidden')) {
                visible.push(cards[i]);
            }
        }
        return visible;
    }

    // Public API
    return {
        render: render,
        createCard: createCard,
        filterByCategory: filterByCategory,
        getVisibleProjects: getVisibleProjects
    };
})();

/* ==========================================================================
   ModalController — Project Detail Modal
   Controls opening, closing, content rendering, and accessibility (focus trap).
   Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 8.3, 8.4, 9.5, 11.3, 12.2, 12.3
   ========================================================================== */

const ModalController = (() => {
    /** @type {HTMLElement|null} */
    let _overlay = null;
    /** @type {HTMLElement|null} */
    let _content = null;
    /** @type {HTMLElement|null} */
    let _body = null;
    /** @type {HTMLElement|null} */
    let _title = null;
    /** @type {HTMLElement|null} */
    let _closeBtn = null;
    /** @type {HTMLElement|null} */
    let _previousFocus = null;
    /** @type {Function|null} */
    let _escHandler = null;
    /** @type {Function|null} */
    let _focusTrapHandler = null;

    /**
     * Initialize the modal controller by caching DOM references
     * and attaching close event listeners.
     */
    function init() {
        _overlay = document.getElementById('project-modal');
        _content = _overlay ? _overlay.querySelector('.modal__content') : null;
        _body = document.getElementById('modal-body');
        _title = document.getElementById('modal-title');
        _closeBtn = _overlay ? _overlay.querySelector('[data-close]') : null;

        if (!_overlay || !_content || !_body || !_title) {
            console.warn('ModalController: Required modal DOM elements not found.');
            return;
        }

        // Close via close button click
        if (_closeBtn) {
            _closeBtn.addEventListener('click', close);
        }

        // Close via backdrop click (clicking the overlay itself, not the content)
        _overlay.addEventListener('click', function (e) {
            if (e.target === _overlay) {
                close();
            }
        });
    }

    /**
     * Open modal for a given project ID.
     * Returns early with a console warning if the project is not found (Requirement 11.3).
     * @param {string} projectId - The unique project id to display
     */
    function open(projectId) {
        // Validate projectId — return early if invalid (Requirement 11.3)
        if (!projectId || typeof projectId !== 'string') {
            console.warn('ModalController: Invalid projectId provided:', projectId);
            return;
        }

        const project = projects.find(function (p) { return p.id === projectId; });
        if (!project) {
            console.warn('ModalController: No project found with id "' + projectId + '"');
            return;
        }

        // Store the element that triggered the modal for focus restoration (Requirement 3.7)
        _previousFocus = document.activeElement;

        // Render appropriate content
        renderContent(project);

        // Show modal: remove hidden attribute, add active class
        _overlay.removeAttribute('hidden');
        _overlay.classList.add('modal--active');

        // Disable body scroll (Requirement 3.5)
        document.body.style.overflow = 'hidden';

        // Set up Escape key listener (Requirement 3.6)
        _escHandler = function (e) {
            if (e.key === 'Escape') {
                close();
            }
        };
        document.addEventListener('keydown', _escHandler);

        // Focus the close button as the first focusable element
        if (_closeBtn) {
            _closeBtn.focus();
        }

        // Trap focus within modal (Requirement 3.8, 8.3)
        trapFocus();
    }

    /**
     * Close modal, restore scroll, restore focus, and clean up listeners.
     */
    function close() {
        if (!_overlay) return;

        // Hide modal
        _overlay.classList.remove('modal--active');
        _overlay.setAttribute('hidden', '');

        // Restore body scroll (Requirement 3.5)
        document.body.style.overflow = '';

        // Remove escape listener
        if (_escHandler) {
            document.removeEventListener('keydown', _escHandler);
            _escHandler = null;
        }

        // Release focus trap
        releaseFocus();

        // Restore focus to the element that triggered the modal (Requirement 3.7, 8.3)
        if (_previousFocus && _previousFocus.focus) {
            _previousFocus.focus();
        }
        _previousFocus = null;
    }

    /**
     * Render modal content based on project privacy status.
     * Uses textContent for the title (Requirement 12.2).
     * @param {Object} project - The project object to render
     */
    function renderContent(project) {
        // Set title using textContent for XSS safety (Requirement 12.2)
        _title.textContent = project.title;

        // Render appropriate view based on privacy
        if (project.isPrivate) {
            _body.innerHTML = _renderRestrictedContent(project);
        } else {
            _body.innerHTML = _renderFullContent(project);
        }
    }

    /**
     * Build full detail HTML for public projects (Requirement 3.2).
     * Includes description, features, tech stack, languages, and links.
     * All external links use target="_blank" rel="noopener noreferrer" (Requirement 8.4).
     * Images use loading="lazy" (Requirement 9.5).
     * @param {Object} project - A public project object
     * @returns {string} HTML string for the modal body
     */
    function _renderFullContent(project) {
        let html = '';

        // Subtitle
        html += '<p class="modal__subtitle">' + _escapeHtml(project.subtitle) + '</p>';

        // Description
        html += '<p class="modal__description">' + _escapeHtml(project.description) + '</p>';

        // Features list
        if (project.features && project.features.length > 0) {
            html += '<h4 class="modal__section-heading">Features</h4>';
            html += '<ul class="modal__features-list">';
            for (let i = 0; i < project.features.length; i++) {
                html += '<li>' + _escapeHtml(project.features[i]) + '</li>';
            }
            html += '</ul>';
        }

        // Tech Stack grouped by category
        if (project.techStack) {
            const categories = ['backend', 'frontend', 'database', 'deployment'];
            const categoryLabels = { backend: 'Backend', frontend: 'Frontend', database: 'Database', deployment: 'Deployment' };
            let hasTech = false;

            let techHtml = '<h4 class="modal__section-heading">Tech Stack</h4>';
            techHtml += '<div class="modal__tech-stack">';

            for (let i = 0; i < categories.length; i++) {
                const cat = categories[i];
                const items = project.techStack[cat];
                if (Array.isArray(items) && items.length > 0) {
                    hasTech = true;
                    techHtml += '<div class="modal__tech-category">';
                    techHtml += '<span class="modal__tech-label">' + categoryLabels[cat] + ':</span> ';
                    for (let j = 0; j < items.length; j++) {
                        techHtml += '<span class="modal__tech-badge">' + _escapeHtml(items[j]) + '</span>';
                    }
                    techHtml += '</div>';
                }
            }

            techHtml += '</div>';

            if (hasTech) {
                html += techHtml;
            }
        }

        // Languages with percentage bars
        if (project.languages && Object.keys(project.languages).length > 0) {
            html += '<h4 class="modal__section-heading">Languages</h4>';
            html += '<div class="modal__languages">';

            const langColors = {
                Python: '#3572A5',
                JavaScript: '#f1e05a',
                TypeScript: '#3178c6',
                HTML: '#e34c26',
                CSS: '#563d7c',
                Other: '#8b8b8b'
            };

            // Bar visualization
            html += '<div class="modal__lang-bar">';
            const langKeys = Object.keys(project.languages);
            for (let i = 0; i < langKeys.length; i++) {
                const lang = langKeys[i];
                const pct = project.languages[lang];
                const color = langColors[lang] || '#8b8b8b';
                html += '<div class="modal__lang-segment" style="width:' + pct + '%;background-color:' + color + ';" title="' + _escapeHtml(lang) + ' ' + pct + '%"></div>';
            }
            html += '</div>';

            // Legend
            html += '<div class="modal__lang-legend">';
            for (let i = 0; i < langKeys.length; i++) {
                const lang = langKeys[i];
                const pct = project.languages[lang];
                const color = langColors[lang] || '#8b8b8b';
                html += '<span class="modal__lang-item"><span class="modal__lang-dot" style="background-color:' + color + ';"></span>' + _escapeHtml(lang) + ' ' + pct + '%</span>';
            }
            html += '</div>';

            html += '</div>';
        }

        // Links section (Requirement 8.4: target="_blank" rel="noopener noreferrer")
        if (project.repoUrl || project.liveUrl) {
            html += '<div class="modal__links">';
            if (project.repoUrl) {
                html += '<a href="' + _escapeHtml(project.repoUrl) + '" class="modal__link" target="_blank" rel="noopener noreferrer">View Repository</a>';
            }
            if (project.liveUrl) {
                html += '<a href="' + _escapeHtml(project.liveUrl) + '" class="modal__link" target="_blank" rel="noopener noreferrer">Live Demo</a>';
            }
            html += '</div>';
        }

        // Image with lazy loading if available (Requirement 9.5)
        if (project.image) {
            html += '<img src="' + _escapeHtml(project.image) + '" alt="' + _escapeHtml(project.title) + ' screenshot" class="modal__image" loading="lazy">';
        }

        return html;
    }

    /**
     * Build restricted HTML for private projects (Requirements 3.3, 3.4, 12.3).
     * Only shows: restricted badge, subtitle, high-level description, and a note.
     * Does NOT expose repo URLs, detailed features, or internal system names.
     * @param {Object} project - A private project object
     * @returns {string} HTML string for the restricted modal body
     */
    function _renderRestrictedContent(project) {
        let html = '';

        // Restricted badge
        html += '<div class="modal__restricted-badge">\u{1F512} ' + _escapeHtml(project.restrictedLabel) + '</div>';

        // Subtitle
        html += '<p class="modal__subtitle">' + _escapeHtml(project.subtitle) + '</p>';

        // Brief description only
        html += '<p class="modal__description">' + _escapeHtml(project.description) + '</p>';

        // Restricted access note
        html += '<p class="modal__restricted-note">This is an internal project with restricted access.</p>';

        return html;
    }

    /**
     * Trap keyboard focus within the modal (Tab and Shift+Tab).
     * Requirement 3.8, 8.3.
     */
    function trapFocus() {
        _focusTrapHandler = function (e) {
            if (e.key !== 'Tab') return;

            const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
            const focusableElements = _overlay.querySelectorAll(focusableSelectors);

            if (focusableElements.length === 0) return;

            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                // Shift+Tab: if on first element, wrap to last
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                // Tab: if on last element, wrap to first
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        };

        _overlay.addEventListener('keydown', _focusTrapHandler);
    }

    /**
     * Remove focus trap event listener.
     */
    function releaseFocus() {
        if (_focusTrapHandler) {
            _overlay.removeEventListener('keydown', _focusTrapHandler);
            _focusTrapHandler = null;
        }
    }

    /**
     * Simple HTML escape for safe insertion into innerHTML templates.
     * Since data comes from our own data.js, this is a defense-in-depth measure.
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    function _escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Public API
    return {
        init: init,
        open: open,
        close: close,
        renderContent: renderContent,
        trapFocus: trapFocus,
        releaseFocus: releaseFocus
    };
})();

/* ==========================================================================
   AnimationEngine — Scroll-Based Reveal Animations
   Uses IntersectionObserver to apply reveal classes when elements enter viewport.
   Respects prefers-reduced-motion user preference.
   Validates: Requirements 5.1, 5.2, 5.3
   ========================================================================== */

const AnimationEngine = {
    _observer: null,
    _reducedMotion: false,

    /**
     * Initialize the animation engine.
     * Checks prefers-reduced-motion — if active, makes everything visible immediately.
     * Otherwise creates an IntersectionObserver for scroll-based reveals.
     */
    init() {
        // Check prefers-reduced-motion
        this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // If reduced motion, make everything visible immediately and return
        if (this._reducedMotion) {
            const elements = document.querySelectorAll('[data-animate]');
            elements.forEach(el => el.classList.add('revealed'));
            return;
        }

        // Create IntersectionObserver
        this._observer = new IntersectionObserver(this.onIntersect.bind(this), {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    },

    /**
     * Start observing elements for viewport entry.
     * @param {NodeList|Array} elements - Elements to observe
     */
    observe(elements) {
        if (!this._observer) return;
        elements.forEach(el => this._observer.observe(el));
    },

    /**
     * Stop observing elements.
     * @param {NodeList|Array} elements - Elements to unobserve
     */
    unobserve(elements) {
        if (!this._observer) return;
        elements.forEach(el => this._observer.unobserve(el));
    },

    /**
     * IntersectionObserver callback — applies reveal class when elements enter viewport.
     * Each element is only animated once (unobserved after reveal).
     * @param {IntersectionObserverEntry[]} entries - Observer entries
     */
    onIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                this._observer.unobserve(entry.target); // Only animate once
            }
        });
    }
};

/* ==========================================================================
   NavigationController — Smooth Scrolling & Active Section Highlighting
   Handles smooth scrolling navigation, scroll spy, and mobile hamburger menu.
   Validates: Requirements 6.1, 6.2, 6.3
   ========================================================================== */

const NavigationController = {
    /** @type {IntersectionObserver|null} */
    _observer: null,

    /** @type {NodeList|null} */
    _navLinks: null,

    /** @type {HTMLElement|null} */
    _hamburger: null,

    /** @type {HTMLElement|null} */
    _navMenu: null,

    /** @type {boolean} */
    _isMenuOpen: false,

    /**
     * Set up nav links, hamburger menu, scroll spy, and resize handler.
     */
    init() {
        this._navLinks = document.querySelectorAll('.nav__link');
        this._hamburger = document.querySelector('.nav__hamburger');
        this._navMenu = document.querySelector('.nav__links');

        // Set up click handlers on nav links (Requirement 6.1)
        this._navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollTo(targetId);
                // Close mobile menu if open
                if (this._isMenuOpen) this.toggleMobileMenu();
            });
        });

        // Set up hamburger menu toggle (Requirement 6.3)
        if (this._hamburger) {
            this._hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Set up scroll spy using IntersectionObserver (Requirement 6.2)
        this._setupScrollSpy();

        // Handle resize — close mobile menu if viewport grows past breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this._isMenuOpen) {
                this.toggleMobileMenu();
            }
        });
    },

    /**
     * Smooth scroll to a section by ID (Requirement 6.1).
     * Accounts for fixed header height offset.
     * @param {string} sectionId - The ID of the target section
     */
    scrollTo(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerOffset = 80; // Fixed header height
            const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
        }
    },

    /**
     * Update the active nav link based on scroll spy.
     * Called internally by the IntersectionObserver callback.
     */
    updateActiveLink() {
        // Handled by the IntersectionObserver in _setupScrollSpy
    },

    /**
     * Toggle the mobile hamburger menu open/closed (Requirement 6.3).
     * Updates aria-expanded for accessibility.
     */
    toggleMobileMenu() {
        this._isMenuOpen = !this._isMenuOpen;
        this._navMenu.classList.toggle('nav__links--open', this._isMenuOpen);
        this._hamburger.classList.toggle('nav__hamburger--active', this._isMenuOpen);
        this._hamburger.setAttribute('aria-expanded', String(this._isMenuOpen));
    },

    /**
     * Set up IntersectionObserver-based scroll spy (Requirement 6.2).
     * Highlights the navigation link corresponding to the currently visible section.
     * @private
     */
    _setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const options = { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' };

        this._observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this._navLinks.forEach(link => {
                        link.classList.toggle('nav__link--active',
                            link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, options);

        sections.forEach(section => this._observer.observe(section));
    }
};

/* ========================================================================== */

/* ==========================================================================
   handleImageError — Image 404 Fallback (Requirement 11.4)
   Displays a placeholder gradient with project initials when an image fails.
   ========================================================================== */

/**
 * Handle image load errors by replacing the broken image with a gradient placeholder
 * showing the project initials derived from the alt text.
 * @param {HTMLImageElement} img - The image element that failed to load
 */
function handleImageError(img) {
    // Get project initials from the image alt text
    const alt = img.getAttribute('alt') || 'P';
    const initials = alt.split(' ').map(function (w) { return w[0]; }).join('').substring(0, 2).toUpperCase();

    // Hide the broken image
    img.style.display = 'none';

    // Create a gradient placeholder with initials
    const placeholder = document.createElement('div');
    placeholder.className = 'project-image-placeholder';
    placeholder.textContent = initials;
    placeholder.setAttribute('aria-label', alt + ' (image unavailable)');

    // Insert placeholder before the hidden image
    img.parentNode.insertBefore(placeholder, img);
}

/* ==========================================================================
   Application Initialization
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

/**
 * Initialize all portfolio components in sequence.
 * Wires ThemeManager, ProjectRenderer, ModalController, AnimationEngine,
 * and NavigationController together with appropriate event handlers.
 *
 * Validates: Requirements 1.1, 1.4, 11.1, 11.4
 */
function initializeApp() {
    // Step 1: Initialize ThemeManager (Requirement 1.1)
    ThemeManager.init();

    // Step 2: Attach theme toggle click handler (Requirement 4.1)
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () { ThemeManager.toggleTheme(); });
    }

    // Step 3: Render projects with error handling (Requirements 1.4, 11.1)
    const container = document.getElementById('projects-grid');
    if (typeof projects !== 'undefined' && Array.isArray(projects) && projects.length > 0 && container) {
        ProjectRenderer.render(container, projects);

        // Attach click and keyboard handlers to all rendered cards (Requirement 3.1)
        const cards = container.querySelectorAll('.project-card');
        cards.forEach(function (card) {
            const projectId = card.getAttribute('data-id');
            card.addEventListener('click', function () { ModalController.open(projectId); });
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    ModalController.open(projectId);
                }
            });
        });
    } else {
        // Fallback: projects data not loaded or empty (Requirement 11.1)
        // Hero and about sections remain functional; show fallback message in projects grid
        if (container) {
            container.innerHTML = '<p class="projects__fallback">Projects could not be loaded. Please try refreshing the page.</p>';
        }
    }

    // Step 4: Initialize ModalController (Requirement 3.1)
    ModalController.init();

    // Step 5: Attach filter button handlers (Requirement 13.1)
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var category = btn.getAttribute('data-filter');
            ProjectRenderer.filterByCategory(category);
        });
    });

    // Step 6: Initialize AnimationEngine and observe animated elements (Requirement 5.1)
    AnimationEngine.init();
    var animatedElements = document.querySelectorAll('[data-animate]');
    AnimationEngine.observe(animatedElements);

    // Also observe individual project cards for staggered reveal (Requirement 5.3)
    var projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        AnimationEngine.observe(projectCards);
    }

    // Step 7: Initialize NavigationController (Requirement 6.1)
    NavigationController.init();

    // Step 8: Update footer year dynamically
    var yearElement = document.getElementById('footer-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Step 9: Attach image error handlers globally for any project images (Requirement 11.4)
    // This uses event delegation on the document for any lazy-loaded images
    document.addEventListener('error', function (e) {
        if (e.target && e.target.tagName === 'IMG' && e.target.closest('.modal__body, .project-card')) {
            handleImageError(e.target);
        }
    }, true); // Use capture phase to catch img errors
}
