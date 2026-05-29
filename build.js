#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { minify: terserMinify } = require('terser');
const { minify: htmlMinify } = require('html-minifier-terser');
const CleanCSS = require('clean-css');
const sharp = require('sharp');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

/** Identificador do build — invalida cache de CSS/JS/imagens locais após deploy */
function getBuildId() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return new Date().toISOString().slice(0, 10).replace(/-/g, '');
  }
}

/** Acrescenta ?v=BUILD_ID em assets locais (não afeta CDNs) */
function applyCacheBusting(content, buildId) {
  const q = `?v=${buildId}`;
  const tag = (m, pre, url, post) => (url.includes('?') ? m : `${pre}${url}${q}${post}`);
  return content
    .replace(/((?:href|src)=["'])(\/(?:css|js)\/[^"']+\.(?:css|js))(")/gi, tag)
    .replace(/((?:href|src)=["'])(\/assets\/[^"']+\.(?:jpe?g|png|webp|svg|gif|pdf|ico))(")/gi, tag)
    .replace(/((?:href|src)=["'])(\/(?:favicon\.svg|logo[^"']*\.(?:png|jpe?g|svg)|og-image\.jpg))(")/gi, tag);
}

function log(msg) { process.stdout.write(`\x1b[36m→\x1b[0m ${msg}\n`); }
function ok(msg)  { process.stdout.write(`\x1b[32m✓\x1b[0m ${msg}\n`); }
function warn(msg) { process.stderr.write(`\x1b[33m⚠\x1b[0m ${msg}\n`); }
function fail(msg) { process.stderr.write(`\x1b[31m✗\x1b[0m ${msg}\n`); }

function mkdirp(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readText(p) { return fs.readFileSync(p, 'utf8'); }
function writeText(p, content) { mkdirp(path.dirname(p)); fs.writeFileSync(p, content, 'utf8'); }
function kb(bytes) { return (bytes / 1024).toFixed(1) + 'KB'; }

// Path rewrites: source layout → dist layout
function rewritePaths(content) {
  return content
    .replace(/\/assets\/css\//g, '/css/')
    .replace(/\/assets\/js\//g, '/js/')
    .replace(/\/assets\/images\//g, '/assets/');
}

// HTML pages: [srcRelative, destRelative]
const HTML_PAGES = [
  ['index.html',                              'index.html'],
  ['404.html',                                '404.html'],
  ['blog/index.html',                         'blog/index.html'],
  ['blog/ppp-saude/index.html',               'blog/ppp-saude/index.html'],
  ['blog/hospital-pinhais/index.html',        'blog/hospital-pinhais/index.html'],
  ['blog/gestao-equipes/index.html',          'blog/gestao-equipes/index.html'],
  ['blog/governanca/index.html',              'blog/governanca/index.html'],
  ['blog/tecnologia-integrada/index.html',    'blog/tecnologia-integrada/index.html'],
  ['blog/humanizacao/index.html',             'blog/humanizacao/index.html'],
  ['blog/engenharia-clinica/index.html',      'blog/engenharia-clinica/index.html'],
  ['cases/index.html',                        'cases/index.html'],
  ['quem-somos/index.html',                   'quem-somos/index.html'],
  ['nossas-atuacoes/index.html',              'nossas-atuacoes/index.html'],
  ['fale-conosco/index.html',                 'fale-conosco/index.html'],
  ['contato/index.html',                      'contato/index.html'],
  ['politica-privacidade/index.html',         'politica-privacidade/index.html'],
  ['termos-de-uso/index.html',               'termos-de-uso/index.html'],
];

const HTML_MINIFY_OPTS = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  sortAttributes: true,
  sortClassName: false,
  minifyCSS: { level: 1 },
  minifyJS: false, // JS already minified by terser; inline scripts kept readable for GTM/analytics safety
  continueOnParseError: true,
};

const TERSER_OPTS = {
  compress: {
    drop_console: false,
    passes: 2,
  },
  mangle: true,
  format: { comments: false },
};

// ─── STEP 1: Tailwind CLI purge ───────────────────────────────────────────────
function buildTailwind() {
  log('Gerando Tailwind CSS purgado (CLI)...');
  execSync(
    'npx tailwindcss -i ./assets/css/tailwind-input.css -o ./assets/css/tailwind-built.css --minify',
    { cwd: ROOT, stdio: 'pipe' }
  );
  const size = fs.statSync(path.join(ROOT, 'assets/css/tailwind-built.css')).size;
  ok(`tailwind-built.css → ${kb(size)}`);
}

// ─── STEP 2: CSS ─────────────────────────────────────────────────────────────
async function buildCSS() {
  log('Minificando CSS → dist/css/');
  const cleancss = new CleanCSS({ level: 2, returnPromise: true });
  const cssFiles = ['site.css', 'tailwind-built.css'];

  for (const file of cssFiles) {
    const src = path.join(ROOT, 'assets', 'css', file);
    if (!fs.existsSync(src)) { warn(`CSS não encontrado: ${file}`); continue; }
    const raw = readText(src);
    const result = await cleancss.minify(raw);
    if (result.errors.length) { warn(`CSS erros em ${file}: ${result.errors.join(', ')}`); }
    writeText(path.join(DIST, 'css', file), result.styles);
    ok(`  css/${file}  ${kb(raw.length)} → ${kb(result.styles.length)}`);
  }
}

// ─── STEP 3: JS ──────────────────────────────────────────────────────────────
async function buildJS() {
  log('Minificando JS → dist/js/');
  const jsDir = path.join(ROOT, 'assets', 'js');
  const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const src = path.join(jsDir, file);
    const raw = readText(src);
    const rewritten = rewritePaths(raw);
    try {
      const result = await terserMinify(rewritten, TERSER_OPTS);
      writeText(path.join(DIST, 'js', file), result.code);
      ok(`  js/${file}  ${kb(raw.length)} → ${kb(result.code.length)}`);
    } catch (e) {
      fail(`  Terser falhou em ${file}: ${e.message}`);
      process.exit(1);
    }
  }
}

// ─── STEP 4: Imagens ─────────────────────────────────────────────────────────
async function buildImages() {
  log('Otimizando imagens → dist/assets/');

  async function processDir(srcDir, destDir) {
    if (!fs.existsSync(srcDir)) return;
    mkdirp(destDir);
    for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);
      if (entry.isDirectory()) { await processDir(srcPath, destPath); continue; }

      const ext = path.extname(entry.name).toLowerCase();
      const inKB = kb(fs.statSync(srcPath).size);

      if (['.jpg', '.jpeg'].includes(ext)) {
        try {
          await sharp(srcPath).jpeg({ quality: 80, mozjpeg: true }).toFile(destPath);
          ok(`  ${entry.name}  ${inKB} → ${kb(fs.statSync(destPath).size)}`);
        } catch (e) {
          warn(`  sharp falhou em ${entry.name}: ${e.message} — copiando original`);
          fs.copyFileSync(srcPath, destPath);
        }
      } else if (ext === '.png') {
        try {
          const srcSize = fs.statSync(srcPath).size;
          await sharp(srcPath).png({ compressionLevel: 9 }).toFile(destPath);
          const destSize = fs.statSync(destPath).size;
          if (destSize >= srcSize) {
            fs.copyFileSync(srcPath, destPath); // sharp made it larger — keep original
            ok(`  ${entry.name}  ${inKB} (já otimizado, copiado)`);
          } else {
            ok(`  ${entry.name}  ${inKB} → ${kb(destSize)}`);
          }
        } catch (e) {
          fs.copyFileSync(srcPath, destPath);
        }
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  await processDir(path.join(ROOT, 'assets', 'images'), path.join(DIST, 'assets'));

  // docs (PDFs etc.) — copy as-is
  const docsDir = path.join(ROOT, 'assets', 'docs');
  if (fs.existsSync(docsDir)) {
    const destDocs = path.join(DIST, 'assets', 'docs');
    mkdirp(destDocs);
    for (const f of fs.readdirSync(docsDir)) {
      fs.copyFileSync(path.join(docsDir, f), path.join(destDocs, f));
    }
    ok('  docs/ copiado');
  }
}

const SITE_ORIGIN = 'https://supramedsaude.com.br';

const SITEMAP_META = {
  'index.html':                         { changefreq: 'weekly',  priority: '1.0' },
  'quem-somos/index.html':              { changefreq: 'monthly', priority: '0.8' },
  'nossas-atuacoes/index.html':         { changefreq: 'monthly', priority: '0.8' },
  'cases/index.html':                   { changefreq: 'monthly', priority: '0.8' },
  'fale-conosco/index.html':            { changefreq: 'monthly', priority: '0.7' },
  'politica-privacidade/index.html':    { changefreq: 'yearly',  priority: '0.3' },
  'termos-de-uso/index.html':           { changefreq: 'yearly',  priority: '0.3' },
  'blog/index.html':                    { changefreq: 'weekly',  priority: '0.7' },
};

const SITEMAP_BLOG_DEFAULT = { changefreq: 'monthly', priority: '0.6' };

// Ordem preferida no sitemap (institucionais antes do blog)
const SITEMAP_ORDER = [
  'index.html',
  'quem-somos/index.html',
  'nossas-atuacoes/index.html',
  'cases/index.html',
  'fale-conosco/index.html',
  'politica-privacidade/index.html',
  'termos-de-uso/index.html',
  'blog/index.html',
  'blog/ppp-saude/index.html',
  'blog/hospital-pinhais/index.html',
  'blog/gestao-equipes/index.html',
  'blog/governanca/index.html',
  'blog/tecnologia-integrada/index.html',
  'blog/humanizacao/index.html',
  'blog/engenharia-clinica/index.html',
];

function sitemapLoc(destRel) {
  if (destRel === 'index.html') return `${SITE_ORIGIN}/`;
  const dir = path.posix.dirname(destRel.replace(/\\/g, '/'));
  return `${SITE_ORIGIN}/${dir}/`;
}

function sitemapMeta(srcRel) {
  if (SITEMAP_META[srcRel]) return SITEMAP_META[srcRel];
  if (srcRel.startsWith('blog/') && srcRel !== 'blog/index.html') return SITEMAP_BLOG_DEFAULT;
  return { changefreq: 'monthly', priority: '0.5' };
}

function sitemapLastmod(srcRel) {
  const src = path.join(ROOT, srcRel);
  if (!fs.existsSync(src)) return new Date().toISOString().slice(0, 10);
  const html = readText(src);
  const modified = html.match(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"/);
  if (modified) return modified[1];
  const published = html.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"/);
  if (published) return published[1];
  return fs.statSync(src).mtime.toISOString().slice(0, 10);
}

function generateSitemap() {
  log('Gerando sitemap.xml → dist/');
  const orderIdx = Object.fromEntries(SITEMAP_ORDER.map((p, i) => [p, i]));
  const pages = HTML_PAGES
    .filter(([srcRel]) => srcRel !== '404.html' && srcRel !== 'contato/index.html')
    .map(([srcRel, destRel]) => ({
      srcRel,
      destRel,
      loc: sitemapLoc(destRel),
      lastmod: sitemapLastmod(srcRel),
      ...sitemapMeta(srcRel),
    }))
    .sort((a, b) => (orderIdx[a.srcRel] ?? 999) - (orderIdx[b.srcRel] ?? 999));

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const p of pages) {
    lines.push(
      '  <url>',
      `    <loc>${p.loc}</loc>`,
      `    <lastmod>${p.lastmod}</lastmod>`,
      `    <changefreq>${p.changefreq}</changefreq>`,
      `    <priority>${p.priority}</priority>`,
      '  </url>',
    );
  }
  lines.push('</urlset>', '');
  const xml = lines.join('\n');
  writeText(path.join(DIST, 'sitemap.xml'), xml);
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
  ok(`  sitemap.xml (${pages.length} URLs)`);
}

// ─── STEP 5: Arquivos raiz ────────────────────────────────────────────────────
function copyRootFiles() {
  log('Copiando arquivos raiz → dist/');
  const files = [
    'favicon.svg', 'logo.jpeg', 'logo-supramed-ong.png', 'og-image.jpg',
    'robots.txt',
    '.htaccess', // Apache — clean URLs, cache, segurança, redirects
  ];
  for (const f of files) {
    const src = path.join(ROOT, f);
    if (fs.existsSync(src)) { fs.copyFileSync(src, path.join(DIST, f)); ok(`  ${f}`); }
  }
}

// ─── STEP 6: HTML ────────────────────────────────────────────────────────────
async function buildHTML(buildId) {
  log('Minificando HTML → dist/');
  for (const [srcRel, destRel] of HTML_PAGES) {
    const src = path.join(ROOT, srcRel);
    if (!fs.existsSync(src)) { warn(`  HTML não encontrado: ${srcRel}`); continue; }
    let content = readText(src);
    content = rewritePaths(content);
    content = applyCacheBusting(content, buildId);
    try { content = await htmlMinify(content, HTML_MINIFY_OPTS); }
    catch (e) { warn(`  html-minifier falhou em ${srcRel}: ${e.message}`); }
    writeText(path.join(DIST, destRel), content);
    ok(`  ${destRel}`);
  }
}

function writeBuildMeta(buildId) {
  const meta = {
    buildId,
    builtAt: new Date().toISOString(),
    site: SITE_ORIGIN,
  };
  writeText(path.join(DIST, 'build-meta.json'), JSON.stringify(meta, null, 2));
  writeText(path.join(DIST, 'build-id.txt'), buildId + '\n');
  ok(`  cache bust: v=${buildId}`);
}

// ─── STEP 7: Validação de paths ───────────────────────────────────────────────
function validatePaths() {
  log('Validando paths referenciados...');
  // Negative lookbehind excludes paths inside absolute URLs (e.g. cdnjs.cloudflare.com/...css/all.min.css)
  const pattern = /(?<![a-zA-Z0-9.])\/(?:css|js|assets)\/[A-Za-z0-9_./()\-%]+\.(?:jpe?g|png|webp|svg|gif|pdf|css|js|JPG|JPEG)/g;
  let missing = 0;
  const refs = new Set();

  function collectHTML(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) collectHTML(path.join(dir, entry.name));
      else if (entry.name.endsWith('.html')) {
        const content = readText(path.join(dir, entry.name));
        let m;
        while ((m = pattern.exec(content)) !== null) refs.add(m[0]);
      }
    }
  }
  collectHTML(DIST);

  for (const ref of refs) {
    const filePath = ref.split('?')[0];
    if (!fs.existsSync(path.join(DIST, filePath))) {
      fail(`  FALTA: ${filePath}`);
      missing++;
    }
  }

  if (missing > 0) {
    fail(`${missing} arquivo(s) referenciados mas ausentes em dist/`);
    process.exit(1);
  }
  ok(`Todos os paths validados (${refs.size} refs)`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  const t0 = Date.now();
  console.log('\x1b[1m\n  Build Supramed Saúde — Produção\n\x1b[0m');

  try { buildTailwind(); } catch (e) { fail(`Tailwind: ${e.message}`); process.exit(1); }

  const buildId = getBuildId();

  log('Limpando dist/');
  fs.rmSync(DIST, { recursive: true, force: true });
  mkdirp(path.join(DIST, 'css'));
  mkdirp(path.join(DIST, 'js'));
  mkdirp(path.join(DIST, 'assets'));

  await buildCSS();
  await buildJS();
  await buildImages();
  copyRootFiles();
  await buildHTML(buildId);
  generateSitemap();
  writeBuildMeta(buildId);
  validatePaths();

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const totalSize = execSync('du -sh dist/', { cwd: ROOT }).toString().split('\t')[0];
  console.log(`\n\x1b[1m  dist/ pronto em ${elapsed}s — ${totalSize}\x1b[0m\n`);
  execSync('ls dist/', { cwd: ROOT, stdio: 'inherit' });
}

main().catch(e => { fail(e.stack || e.message); process.exit(1); });
