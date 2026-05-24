(function () {
    var NAV = [
        { id: 'home', href: '/', label: 'Home' },
        { id: 'atuacao', href: '/nossas-atuacoes/', label: 'Nossa Atuação' },
        { id: 'quem-somos', href: '/quem-somos/', label: 'Quem Somos' },
        { id: 'cases', href: '/cases/', label: 'Cases' },
        { id: 'fale-conosco', href: '/fale-conosco/', label: 'Fale Conosco' }
    ];

    function navClass(id, current) {
        var base = 'px-5 py-2.5 rounded-full transition-all duration-300';
        if (id === current) {
            return base + ' nav-link-active';
        }
        return base + ' hover:bg-brand-teal/5 hover:text-brand-teal';
    }

    function mobileNavClass(id, current) {
        var base = 'px-4 py-3 rounded-xl transition-colors';
        if (id === current) {
            return base + ' nav-link-active';
        }
        return base + ' hover:bg-brand-teal/5 hover:text-brand-teal';
    }

    function renderHeader(current) {
        var isHome = current === 'home';
        var desktopNav = NAV.map(function (item) {
            return '<a href="' + item.href + '" class="' + navClass(item.id, current) + '">' + item.label + '</a>';
        }).join('');

        var mobileNav = NAV.map(function (item) {
            return '<a href="' + item.href + '" class="' + mobileNavClass(item.id, current) + '">' + item.label + '</a>';
        }).join('');

        var menuCtaDesktop =
            '<a href="#" class="js-whatsapp-open btn-nav-cta hidden lg:inline-flex" aria-label="Fale com um especialista">' +
            '<span>Fale com um especialista</span><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></a>';

        var menuCtaMobile =
            '<a href="#" class="js-whatsapp-open btn-nav-cta btn-nav-cta--mobile lg:hidden" aria-label="Fale com um especialista">' +
            '<span>Fale com um especialista</span><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></a>';

        return (
            '<header id="header" class="fixed w-full top-0 z-50 transition-all duration-500">' +
                '<div class="bg-brand-dark text-palette-200 text-xs sm:text-sm tracking-widest uppercase hidden sm:block">' +
                    '<div class="container mx-auto px-6 py-3.5 flex justify-between items-center font-sans min-h-[44px]">' +
                        '<div class="flex items-center gap-3">' +
                            '<span class="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse"></span>' +
                            '<span class="text-gray-200 font-medium tracking-wider">Portal Institucional Supramed</span>' +
                        '</div>' +
                        '<div class="flex items-center gap-6">' +
                            '<a href="mailto:contato@supramed.com.br" class="hover:text-brand-teal transition-colors flex items-center gap-2"><i class="fa-regular fa-envelope"></i> contato@supramed.com.br</a>' +
                            '<span class="flex items-center gap-2"><i class="fa-solid fa-phone text-brand-teal"></i> (11) 4000-0000</span>' +
                            '<div class="w-px h-3 bg-gray-700 mx-1"></div>' +
                            '<div class="flex items-center gap-4">' +
                                '<a href="mailto:contato@supramed.com.br" class="hover:text-brand-teal transition-colors" aria-label="E-mail" rel="noopener"><i class="fa-brands fa-linkedin-in"></i></a>' +
                                '<a href="https://wa.me/551140000000" class="hover:text-brand-teal transition-colors" aria-label="WhatsApp" rel="noopener noreferrer" target="_blank"><i class="fa-brands fa-instagram"></i></a>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="main-nav bg-[#FFFFFF] border-b border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">' +
                    '<div class="container mx-auto px-6 py-4 flex justify-between items-center gap-4">' +
                        '<a href="/" class="flex items-center shrink-0 group" aria-label="Supramed Saúde — Home">' +
                            '<img src="/logo-supramed-ong.png" alt="Supramed Saúde" width="260" height="60" class="h-12 sm:h-14 w-auto max-w-[260px] object-contain object-left transition-opacity duration-300 group-hover:opacity-90">' +
                        '</a>' +
                        '<nav class="hidden lg:flex items-center gap-2 text-[15px] font-medium text-gray-600 font-sans">' + desktopNav + '</nav>' +
                        '<div class="flex items-center gap-3 lg:gap-4">' + menuCtaDesktop +
                            '<button type="button" id="menuBtn" class="lg:hidden w-10 h-10 flex items-center justify-center text-brand-dark border border-gray-200 rounded-full hover:bg-gray-50 transition" aria-label="Menu"><i class="fa-solid fa-bars-staggered"></i></button>' +
                        '</div>' +
                    '</div>' +
                    '<nav id="mobileMenu" class="lg:hidden" aria-label="Menu mobile">' +
                        menuCtaMobile + mobileNav +
                    '</nav>' +
                '</div>' +
            '</header>'
        );
    }

    function footerLink(href, label) {
        return (
            '<li><a href="' + href + '" class="group flex items-center gap-2 hover:text-white transition-colors duration-300">' +
                '<span class="w-1 h-1 rounded-full bg-brand-teal opacity-0 group-hover:opacity-100 transition-opacity"></span> ' + label +
            '</a></li>'
        );
    }

    function renderFooter() {
        var navLinks = NAV.map(function (item) {
            return footerLink(item.href, item.label);
        }).join('');

        return (
            '<footer id="footer" class="bg-brand-dark text-white pt-20 pb-8 border-t border-white/10 relative overflow-hidden font-sans">' +
                '<div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-brand-teal/40 to-transparent blur-[2px]"></div>' +
                '<div class="container mx-auto px-6">' +
                    '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">' +
                        '<div class="lg:col-span-4 pr-0 lg:pr-8">' +
                            '<a href="/" class="inline-block mb-6"><img src="/logo-supramed-ong.png" alt="Supramed Saúde" class="h-12 w-auto brightness-0 invert opacity-95"></a>' +
                            '<p class="text-gray-400 text-sm leading-relaxed mb-8">Especialistas em saúde de alta complexidade, infraestrutura hospitalar e gestão médica estruturada para os setores público e privado.</p>' +
                            '<div class="flex gap-3">' +
                                '<a href="mailto:contato@supramed.com.br" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-teal hover:border-brand-teal transition-all duration-300" aria-label="E-mail" rel="noopener"><i class="fa-brands fa-linkedin-in"></i></a>' +
                                '<a href="https://wa.me/551140000000" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-teal hover:border-brand-teal transition-all duration-300" aria-label="WhatsApp" rel="noopener noreferrer" target="_blank"><i class="fa-brands fa-instagram"></i></a>' +
                                '<a href="/fale-conosco/" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-teal hover:border-brand-teal transition-all duration-300" aria-label="Contato"><i class="fa-brands fa-facebook-f"></i></a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="lg:col-span-2 lg:col-start-6">' +
                            '<h4 class="font-bold text-lg text-white mb-6 tracking-wide">Navegação</h4>' +
                            '<ul class="space-y-3 text-sm text-gray-400">' + navLinks + '</ul>' +
                        '</div>' +
                        '<div class="lg:col-span-3">' +
                            '<h4 class="font-bold text-lg text-white mb-6 tracking-wide">Expertise</h4>' +
                            '<ul class="space-y-3 text-sm text-gray-400">' +
                                '<li class="flex items-center gap-2"><i class="fa-solid fa-check text-brand-teal/60 text-[10px]"></i> Parcerias Público-Privadas</li>' +
                                '<li class="flex items-center gap-2"><i class="fa-solid fa-check text-brand-teal/60 text-[10px]"></i> Infraestrutura Hospitalar</li>' +
                                '<li class="flex items-center gap-2"><i class="fa-solid fa-check text-brand-teal/60 text-[10px]"></i> Gestão Médica</li>' +
                                '<li class="flex items-center gap-2"><i class="fa-solid fa-check text-brand-teal/60 text-[10px]"></i> Serviços Não Assistenciais</li>' +
                                '<li class="flex items-center gap-2"><i class="fa-solid fa-check text-brand-teal/60 text-[10px]"></i> Tecnologia em Saúde</li>' +
                            '</ul>' +
                        '</div>' +
                        '<div class="lg:col-span-2">' +
                            '<h4 class="font-bold text-lg text-white mb-6 tracking-wide">Fale Conosco</h4>' +
                            '<ul class="space-y-4 text-sm text-gray-400">' +
                                '<li class="flex gap-3 items-start"><div class="w-6 h-6 rounded bg-brand-teal/10 flex items-center justify-center shrink-0 mt-0.5 text-brand-teal"><i class="fa-solid fa-location-dot text-xs"></i></div><span class="leading-relaxed">São Paulo, SP<br>Brasil</span></li>' +
                                '<li><a href="tel:+551140000000" class="flex gap-3 items-center hover:text-white transition-colors group"><div class="w-6 h-6 rounded bg-brand-teal/10 flex items-center justify-center shrink-0 text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors"><i class="fa-solid fa-phone text-xs"></i></div>(11) 4000-0000</a></li>' +
                                '<li><a href="mailto:contato@supramed.com.br" class="flex gap-3 items-center hover:text-white transition-colors group"><div class="w-6 h-6 rounded bg-brand-teal/10 flex items-center justify-center shrink-0 text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors"><i class="fa-regular fa-envelope text-xs"></i></div>contato@supramed.com.br</a></li>' +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                    '<div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">' +
                        '<p class="text-xs text-gray-500 font-medium">&copy; 2026 Supramed. Todos os direitos reservados.</p>' +
                        '<div class="flex items-center gap-6 text-xs text-gray-500 font-medium">' +
                            '<a href="/politica-privacidade/" class="hover:text-brand-teal transition-colors">Política de Privacidade</a>' +
                            '<a href="/termos-de-uso/" class="hover:text-brand-teal transition-colors">Termos de Uso</a>' +
                            '<button type="button" onclick="window.scrollTo({top:0,behavior:\'smooth\'})" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-teal hover:border-brand-teal transition-all duration-300 group" aria-label="Voltar ao topo"><i class="fa-solid fa-chevron-up group-hover:-translate-y-0.5 transition-transform"></i></button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</footer>'
        );
    }

    document.addEventListener('DOMContentLoaded', function () {
        var page = document.body.getAttribute('data-page') || 'home';
        var headerEl = document.getElementById('site-header');
        var footerEl = document.getElementById('site-footer');

        if (headerEl) {
            headerEl.innerHTML = renderHeader(page);
        }
        if (footerEl) {
            footerEl.innerHTML = renderFooter();
        }

        if (window.SupramedSite) {
            window.SupramedSite.setHeaderOffset();
        }
        document.dispatchEvent(new CustomEvent('supramed:layout-ready'));
    });
})();
