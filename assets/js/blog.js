(function () {
    var filters = document.querySelectorAll('[data-blog-filter]');
    var items = document.querySelectorAll('[data-blog-category]');
    var countEl = document.getElementById('blog-filter-count');
    if (!filters.length || !items.length) return;

    function setActive(btn) {
        filters.forEach(function (b) {
            var active = b === btn;
            b.classList.toggle('bg-brand-teal', active);
            b.classList.toggle('text-white', active);
            b.classList.toggle('bg-brand-light', !active);
            b.classList.toggle('text-gray-600', !active);
            b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }

    function applyFilter(slug) {
        var visible = 0;
        items.forEach(function (el) {
            var cats = (el.getAttribute('data-blog-category') || '').split(/\s+/);
            var show = slug === 'todos' || cats.indexOf(slug) !== -1;
            el.classList.toggle('hidden', !show);
            if (show) visible++;
        });
        if (countEl) {
            countEl.textContent =
                visible === 1 ? '1 publicação visível' : visible + ' publicações visíveis';
        }
    }

    filters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            setActive(btn);
            applyFilter(btn.getAttribute('data-blog-filter') || 'todos');
        });
    });

    setActive(filters[0]);
})();
