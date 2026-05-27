#!/usr/bin/env bash
# Build estatico do site Supramed.
# Gera pasta dist/ com a estrutura:
#   dist/
#   ├── css/      (de assets/css/, sem tailwind-input)
#   ├── js/       (de assets/js/)
#   ├── assets/   (de assets/images/, preservando subpastas)
#   ├── *.html    (HTMLs com paths reescritos)
#   └── blog/, cases/, quem-somos/, ...
#
# Reescritas aplicadas em HTMLs/CSS/JS/XML do dist/:
#   /assets/css/    -> /css/
#   /assets/js/     -> /js/
#   /assets/images/ -> /assets/

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
DIST="$ROOT/dist"

log() { printf "\033[36m→\033[0m %s\n" "$*"; }
ok()  { printf "\033[32m✓\033[0m %s\n" "$*"; }

log "Limpando dist/"
rm -rf "$DIST"
mkdir -p "$DIST/css" "$DIST/js" "$DIST/assets"

log "Copiando CSS  →  dist/css/"
cp -r "$ROOT/assets/css/." "$DIST/css/"
rm -f "$DIST/css/tailwind-input.css"

log "Copiando JS   →  dist/js/"
cp -r "$ROOT/assets/js/." "$DIST/js/"

log "Copiando imagens  →  dist/assets/"
cp -r "$ROOT/assets/images/." "$DIST/assets/"

log "Copiando paginas, sitemap, robots, favicon e logos"
for entry in \
    index.html 404.html \
    favicon.svg logo.jpeg logo-supramed-ong.png og-image.jpg \
    robots.txt sitemap.xml \
    blog cases quem-somos nossas-atuacoes fale-conosco contato \
    politica-privacidade termos-de-uso; do
    if [ -e "$ROOT/$entry" ]; then
        cp -r "$ROOT/$entry" "$DIST/"
    fi
done

log "Reescrevendo paths /assets/{css,js,images}/ no dist/"
find "$DIST" -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.xml' \) -print0 \
  | xargs -0 sed -i \
      -e 's|/assets/css/|/css/|g' \
      -e 's|/assets/js/|/js/|g' \
      -e 's|/assets/images/|/assets/|g'

log "Validando que toda imagem referenciada existe em dist/"
missing=0
while IFS= read -r ref; do
    if [ ! -f "$DIST$ref" ]; then
        echo "  FALTA: $DIST$ref" >&2
        missing=$((missing + 1))
    fi
done < <(grep -hroE '/(?:css|js|assets)/[A-Za-z0-9_./()%-]+\.(?:jpe?g|png|webp|svg|gif|css|js|JPG|JPEG)' "$DIST" 2>/dev/null | sort -u)

if [ $missing -gt 0 ]; then
    printf "\033[31m✗ Build com %d arquivos faltando\033[0m\n" "$missing" >&2
    exit 1
fi

ok "Build concluido em $DIST"
echo ""
echo "Estrutura:"
ls "$DIST"
echo ""
echo "Tamanho:"
du -sh "$DIST"
