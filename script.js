/* ================================================================
   Qwetrum Technologies — script.js  (Clean rebuild, no duplicates)
   All code runs inside DOMContentLoaded to avoid "null" errors.
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── DEBOUNCE helper ─────────────────────────────────────── */
    function debounce(fn, ms) {
        let t;
        return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
    }

    /* ── HEADER SCROLL ──────────────────────────────────────── */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.pageYOffset > 50);
    });

    /* ── MOBILE MENU ────────────────────────────────────────── */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu   = document.getElementById('nav-menu');

    navToggle?.addEventListener('click', () => {
        const open = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* ── SMOOTH SCROLL ──────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#contact') { e.preventDefault(); openContactModal(); return; }
            if (href && href !== '#') {
                e.preventDefault();
                const el = document.querySelector(href);
                if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    /* ── TESTIMONIALS ───────────────────────────────────────── */
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDots  = document.querySelectorAll('.dot');
    let curTest = 0;

    function showTestimonial(idx) {
        testimonialCards.forEach(c => c.classList.remove('active'));
        testimonialDots.forEach(d => d.classList.remove('active'));
        testimonialCards[idx]?.classList.add('active');
        testimonialDots[idx]?.classList.add('active');
        curTest = idx;
    }

    testimonialDots.forEach((d, i) => d.addEventListener('click', () => showTestimonial(i)));

    let testInt = setInterval(() =>
        showTestimonial((curTest + 1) % (testimonialCards.length || 1)), 5000);

    const testSlider = document.querySelector('.testimonials__slider');
    testSlider?.addEventListener('mouseenter', () => clearInterval(testInt));
    testSlider?.addEventListener('mouseleave', () => {
        testInt = setInterval(() =>
            showTestimonial((curTest + 1) % (testimonialCards.length || 1)), 5000);
    });

    if (testimonialCards.length) showTestimonial(0);

    /* ── EXPERTS SLIDER ─────────────────────────────────────── */
    const expertCards = document.querySelectorAll('.expert-card');
    let curExp = 0;

    function showExpert(idx) {
        expertCards.forEach((c, i) => c.classList.toggle('active', i === idx));
        curExp = idx;
    }

    document.getElementById('experts-prev')?.addEventListener('click', () =>
        showExpert((curExp - 1 + expertCards.length) % expertCards.length));
    document.getElementById('experts-next')?.addEventListener('click', () =>
        showExpert((curExp + 1) % expertCards.length));

    let expInt = setInterval(() =>
        showExpert((curExp + 1) % (expertCards.length || 1)), 4000);

    const expSlider = document.querySelector('.experts__slider');
    expSlider?.addEventListener('mouseenter', () => clearInterval(expInt));
    expSlider?.addEventListener('mouseleave', () => {
        expInt = setInterval(() =>
            showExpert((curExp + 1) % (expertCards.length || 1)), 4000);
    });

    if (expertCards.length) showExpert(0);

    /* ── CONTACT MODAL ──────────────────────────────────────── */
    const contactModal = document.getElementById('contact-modal');
    const contactForm  = document.querySelector('.contact-form');

    function openContactModal() {
        contactModal?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeContactModal() {
        contactModal?.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* expose globally for anchor href="#contact" calls */
    window.openContactModal  = openContactModal;
    window.closeContactModal = closeContactModal;

    document.getElementById('modal-close')?.addEventListener('click', closeContactModal);
    contactModal?.addEventListener('click', e => { if (e.target === contactModal) closeContactModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && contactModal?.classList.contains('active')) closeContactModal();
    });

    contactForm?.addEventListener('submit', e => {
        e.preventDefault();
        alert('Thank you! We will get back to you soon.');
        contactForm.reset();
        closeContactModal();
    });

    /* ── SCROLL ANIMATIONS (fade-in) ────────────────────────── */
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    /* Team + expert cards get full fade+slide animation */
    document.querySelectorAll('.team-card, .expert-card').forEach(el => {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(28px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        fadeObserver.observe(el);
    });

    /* Project cards: opacity only (no transform — avoids lightbox cursor conflict) */
    const projFadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                projFadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.project-card').forEach(el => {
        el.style.opacity    = '0';
        el.style.transition = 'opacity 0.5s ease';
        projFadeObserver.observe(el);
    });

    /* ── PROJECT IMAGE SLIDER ───────────────────────────────── */
    document.querySelectorAll('.img-slider').forEach(slider => {
        const track   = slider.querySelector('.img-slider__track');
        if (!track) return;
        const imgs    = track.querySelectorAll('img');
        const slDots  = slider.querySelectorAll('.img-slider__dot');
        const prevBtn = slider.querySelector('.img-slider__btn--prev');
        const nextBtn = slider.querySelector('.img-slider__btn--next');
        const total   = imgs.length;
        if (total <= 1) return;

        let cur = 0;
        slider.dataset.current = '0';

        function slideTo(idx) {
            cur = (idx + total) % total;
            track.style.transform = `translateX(-${cur * 100}%)`;
            slDots.forEach((d, i) => d.classList.toggle('active', i === cur));
            slider.dataset.current = String(cur);
        }

        prevBtn?.addEventListener('click', e => { e.stopPropagation(); slideTo(cur - 1); });
        nextBtn?.addEventListener('click', e => { e.stopPropagation(); slideTo(cur + 1); });
        slDots.forEach((d, i) => d.addEventListener('click', e => { e.stopPropagation(); slideTo(i); }));

        /* swipe */
        let tx = 0;
        slider.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
        slider.addEventListener('touchend',   e => {
            const diff = tx - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) slideTo(diff > 0 ? cur + 1 : cur - 1);
        });
    });

    /* ── LIGHTBOX ───────────────────────────────────────────── */
    (function initLightbox() {
        const lb        = document.getElementById('lightbox');
        const lbImg     = document.getElementById('lightbox-img');
        const lbClose   = document.getElementById('lightbox-close');
        const lbPrev    = document.getElementById('lightbox-prev');
        const lbNext    = document.getElementById('lightbox-next');
        const lbDots    = document.getElementById('lightbox-dots');
        const lbCounter = document.getElementById('lightbox-counter');
        if (!lb || !lbImg) return;

        let pool = [], idx = 0;

        function open(imgArr, start) {
            pool = imgArr; idx = start;
            render();
            lb.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function close() {
            lb.classList.remove('active');
            document.body.style.overflow = '';
        }

        function render() {
            if (!pool.length) return;
            lbImg.src = pool[idx].src;
            lbImg.alt = pool[idx].alt || '';
            if (lbCounter) lbCounter.textContent = pool.length > 1 ? `${idx + 1} / ${pool.length}` : '';
            const showNav = pool.length > 1;
            if (lbPrev) lbPrev.style.display = showNav ? 'flex' : 'none';
            if (lbNext) lbNext.style.display = showNav ? 'flex' : 'none';
            if (lbDots) {
                lbDots.innerHTML = '';
                if (pool.length > 1) {
                    pool.forEach((_, i) => {
                        const d = document.createElement('span');
                        d.className = 'lightbox__dot' + (i === idx ? ' active' : '');
                        d.addEventListener('click', () => { idx = i; render(); });
                        lbDots.appendChild(d);
                    });
                }
            }
        }

        /* attach click handler to every project card image area */
        document.querySelectorAll('.project-card').forEach(card => {
            const cardImgs = Array.from(card.querySelectorAll('.img-slider__track img'));
            if (!cardImgs.length) return;
            const imgArea = card.querySelector('.project-card__image');
            if (!imgArea) return;
            imgArea.style.cursor = 'zoom-in';
            imgArea.addEventListener('click', e => {
                /* skip if clicking slider arrow or dot */
                if (e.target.closest('.img-slider__btn') || e.target.closest('.img-slider__dot')) return;
                const slider = card.querySelector('.img-slider');
                const curSlide = slider ? parseInt(slider.dataset.current) || 0 : 0;
                open(cardImgs, curSlide);
            });
        });

        lbClose?.addEventListener('click', close);
        lbPrev?.addEventListener('click', () => { idx = (idx - 1 + pool.length) % pool.length; render(); });
        lbNext?.addEventListener('click', () => { idx = (idx + 1) % pool.length; render(); });
        lb.addEventListener('click', e => { if (e.target === lb) close(); });

        document.addEventListener('keydown', e => {
            if (!lb.classList.contains('active')) return;
            if (e.key === 'Escape')      close();
            if (e.key === 'ArrowLeft')  { idx = (idx - 1 + pool.length) % pool.length; render(); }
            if (e.key === 'ArrowRight') { idx = (idx + 1) % pool.length; render(); }
        });

        /* swipe in lightbox */
        let ltx = 0;
        lb.addEventListener('touchstart', e => { ltx = e.touches[0].clientX; }, { passive: true });
        lb.addEventListener('touchend',   e => {
            const diff = ltx - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { idx = diff > 0 ? (idx + 1) % pool.length : (idx - 1 + pool.length) % pool.length; render(); }
        });
    })();

    /* ── PARALLAX + ACTIVE NAV ──────────────────────────────── */
    window.addEventListener('scroll', debounce(() => {
        const sy = window.pageYOffset;
        document.querySelectorAll('.bg-circle').forEach((c, i) => {
            c.style.transform = `translateY(${sy * (0.1 + i * 0.05)}px)`;
        });
        document.querySelectorAll('section[id], footer[id]').forEach(sec => {
            const top  = sec.offsetTop - 100;
            const link = document.querySelector(`.nav__link[href="#${sec.id}"]`);
            link?.classList.toggle('active', sy > top && sy <= top + sec.offsetHeight);
        });
    }, 20));

    /* ── BUTTON RIPPLE ──────────────────────────────────────── */
    document.querySelectorAll('.btn').forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.addEventListener('click', function (e) {
            const r = document.createElement('span');
            const { width, height, left, top } = this.getBoundingClientRect();
            const size = Math.max(width, height);
            Object.assign(r.style, {
                position: 'absolute', borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                width: size + 'px', height: size + 'px',
                left: (e.clientX - left - size / 2) + 'px',
                top:  (e.clientY - top  - size / 2) + 'px',
                transform: 'scale(0)', pointerEvents: 'none',
                animation: 'ripple-anim .6s ease-out forwards'
            });
            this.appendChild(r);
            setTimeout(() => r.remove(), 700);
        });
    });

    const rs = document.createElement('style');
    rs.textContent = '@keyframes ripple-anim{to{transform:scale(4);opacity:0}}';
    document.head.appendChild(rs);

    document.body.classList.add('page-loaded');
    console.log('%c Qwetrum Technologies', 'color:#41ebaa;font-size:16px;font-weight:bold;');

}); /* end DOMContentLoaded */
