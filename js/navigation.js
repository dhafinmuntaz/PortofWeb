/**
 * Shared responsive navigation menu.
 */
(function () {
    'use strict';

    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.global-header');

    if (!toggle || !nav) return;

    function closeMenu() {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
    }

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', event => {
        if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });

    let previousScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > previousScrollY && currentScrollY > 80) {
            closeMenu();
            header.classList.add('is-hidden');
        } else {
            header.classList.remove('is-hidden');
        }

        previousScrollY = currentScrollY;
    }, { passive: true });
})();
