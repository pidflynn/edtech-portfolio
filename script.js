document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Logic ---
    const navLinks = document.querySelectorAll('.main-nav a.nav-link');
    const contentSections = document.querySelectorAll('.content-pane .content-section');
    const contentPane = document.querySelector('.content-pane');

    function switchContent(targetId) {
        const targetSection = document.getElementById(targetId);
        navLinks.forEach(nav => nav.classList.remove('is-active'));
        const activeLink = document.querySelector(`.main-nav a.nav-link[data-target='${targetId}']`);
        if (activeLink) {
            activeLink.classList.add('is-active');
        }
        contentSections.forEach(section => section.classList.remove('is-active'));
        if (targetSection) {
            targetSection.classList.add('is-active');
            if (contentPane) {
                contentPane.scrollTop = 0;
            }
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('data-target');
            switchContent(targetId);
            closeModal(); // Close modal if open when navigating
        });
    });

    let activeFound = false;
    contentSections.forEach(section => {
        if (section.classList.contains('is-active')) { activeFound = true; }
        else { section.classList.remove('is-active'); }
    });
    if (!activeFound && contentSections.length > 0) {
        const homeSection = document.getElementById('home-content');
        if (homeSection) {
             homeSection.classList.add('is-active');
             const homeLink = document.querySelector('.main-nav a.nav-link[data-target="home-content"]');
             if(homeLink) homeLink.classList.add('is-active');
        }
    }


    // --- Modal Logic ---
    const modal = document.getElementById('project-modal');
    const modalContentElement = modal ? modal.querySelector('.modal-card') : null; // Target for swipe
    const portfolioItems = Array.from(document.querySelectorAll('.portfolio-css-grid .portfolio-item.js-modal-trigger'));
    const modalCloseButtons = modal ? modal.querySelectorAll('.modal-background, .delete') : [];
    const htmlElement = document.documentElement;

    const modalProjectTitle = modal ? document.getElementById('modal-project-title') : null;
    const modalProjectDescription = modal ? document.getElementById('modal-project-description') : null;
    const modalProjectTech = modal ? document.getElementById('modal-project-tech') : null;
    const modalProjectLink = modal ? document.getElementById('modal-project-link') : null;
    const modalLinkContainer = modal ? document.getElementById('modal-link-container') : null;

    const modalNavPrev = modal ? modal.querySelector('.modal-nav-prev') : null;
    const modalNavNext = modal ? modal.querySelector('.modal-nav-next') : null;
    let currentProjectIndex = -1;

    function openModalForProject(projectElement, index) {
        if (!projectElement || !modal) return;
        currentProjectIndex = index;

        if (!modalProjectTitle || !modalProjectDescription || !modalProjectTech) return;

        modalProjectTitle.textContent = projectElement.dataset.title || 'Project Details';
        modalProjectDescription.textContent = projectElement.dataset.description || 'No description available.';
        
        modalProjectTech.innerHTML = '';
        const techString = projectElement.dataset.tech || 'Information not specified.';
        if (techString && techString !== 'Information not specified.') {
            const techArray = techString.split(',').map(skill => skill.trim());
            techArray.forEach(skill => {
                if (skill) {
                    const tag = document.createElement('span');
                    tag.classList.add('tag', 'is-light', 'is-capitalized');
                    tag.textContent = skill;
                    modalProjectTech.appendChild(tag);
                }
            });
        } else {
            const p = document.createElement('p');
            p.textContent = techString;
            modalProjectTech.appendChild(p);
        }

        const link = projectElement.dataset.link;
        if (modalLinkContainer && modalProjectLink && link && link !== '#') {
            modalProjectLink.href = link;
            modalLinkContainer.style.display = 'block';
        } else if (modalLinkContainer) {
            modalLinkContainer.style.display = 'none';
        }

        if (modalNavPrev && modalNavNext) {
            modalNavPrev.classList.toggle('is-hidden', currentProjectIndex <= 0);
            modalNavNext.classList.toggle('is-hidden', currentProjectIndex >= portfolioItems.length - 1);
        }
        
        if (!modal.classList.contains('is-active')) {
            modal.classList.add('is-active');
            htmlElement.classList.add('is-clipped');
        }
    }
    
    function closeModal() {
        if (!modal || !modal.classList.contains('is-active')) return; // Check if modal is active
        modal.classList.remove('is-active');
        htmlElement.classList.remove('is-clipped');
        currentProjectIndex = -1;
        if (modalContentElement) {
            modalContentElement.style.transform = '';
            modalContentElement.style.opacity = '';
        }
    }

    portfolioItems.forEach((trigger, index) => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            openModalForProject(trigger, index);
        });
        trigger.setAttribute('tabindex', '0');
        trigger.style.cursor = 'pointer';
        trigger.addEventListener('keydown', (event) => {
             if (event.key === 'Enter') {
                 event.preventDefault();
                 openModalForProject(trigger, index);
             }
         });
    });

    if(modalCloseButtons) {
        modalCloseButtons.forEach(closeButton => {
            closeButton.addEventListener('click', closeModal);
        });
    }
    
    document.addEventListener('keydown', (event) => {
        if (modal && modal.classList.contains('is-active')) {
            if (event.key === "Escape") {
                closeModal();
            } else if (event.key === "ArrowLeft") {
                if (modalNavPrev && !modalNavPrev.classList.contains('is-hidden')) {
                    modalNavPrev.click();
                }
            } else if (event.key === "ArrowRight") {
                 if (modalNavNext && !modalNavNext.classList.contains('is-hidden')) {
                    modalNavNext.click();
                }
            }
        }
    });

    if (modalNavPrev) {
        modalNavPrev.addEventListener('click', () => {
            if (currentProjectIndex > 0) {
                openModalForProject(portfolioItems[currentProjectIndex - 1], currentProjectIndex - 1);
            }
        });
    }
    if (modalNavNext) {
        modalNavNext.addEventListener('click', () => {
            if (currentProjectIndex < portfolioItems.length - 1) {
                openModalForProject(portfolioItems[currentProjectIndex + 1], currentProjectIndex + 1);
            }
        });
    }

    // --- Swipe Gesture Logic for Modal ---
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const swipeThreshold = 50; 
    const swipeCloseThresholdY = -70; // Made slightly less negative (easier to trigger close)
    const maxVerticalSwipeForNav = 40; // Allow a bit more verticality for nav swipe

    if (modalContentElement) {
        modalContentElement.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1 && modal.classList.contains('is-active')) { // Only if modal is active
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
                touchEndX = touchStartX; // Initialize end points
                touchEndY = touchStartY;
            }
        }, { passive: true });

        modalContentElement.addEventListener('touchmove', (event) => {
            if (event.touches.length === 1 && modal.classList.contains('is-active')) {
                touchEndX = event.touches[0].clientX;
                touchEndY = event.touches[0].clientY;
            }
        }, { passive: true });

        modalContentElement.addEventListener('touchend', (event) => {
            if (event.changedTouches.length === 1 && modal.classList.contains('is-active')) {
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;

                if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaY) < maxVerticalSwipeForNav) {
                    if (deltaX < 0) { 
                        if (modalNavNext && !modalNavNext.classList.contains('is-hidden')) {
                            modalNavNext.click();
                        }
                    } else { 
                        if (modalNavPrev && !modalNavPrev.classList.contains('is-hidden')) {
                            modalNavPrev.click();
                        }
                    }
                } else if (deltaY < swipeCloseThresholdY && Math.abs(deltaX) < Math.abs(deltaY) * 2) { 
                    // Allow more horizontal movement for a predominantly vertical close swipe
                    closeModal();
                }
            }
            touchStartX = 0;
            touchStartY = 0;
            touchEndX = 0;
            touchEndY = 0;
        });
    }
});