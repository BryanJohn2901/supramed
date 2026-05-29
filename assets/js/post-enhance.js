(function () {
    var pageId = document.body && document.body.getAttribute('data-page');
    if (!pageId || pageId.indexOf('blog-') !== 0) return;

    var META = {
        'blog-hospital-feira-de-santana': {
            category: 'Notícias · Gestão Pública',
            date: '29 Mai 2026',
            readMin: 7,
            updated: '29 Mai 2026'
        }
    };

    var RELATED = {};

    var meta = META[pageId] || {};
    var shareUrl = encodeURIComponent(window.location.href);

    function getBreadcrumbItems() {
        var scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (var i = 0; i < scripts.length; i++) {
            try {
                var data = JSON.parse(scripts[i].textContent);
                if (data['@type'] === 'BreadcrumbList' && data.itemListElement) {
                    return data.itemListElement.map(function (el) {
                        return { name: el.name, url: el.item };
                    });
                }
            } catch (e) { /* ignore */ }
        }
        return null;
    }

    function enhanceBreadcrumb(nav) {
        var items = getBreadcrumbItems();
        if (!items || items.length < 2) return;
        nav.className = 'post-breadcrumb';
        nav.setAttribute('aria-label', 'Breadcrumb');
        nav.innerHTML = items.map(function (item, idx) {
            var isLast = idx === items.length - 1;
            var sep = idx > 0 ? '<i class="fa-solid fa-chevron-right post-breadcrumb__sep" aria-hidden="true"></i>' : '';
            if (isLast) {
                return sep + '<span class="post-breadcrumb__current">' + item.name + '</span>';
            }
            return sep + '<a href="' + item.url + '" class="post-breadcrumb__link">' + item.name + '</a>';
        }).join('');
    }

    function buildToc(article) {
        var headings = article.querySelectorAll('h2[id]');
        if (headings.length < 2) return '';
        var links = '';
        headings.forEach(function (h) {
            links += '<li><a href="#' + h.id + '">' + h.textContent + '</a></li>';
        });
        return (
            '<div class="post-sidebar__block post-sidebar__toc">' +
                '<h3 class="post-sidebar__title">Neste artigo</h3>' +
                '<nav aria-label="Sumário"><ul class="post-sidebar__toc-list">' + links + '</ul></nav>' +
            '</div>'
        );
    }

    function buildSidebar(article) {
        var tocHtml = buildToc(article);
        var aside = document.createElement('aside');
        aside.className = 'post-sidebar';
        aside.innerHTML =
            '<div class="post-sidebar__card">' +
                '<h3 class="post-sidebar__title">Sobre este artigo</h3>' +
                '<dl class="post-sidebar__meta">' +
                    (meta.category ? '<div><dt>Categoria</dt><dd>' + meta.category + '</dd></div>' : '') +
                    (meta.date ? '<div><dt>Publicado em</dt><dd><time>' + meta.date + '</time></dd></div>' : '') +
                    (meta.readMin ? '<div><dt>Leitura</dt><dd>' + meta.readMin + ' min</dd></div>' : '') +
                    (meta.updated ? '<div><dt>Atualizado</dt><dd><time>' + meta.updated + '</time></dd></div>' : '') +
                '</dl>' +
            '</div>' +
            '<div class="post-sidebar__card">' +
                '<h3 class="post-sidebar__title">Compartilhar</h3>' +
                '<div class="post-sidebar__share">' +
                    '<a href="https://www.linkedin.com/sharing/share-offsite/?url=' + shareUrl + '" rel="noopener noreferrer" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>' +
                    '<a href="https://wa.me/?text=' + shareUrl + '" rel="noopener noreferrer" target="_blank" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>' +
                '</div>' +
            '</div>' +
            '<div class="post-sidebar__card">' +
                '<h3 class="post-sidebar__title">Explore o site</h3>' +
                '<nav class="post-sidebar__links">' +
                    '<a href="/nossas-atuacoes/"><i class="fa-solid fa-briefcase-medical"></i> Nossa atuação</a>' +
                    '<a href="/cases/"><i class="fa-solid fa-hospital"></i> Cases de sucesso</a>' +
                    '<a href="/fale-conosco/"><i class="fa-solid fa-comments"></i> Fale conosco</a>' +
                '</nav>' +
            '</div>' +
            tocHtml +
            '</aside>';
        return aside;
    }

    function renderRelated() {
        var section = document.querySelector('.post-related');
        var grid = document.querySelector('[data-post-related-grid]');
        var posts = RELATED[pageId];
        if (!section) return;
        if (!grid || !posts || !posts.length) {
            section.remove();
            return;
        }
        function relatedCard(post, delay) {
            return (
                '<article class="post-related-card group" data-aos="fade-up" data-aos-delay="' + delay + '">' +
                    '<a href="' + post.href + '" class="post-related-card__media">' +
                        '<img loading="lazy" decoding="async" src="' + post.image + '" alt="' + post.alt + '" class="post-related-card__img">' +
                        '<span class="post-related-card__tag">' + post.category + '</span>' +
                    '</a>' +
                    '<div class="post-related-card__body">' +
                        '<p class="post-related-card__meta"><i class="fa-regular fa-calendar"></i> ' + post.date + ' · ' + post.min + ' min</p>' +
                        '<h3 class="post-related-card__title"><a href="' + post.href + '">' + post.title + '</a></h3>' +
                        '<p class="post-related-card__excerpt">' + post.excerpt + '</p>' +
                        '<a href="' + post.href + '" class="post-related-card__link">Ler artigo <i class="fa-solid fa-arrow-right"></i></a>' +
                    '</div>' +
                '</article>'
            );
        }
        grid.innerHTML = posts.map(function (p, i) {
            return relatedCard(p, i * 100);
        }).join('');
    }

    function initLayout() {
        var section = document.querySelector('.section-page .container');
        if (!section) return;

        var nav = section.querySelector('nav');
        var article = section.querySelector('.max-w-3xl.mx-auto');
        if (!nav || !article || article.closest('.post-layout')) return;

        enhanceBreadcrumb(nav);

        var layout = document.createElement('div');
        layout.className = 'post-layout';
        article.classList.remove('max-w-3xl', 'mx-auto');
        article.classList.add('post-article');

        layout.appendChild(buildSidebar(article));
        layout.appendChild(article);
        nav.insertAdjacentElement('afterend', layout);
    }

    document.addEventListener('DOMContentLoaded', function () {
        initLayout();
        renderRelated();
    });
})();
