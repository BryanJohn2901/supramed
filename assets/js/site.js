(function () {
    function setHeaderOffset() {
        const header = document.getElementById('header');
        if (header) {
            document.documentElement.style.setProperty('--header-offset', header.offsetHeight + 'px');
        }
    }

    function initHeader() {
        const header = document.getElementById('header');
        const menuBtn = document.getElementById('menuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        if (!header) return;

        setHeaderOffset();
        window.addEventListener('resize', setHeaderOffset);
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 20);
        });

        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', function () {
                mobileMenu.classList.toggle('hidden');
            });
            mobileMenu.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    mobileMenu.classList.add('hidden');
                });
            });
        }
    }

    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 700, once: true, offset: 40 });
        }
    }

    function initImageFallback() {
        const fallback = 'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg?auto=compress&cs=tinysrgb&w=1200&fit=crop';
        document.querySelectorAll('main img').forEach(function (img) {
            img.addEventListener('error', function onErr() {
                if (img.src !== fallback) {
                    img.src = fallback;
                }
                img.removeEventListener('error', onErr);
            }, { once: true });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initHeader();
        initAOS();
        initImageFallback();
    });

    window.SupramedSite = { setHeaderOffset: setHeaderOffset };
})();
