// Content Loading
async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON:', error);
        return null;
    }
}

async function loadAllContent() {
    const [homeData, aboutData, portfolioData, contactData, metadataData] = await Promise.all([
        loadJSON('content/home.json'),
        loadJSON('content/about.json'),
        loadJSON('content/portfolio.json'),
        loadJSON('content/contact.json'),
        loadJSON('content/metadata.json')
    ]);

    if (homeData) renderHomeContent(homeData);
    if (aboutData) renderAboutContent(aboutData);
    if (portfolioData) renderPortfolioContent(portfolioData);
    if (contactData) renderContactContent(contactData);
    if (metadataData) updateMetadata(metadataData);
}

function renderHomeContent(data) {
    const homeSection = document.getElementById('home-content');
    if (!homeSection) return;

    const heroTitle = homeSection.querySelector('h2.title.is-3');
    if (heroTitle) heroTitle.innerHTML = data.hero.title;

    const heroParagraphs = homeSection.querySelectorAll('.content p');
    data.hero.paragraphs.forEach((paragraph, index) => {
        if (heroParagraphs[index]) {
            heroParagraphs[index].innerHTML = paragraph;
        }
    });

    const highlightsTitle = homeSection.querySelector('h3.title.is-4');
    if (highlightsTitle) highlightsTitle.textContent = data.highlights.title;

    const highlightsGrid = homeSection.querySelector('.highlights-grid .columns');
    if (highlightsGrid) {
        highlightsGrid.innerHTML = '';
        data.highlights.sections.forEach(section => {
            const columnDiv = document.createElement('div');
            columnDiv.className = 'column is-one-third-desktop is-half-tablet';
            
            let itemsHTML = '';
            section.items.forEach(item => {
                itemsHTML += `
                    <p class="title is-6 mb-1">${item.title}</p>
                    <p class="is-size-7 has-text-grey${section.items.indexOf(item) < section.items.length - 1 ? ' mb-2' : ''}">${item.subtitle}</p>
                `;
            });

            columnDiv.innerHTML = `
                <div class="box has-background-white-ter">
                    <p class="heading has-text-${section.headingColor} has-text-weight-semibold grid-heading">${section.heading}</p>
                    ${itemsHTML}
                </div>
            `;
            highlightsGrid.appendChild(columnDiv);
        });
    }
}

function renderAboutContent(data) {
    const aboutSection = document.getElementById('about-content');
    if (!aboutSection) return;

    const title = aboutSection.querySelector('h2.title.is-3');
    if (title) title.innerHTML = data.title;

    const contentDiv = aboutSection.querySelector('.content');
    if (contentDiv) {
        let html = `<p>${data.intro}</p>`;
        
        data.sections.forEach(section => {
            html += `<h3 class="title is-5 mt-5 mb-3 has-text-grey-darker">${section.heading}</h3>`;
            html += `<p>${section.content}</p>`;
            
            if (section.additionalParagraph) {
                html += `<p class="mt-4">${section.additionalParagraph}</p>`;
            }

            if (section.familyPhoto) {
                html += `
                    <div class="figure-center-container">
                        <figure class="my-5 about-photo">
                            <div class="image is-16by9">
                               <img src="${section.familyPhoto.src}" alt="${section.familyPhoto.alt}">
                            </div>
                            <figcaption class="is-size-7 has-text-grey has-text-centered mt-1">${section.familyPhoto.caption}</figcaption>
                        </figure>
                    </div>
                `;
            }

            if (section.photos) {
                html += '<div class="columns is-variable is-1 is-mobile is-centered is-vcentered my-5">';
                section.photos.forEach(photo => {
                    html += `
                        <div class="column ${photo.columnClass}">
                            <figure class="about-photo">
                                <div class="image is-${photo.aspectRatio}">
                                    <img src="${photo.src}" alt="${photo.alt}">
                                </div>
                                <figcaption class="is-size-7 has-text-grey has-text-centered mt-1">${photo.caption}</figcaption>
                            </figure>
                        </div>
                    `;
                });
                html += '</div>';
            }

            if (section.conclusion) {
                html += `<p class="mt-4">${section.conclusion}</p>`;
            }
        });
        
        contentDiv.innerHTML = html;
    }
}

