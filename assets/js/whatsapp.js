(function () {
    function getConfig() {
        return window.SUPRAMED_CONFIG || {};
    }

    function getNumber() {
        return String(getConfig().whatsappNumber || '551140000000').replace(/\D/g, '');
    }

    function getPageId() {
        var page = document.body && document.body.getAttribute('data-page');
        if (page) return page;
        var path = (window.location.pathname || '/').replace(/\/$/, '') || '/';
        if (path === '/' || path === '/index.html') return 'home';
        if (path.indexOf('/blog/') === 0) {
            var slug = path.replace('/blog/', '');
            return slug ? 'blog-' + slug : 'blog';
        }
        return path.replace(/^\//, '').replace(/\//g, '-') || 'home';
    }

    function getMessage(pageId, custom) {
        if (custom) return custom;
        var messages = getConfig().whatsappMessages || {};
        return messages[pageId] || messages.default || 'Olá! Vim pelo site da Supramed.';
    }

    function buildUrl(message) {
        return 'https://wa.me/' + getNumber() + '?text=' + encodeURIComponent(message);
    }

    function initLinks() {
        var pageId = getPageId();
        document.querySelectorAll('.js-whatsapp, [data-whatsapp]').forEach(function (el) {
            if (el.id === 'whatsapp-float' || el.closest('#whatsapp-widget-root')) return;
            var custom = el.getAttribute('data-whatsapp-message');
            var pageKey = el.getAttribute('data-whatsapp-page') || el.getAttribute('data-whatsapp');
            var msg = custom || getMessage(pageKey || pageId);
            el.setAttribute('href', buildUrl(msg));
            el.setAttribute('target', '_blank');
            el.setAttribute('rel', 'noopener noreferrer');
            if (!el.getAttribute('aria-label')) {
                el.setAttribute('aria-label', 'Abrir conversa no WhatsApp');
            }
        });
    }

    function createFloatingWidget() {
        if (document.getElementById('whatsapp-widget-root')) return;

        var pageId = getPageId();
        var cfg = getConfig();
        var defaultMsg = getMessage(pageId);
        var title = cfg.whatsappWidgetTitle || 'Supramed';
        var greeting =
            cfg.whatsappWidgetGreeting ||
            'Olá! Conte sobre seu projeto de saúde, PPP ou gestão hospitalar — respondemos pelo WhatsApp.';
        var logo = cfg.whatsappWidgetLogo || '/logo.jpeg';

        var root = document.createElement('div');
        root.id = 'whatsapp-widget-root';
        root.className = 'whatsapp-widget-root';

        root.innerHTML =
            '<div id="whatsapp-panel" class="whatsapp-panel" role="dialog" aria-labelledby="whatsapp-panel-title" aria-hidden="true" hidden>' +
            '  <div class="whatsapp-panel__header">' +
            '    <div class="whatsapp-panel__header-glow" aria-hidden="true"></div>' +
            '    <div class="whatsapp-panel__brand">' +
            '      <span class="whatsapp-panel__avatar">' +
            '        <img src="' +
            escapeHtml(logo) +
            '" alt="" width="40" height="40" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
            '        <span class="whatsapp-panel__avatar-fallback" aria-hidden="true"><i class="fa-solid fa-hospital"></i></span>' +
            '      </span>' +
            '      <div class="whatsapp-panel__meta">' +
            '        <p id="whatsapp-panel-title" class="whatsapp-panel__title">' +
            escapeHtml(title) +
            '</p>' +
            '        <p class="whatsapp-panel__status"><span class="whatsapp-panel__status-dot"></span> Atendimento online</p>' +
            '      </div>' +
            '    </div>' +
            '    <button type="button" class="whatsapp-panel__close" aria-label="Fechar">' +
            '      <i class="fa-solid fa-xmark" aria-hidden="true"></i>' +
            '    </button>' +
            '  </div>' +
            '  <div class="whatsapp-panel__chat">' +
            '    <div class="whatsapp-bubble whatsapp-bubble--in">' +
            '      <span class="whatsapp-bubble__name">' +
            escapeHtml(title) +
            '</span>' +
            '      <p class="whatsapp-bubble__text">' +
            escapeHtml(greeting) +
            '</p>' +
            '      <span class="whatsapp-bubble__time">Agora</span>' +
            '    </div>' +
            '    <div class="whatsapp-panel__composer">' +
            '      <label class="whatsapp-panel__label" for="whatsapp-message-input">Sua mensagem</label>' +
            '      <div class="whatsapp-panel__field">' +
            '        <textarea id="whatsapp-message-input" class="whatsapp-panel__input" rows="3" placeholder="Escreva aqui…"></textarea>' +
            '      </div>' +
            '      <div class="whatsapp-panel__actions">' +
            '        <span class="whatsapp-panel__hint"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> para enviar</span>' +
            '        <button type="button" id="whatsapp-send" class="whatsapp-panel__send">' +
            '          <span>Enviar</span><i class="fa-solid fa-paper-plane" aria-hidden="true"></i>' +
            '        </button>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>' +
            '<button type="button" id="whatsapp-float" class="whatsapp-float" aria-label="Abrir conversa no WhatsApp" aria-expanded="false" aria-controls="whatsapp-panel">' +
            '  <span class="whatsapp-float__ring" aria-hidden="true"></span>' +
            '  <span class="whatsapp-float__ring whatsapp-float__ring--delay" aria-hidden="true"></span>' +
            '  <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>' +
            '</button>';

        document.body.appendChild(root);

        var panel = document.getElementById('whatsapp-panel');
        var floatBtn = document.getElementById('whatsapp-float');
        var closeBtn = panel.querySelector('.whatsapp-panel__close');
        var input = document.getElementById('whatsapp-message-input');
        var sendBtn = document.getElementById('whatsapp-send');

        input.value = defaultMsg;

        function openPanel() {
            panel.hidden = false;
            panel.setAttribute('aria-hidden', 'false');
            panel.classList.add('whatsapp-panel--open');
            floatBtn.setAttribute('aria-expanded', 'true');
            root.classList.add('whatsapp-widget-root--open');
            var bubble = panel.querySelector('.whatsapp-bubble--in');
            if (bubble) {
                bubble.style.animation = 'none';
                void bubble.offsetWidth;
                bubble.style.animation = '';
            }
            setTimeout(function () {
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
            }, 120);
        }

        function closePanel() {
            panel.classList.remove('whatsapp-panel--open');
            panel.setAttribute('aria-hidden', 'true');
            floatBtn.setAttribute('aria-expanded', 'false');
            root.classList.remove('whatsapp-widget-root--open');
            setTimeout(function () {
                panel.hidden = true;
            }, 320);
        }

        function togglePanel() {
            if (panel.hidden || !panel.classList.contains('whatsapp-panel--open')) {
                openPanel();
            } else {
                closePanel();
            }
        }

        function sendMessage() {
            var text = (input.value || '').trim();
            if (!text) {
                input.classList.add('whatsapp-panel__input--error');
                input.focus();
                return;
            }
            input.classList.remove('whatsapp-panel__input--error');
            window.open(buildUrl(text), '_blank', 'noopener,noreferrer');
            closePanel();
        }

        floatBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            togglePanel();
        });

        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closePanel();
        });

        sendBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            sendMessage();
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                sendMessage();
            }
        });

        input.addEventListener('input', function () {
            input.classList.remove('whatsapp-panel__input--error');
        });

        document.addEventListener('click', function (e) {
            if (!root.contains(e.target) && panel.classList.contains('whatsapp-panel--open')) {
                closePanel();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && panel.classList.contains('whatsapp-panel--open')) {
                closePanel();
            }
        });
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    window.SupramedWhatsApp = {
        url: buildUrl,
        message: getMessage,
        pageId: getPageId
    };

    function openWhatsappWidget() {
        var floatBtn = document.getElementById('whatsapp-float');
        var panel = document.getElementById('whatsapp-panel');
        if (!floatBtn) return;
        if (panel && panel.hidden) {
            floatBtn.click();
            return;
        }
        if (panel && !panel.classList.contains('whatsapp-panel--open')) {
            floatBtn.click();
            return;
        }
        var input = document.getElementById('whatsapp-message-input');
        if (input) input.focus();
    }

    function initMenuCta() {
        document.querySelectorAll('.js-whatsapp-open').forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                if (window.SupramedDrawer) window.SupramedDrawer.close();
                openWhatsappWidget();
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initLinks();
        createFloatingWidget();
        initMenuCta();
    });
})();
