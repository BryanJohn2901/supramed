#!/usr/bin/env bash
# =============================================================================
# novo-post.sh — Cria um novo post do blog Supramed
# Uso: ./novo-post.sh
# =============================================================================
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "=== NOVO POST SUPRAMED ==="
echo ""

# Coleta dados
read -p "Slug do post (ex: gestao-hospitalar-sus): " SLUG
read -p "Título completo: " TITULO
read -p "Meta description (máx 160 caracteres): " DESCRICAO
read -p "Categoria (ex: Gestão Pública, Inovação, Case de Sucesso): " CATEGORIA
read -p "Imagem de capa (arquivo em assets/images/, ex: health-tech.jpg): " IMAGEM
read -p "Tempo de leitura em minutos (ex: 6): " TEMPO_LEITURA

# Data atual
DATA=$(date "+%d %b %Y")
DATA_ISO=$(date "+%Y-%m-%d")

# Destino
DEST="$ROOT/blog/$SLUG"

if [ -d "$DEST" ]; then
  echo ""
  echo "ERRO: Pasta blog/$SLUG já existe."
  exit 1
fi

mkdir -p "$DEST"

# Copia template e substitui placeholders
sed \
  -e "s|{{SLUG}}|$SLUG|g" \
  -e "s|{{TITULO}}|$TITULO|g" \
  -e "s|{{DESCRICAO}}|$DESCRICAO|g" \
  -e "s|{{CATEGORIA}}|$CATEGORIA|g" \
  -e "s|{{IMAGEM}}|$IMAGEM|g" \
  -e "s|{{TEMPO_LEITURA}}|$TEMPO_LEITURA|g" \
  -e "s|{{DATA}}|$DATA|g" \
  -e "s|{{DATA_ISO}}|$DATA_ISO|g" \
  "$ROOT/_template-post/index.html" > "$DEST/index.html"

# Adiciona entrada no sitemap.xml
SITEMAP="$ROOT/sitemap.xml"
NEW_URL="  <url>\n    <loc>https://supramedsaude.com.br/blog/$SLUG/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>"
sed -i "s|</urlset>|$NEW_URL\n</urlset>|" "$SITEMAP"

echo ""
echo "Post criado com sucesso!"
echo "  Pasta:    blog/$SLUG/"
echo "  Edite:    blog/$SLUG/index.html"
echo "  Sitemap:  atualizado automaticamente"
echo ""
echo "PRÓXIMOS PASSOS:"
echo "  1. Edite o conteúdo em blog/$SLUG/index.html"
echo "  2. Adicione o post ao blog/index.html (lista do blog)"
echo "  3. Se quiser destacar no index.html, atualize a seção de Notícias"
echo ""
