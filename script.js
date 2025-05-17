// No changes needed from the previous version. 
// The JS interacts with '.js-modal-trigger' and populates the modal based on data attributes, 
// which is independent of whether the layout uses Bulma columns or CSS Grid.
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
            closeModal(); 
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
    // Get all portfolio items that can trigger a modal - Uses the Grid container now
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

        // --- Populate Modal ---
        modalProjectTitle.textContent = projectElement.dataset.title || 'Project Details';
        modalProjectDescription.textContent = projectElement.dataset.description || 'No description available.';
        
        // Populate Skills as Tags
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

        // Populate Optional Link
        const link = projectElement.dataset.link;
        if (modalLinkContainer && modalProjectLink && link && link !== '#') { 
            modalProjectLink.href = link;
            modalLinkContainer.style.display = 'block';
        } else if (modalLinkContainer) {
            modalLinkContainer.style.display = 'none';
        }
        // --- End Populate Modal ---

        // Update Arrow Visibility
        if (modalNavPrev && modalNavNext) {
            modalNavPrev.classList.toggle('is-hidden', currentProjectIndex <= 0);
            modalNavNext.classList.toggle('is-hidden', currentProjectIndex >= portfolioItems.length - 1);
        }
        
        // Activate Modal if not already active
        if (!modal.classList.contains('is-active')) {
            modal.classList.add('is-active');
            htmlElement.classList.add('is-clipped');
        }
    }
    
    function closeModal() {
        if (!modal) return;
        modal.classList.remove('is-active');
        htmlElement.classList.remove('is-clipped');
        currentProjectIndex = -1; 
    }

    // Add click listeners to portfolio items
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

    // Add listeners to modal close buttons
    if(modalCloseButtons) {
        modalCloseButtons.forEach(closeButton => {
            closeButton.addEventListener('click', closeModal);
        });
    }
    
    // Keyboard listeners (Escape and Arrows)
    document.addEventListener('keydown', (event) => {
        if (modal && modal.classList.contains('is-active')) {
            if (event.key === "Escape") {
                closeModal();
            } else if (event.key === "ArrowLeft") {
                // Trigger previous button only if it's visible
                if (modalNavPrev && !modalNavPrev.classList.contains('is-hidden')) {
                    modalNavPrev.click();
                }
            } else if (event.key === "ArrowRight") {
                 // Trigger next button only if it's visible
                 if (modalNavNext && !modalNavNext.classList.contains('is-hidden')) {
                    modalNavNext.click();
                }
            }
        }
    });

    // Add click listeners for modal navigation arrows
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
});