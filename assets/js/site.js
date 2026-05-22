(function () {
    function setHeaderOffset() {
        var header = document.getElementById('header');
        if (header) {
            document.documentElement.style.setProperty('--header-offset', header.offsetHeight + 'px');
        }
    }

    function initMobileDrawer() {
        var menuBtn = document.getElementById('menuBtn');
        var mobileMenu = document.getElementById('mobileMenu');
        if (!menuBtn || !mobileMenu) return;
        if (menuBtn.dataset.drawerBound === '1') return;

        var drawer = document.getElementById('mobileDrawer');
        var panel;
        var backdrop;
        var closeBtn;
        var menuIcon = menuBtn.querySelector('i');

        if (!drawer) {
            drawer = document.createElement('div');
            drawer.id = 'mobileDrawer';
            drawer.className = 'mobile-drawer';
            drawer.setAttribute('aria-hidden', 'true');

            backdrop = document.createElement('button');
            backdrop.type = 'button';
            backdrop.className = 'mobile-drawer__backdrop';
            backdrop.setAttribute('aria-label', 'Fechar menu');
            backdrop.setAttribute('data-drawer-close', '');

            panel = document.createElement('aside');
            panel.id = 'mobileMenu';
            panel.className = 'mobile-drawer__panel';
            panel.setAttribute('role', 'dialog');
            panel.setAttribute('aria-modal', 'true');
            panel.setAttribute('aria-labelledby', 'mobileDrawerTitle');

            var head = document.createElement('div');
            head.className = 'mobile-drawer__header';
            head.innerHTML =
                '<p id="mobileDrawerTitle" class="mobile-drawer__title">Menu</p>' +
                '<button type="button" id="menuCloseBtn" class="mobile-drawer__close" aria-label="Fechar menu">' +
                '<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>';

            var body = document.createElement('div');
            body.className = 'mobile-drawer__body';

            while (mobileMenu.firstChild) {
                body.appendChild(mobileMenu.firstChild);
            }

            panel.appendChild(head);
            panel.appendChild(body);
            drawer.appendChild(backdrop);
            drawer.appendChild(panel);

            if (mobileMenu.parentNode) {
                mobileMenu.parentNode.removeChild(mobileMenu);
            }
            document.body.appendChild(drawer);

            closeBtn = document.getElementById('menuCloseBtn');
        } else {
            panel = document.getElementById('mobileMenu');
            backdrop = drawer.querySelector('.mobile-drawer__backdrop');
            closeBtn = document.getElementById('menuCloseBtn');
        }

        var body = panel.querySelector('.mobile-drawer__body');
        if (body) {
            body.querySelectorAll('a').forEach(function (link) {
                link.classList.add('mobile-drawer__link');
                if (link.classList.contains('nav-link-active')) {
                    link.classList.add('mobile-drawer__link--active');
                }
            });
        }

        function openDrawer() {
            drawer.classList.add('mobile-drawer--open');
            drawer.setAttribute('aria-hidden', 'false');
            document.body.classList.add('drawer-open');
            menuBtn.setAttribute('aria-expanded', 'true');
            if (menuIcon) {
                menuIcon.className = 'fa-solid fa-xmark';
            }
            setTimeout(function () {
                closeBtn && closeBtn.focus();
            }, 280);
        }

        function closeDrawer() {
            drawer.classList.remove('mobile-drawer--open');
            drawer.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('drawer-open');
            menuBtn.setAttribute('aria-expanded', 'false');
            if (menuIcon) {
                menuIcon.className = 'fa-solid fa-bars-staggered';
            }
            menuBtn.focus();
        }

        function toggleDrawer() {
            if (drawer.classList.contains('mobile-drawer--open')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        }

        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-controls', 'mobileMenu');

        menuBtn.addEventListener('click', toggleDrawer);
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        if (backdrop) backdrop.addEventListener('click', closeDrawer);

        panel.querySelectorAll('a[href]:not(.js-whatsapp-open)').forEach(function (link) {
            link.addEventListener('click', closeDrawer);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('mobile-drawer--open')) {
                closeDrawer();
            }
        });

        menuBtn.dataset.drawerBound = '1';
        window.SupramedDrawer = { open: openDrawer, close: closeDrawer };
    }

    function initHeader() {
        var header = document.getElementById('header');
        if (!header) return;

        setHeaderOffset();
        window.addEventListener('resize', setHeaderOffset);
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 20);
        });

        initMobileDrawer();
    }

    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 700, once: true, offset: 40 });
        }
    }

    function initImageFallback() {
        var fallback =
            'https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg?auto=compress&cs=tinysrgb&w=1200&fit=crop';
        document.querySelectorAll('main img').forEach(function (img) {
            img.addEventListener(
                'error',
                function onErr() {
                    if (img.src !== fallback) {
                        img.src = fallback;
                    }
                    img.removeEventListener('error', onErr);
                },
                { once: true }
            );
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initHeader();
        initAOS();
        initImageFallback();
    });

    document.addEventListener('supramed:layout-ready', function () {
        initMobileDrawer();
        setHeaderOffset();
    });

    window.SupramedSite = { setHeaderOffset: setHeaderOffset };
})();
