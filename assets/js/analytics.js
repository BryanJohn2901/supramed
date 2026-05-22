(function () {
    var cfg = window.SUPRAMED_CONFIG || {};
    var gtmId = (cfg.gtmId || '').trim();
    if (!gtmId || gtmId.indexOf('XXXX') !== -1) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(gtmId);
    document.head.appendChild(s);

    document.addEventListener('DOMContentLoaded', function () {
        var noscript = document.createElement('noscript');
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.googletagmanager.com/ns.html?id=' + gtmId;
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.cssText = 'display:none;visibility:hidden';
        noscript.appendChild(iframe);
        document.body.insertBefore(noscript, document.body.firstChild);
    });
})();
