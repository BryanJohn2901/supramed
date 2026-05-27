# Pendências antes do go-live — Supramed

Itens que **só você** pode resolver (dados reais, contas externas, jurídico).

Edite **`/assets/js/config.js`** e preencha os campos vazios. Depois publique o site.

---

## 1. Obrigatório (bloqueante)

| # | O que fazer | Onde |
|---|-------------|------|
| 1 | **Telefone** (ainda não definido — oculto no site) | `assets/js/config.js` → `phoneDisplay` e `phoneTel` quando o cliente enviar |
| 2 | **Google Tag Manager** (ID real) | `config.js` → `gtmId` |
| 4 | **Google Search Console** — verificar domínio e enviar sitemap | https://search.google.com/search-console |
| 5 | **Deploy** com HTTPS e redirect `www` ↔ domínio canônico | Vercel/Netlify/servidor |
| 6 | Revisão **jurídica** de Política de Privacidade e Termos | `/politica-privacidade/`, `/termos-de-uso/` |

---

## 2. Importante (primeira semana)

| # | O que fazer |
|---|-------------|
| 7 | URLs oficiais **LinkedIn / Instagram** (hoje: e-mail + WhatsApp no lugar) |
| 8 | Confirmar **CNPJ, razão social e endereço** no rodapé ou Quem Somos |
| 9 | Validar números do **case Pinhais** com material oficial (70+20 leitos = 90) |
| 10 | Banner **Feira de Santana** — confirmar texto com assessoria de imprensa |
| 11 | PageSpeed mobile (meta LCP &lt; 2,5s) — ver item 12 abaixo |

---

## 3. Build do site

O site agora tem um build que organiza os arquivos em `dist/`:

```bash
npm run build       # roda tailwind + build.sh -> gera dist/
npm run start       # serve dist/ em http://localhost:4173
```

Estrutura de saída:

```
dist/
├── css/      (site.css + tailwind-built.css)
├── js/       (config, layout, whatsapp, analytics, ...)
├── assets/   (imagens, preservando hospital-site/)
└── *.html    (paginas com paths reescritos para /css/, /js/, /assets/)
```

A Vercel roda `npm run build` automaticamente e publica a pasta `dist/`
(configurado em `vercel.json`). A pasta `dist/` está no `.gitignore` —
**nunca commitar**. Para builds locais: `npm run build`.

---

## 4. Já corrigido no repositório

- [x] Links internos e páginas legais
- [x] `og-image.jpg` 1200×630 (~20 KB)
- [x] OG image por artigo do blog
- [x] Schema `Article` com datas + `BreadcrumbList`
- [x] Schema `WebSite` na home
- [x] Meta descriptions ajustadas (PPP, gestão equipes, cases, legais)
- [x] `sitemap.xml` com `<lastmod>`
- [x] Página `404.html`
- [x] GTM placeholder removido (só carrega se `gtmId` em config)
- [x] Formulários removidos — contato via **WhatsApp** (flutuante + botões por página)
- [x] Fontes Google reduzidas (menos pesos)
- [x] `loading="lazy"` em imagens abaixo da dobra
- [x] `vercel.json` (cache + trailing slash)
- [x] Faixa de destaque Feira de Santana na home
- [x] Alinhamento case: 90 leitos (70 clínicos + 20 UTI) na página Cases
- [x] Tailwind compilado (`tailwind-built.css` ~46 KB) — CDN removido das páginas

---

## 5. Config rápido (`assets/js/config.js`)

```javascript
window.SUPRAMED_CONFIG = {
    gtmId: 'GTM-XXXXXXX',
    whatsappNumber: '5511999999999',  // DDI 55 + DDD + número
    phoneDisplay: '(11) 99999-9999',
    phoneTel: '+5511999999999',
    contactEmail: 'contato@supramedsaude.com.br',
    siteUrl: 'https://supramedsaude.com.br'
};
```

---

## 6. Contato técnico pós-deploy

- Sitemap: https://supramedsaude.com.br/sitemap.xml  
- Robots: https://supramedsaude.com.br/robots.txt  
- Teste rich results: https://search.google.com/test/rich-results  