function renderPortfolioContent(data) {
    const portfolioSection = document.getElementById('portfolio-content');
    if (!portfolioSection) return;

    const title = portfolioSection.querySelector('h2.title.is-3');
    if (title) title.textContent = data.title;

    const subtitle = portfolioSection.querySelector('p.mb-4');
    if (subtitle) subtitle.textContent = data.subtitle;

    const grid = portfolioSection.querySelector('.portfolio-css-grid');
    if (grid) {
        grid.innerHTML = '';
        data.projects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.className = `portfolio-item js-modal-trigger ${project.tileColor}`;
            projectDiv.setAttribute('data-title', project.title);
            projectDiv.setAttribute('data-description', project.description);
            projectDiv.setAttribute('data-tech', project.technologies);
            projectDiv.innerHTML = `
                <figure class="portfolio-tile-content">
                    <span class="icon is-large"><i class="${project.icon}"></i></span>
                    <div class="tile-text-block">
                        <h3 class="title is-5">${project.shortTitle}</h3>
                        <p>${project.shortDescription}</p>
                    </div>
                </figure>
            `;
            grid.appendChild(projectDiv);
        });
        
    }

    const footer = portfolioSection.querySelector('p.is-size-7.has-text-grey.has-text-centered.mt-5');
    if (footer) footer.textContent = data.footer;
}

function renderContactContent(data) {
    const contactSection = document.getElementById('contact-content');
    if (!contactSection) return;

    const title = contactSection.querySelector('h2.title.is-3');
    if (title) title.textContent = data.title;

    const intro = contactSection.querySelector('.content p');
    if (intro) intro.textContent = data.intro;

    const contactList = contactSection.querySelector('ul.mt-4.mb-5');
    if (contactList) {
        contactList.innerHTML = '';
        data.contacts.forEach((contact, index) => {
            const li = document.createElement('li');
            if (index > 0) li.className = 'mt-2';
            li.innerHTML = `
                <strong>${contact.type}:</strong>
                <a href="${contact.link}" class="has-text-link" ${contact.link.includes('linkedin') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${contact.value}</a>
            `;
            contactList.appendChild(li);
        });
    }

    const cvButton = contactSection.querySelector('a.button');
    if (cvButton && data.cvDownload) {
        cvButton.href = data.cvDownload.href;
        cvButton.setAttribute('download', data.cvDownload.filename);
        cvButton.innerHTML = `
            <span class="icon">
                <i class="${data.cvDownload.icon}"></i>
            </span>
            <span>${data.cvDownload.text}</span>
        `;
    }
}

function updateMetadata(data) {
    document.title = data.site.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', data.site.description);
    
    const profileImg = document.querySelector('.profile-pic img');
    if (profileImg) {
        profileImg.src = data.profile.profileImage;
        profileImg.alt = data.profile.profileImageAlt;
    }
    
    const profileName = document.querySelector('.title.is-2.logo-font');
    if (profileName) profileName.textContent = data.profile.name;
    
    const profileSubtitle = document.querySelector('.subtitle.is-5.has-text-grey-darker');
    if (profileSubtitle) profileSubtitle.textContent = data.profile.title;
    
    const socialLinks = document.querySelector('.social-links');
    if (socialLinks) {
        socialLinks.innerHTML = `
            <a href="${data.social.linkedin.url}" target="_blank" rel="noopener noreferrer" class="has-text-info">${data.social.linkedin.text}</a>
            <span class="mx-2 has-text-grey-light">|</span>
            <a href="${data.social.email.url}" class="has-text-info">${data.social.email.text}</a>
        `;
    }
    
    const schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (schemaScript) {
        schemaScript.textContent = JSON.stringify(data.schema, null, 2);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadAllContent();
    
    // Navigation
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


    // Modal Logic
    const modal = document.getElementById('project-modal');
    const modalContentElement = modal ? modal.querySelector('.modal-card') : null;
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
    let portfolioItems = [];

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
        if (!modal || !modal.classList.contains('is-active')) return;
        modal.classList.remove('is-active');
        htmlElement.classList.remove('is-clipped');
        currentProjectIndex = -1;
        if (modalContentElement) {
            modalContentElement.style.transform = '';
            modalContentElement.style.opacity = '';
        }
    }

    function initializePortfolioEvents() {
        portfolioItems = Array.from(document.querySelectorAll('.portfolio-css-grid .portfolio-item.js-modal-trigger'));
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
    }

    // Initialize portfolio events
    setTimeout(() => {
        initializePortfolioEvents();
    }, 200);

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

    // Modal Swipe Gestures
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const swipeThreshold = 50; 
    const swipeCloseThresholdY = -70;
    const maxVerticalSwipeForNav = 40;

    if (modalContentElement) {
        modalContentElement.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1 && modal.classList.contains('is-active')) {
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
                touchEndX = touchStartX;
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