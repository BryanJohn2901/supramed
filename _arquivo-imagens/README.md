# Arquivo de imagens (não vai para o site)

Esta pasta NÃO é incluída no deploy da Vercel — veja `.vercelignore`.
Use apenas para arquivar imagens que não estão em uso no momento mas podem
ser úteis no futuro. Para colocar uma imagem de volta no ar, mova-a para
`assets/images/` (ou `assets/images/hospital-site/`) e referencie no HTML.

## Subpastas

### `originais/`
Arquivos originais grandes recebidos do cliente (Hospital Papa Francisco,
fotos pessoais, exportações do WhatsApp). Servem como backup de alta
resolução. As versões otimizadas usadas no site ficam em
`assets/images/hospital-site/hospital-papa-francisco-*.jpg`.

### `nao-usadas/`
Imagens stock antigas que não aparecem em nenhuma página do site:

- `health-professional.jpg`
- `hospital-infrastructure.jpg`
- `hospital-modern.jpg`
- `facility-wide.jpg`

### `ia-com-pessoas/`
Imagens geradas por IA mostrando pessoas, removidas do ar porque exibiam
**letreiros de outros hospitais** (Albert Einstein, São José) ou outros
problemas de contexto. Mantidas aqui para referência caso sejam regeradas
sem texto/marcas de terceiros:

- `hero-exterior.jpg` — letreiro "Hospital Albert Einstein — Unidade Perdizes"
- `operating-context.jpg` — médica + gestante (genérica, mas não usada)
- `team-hallway.jpg` — médica em corredor (genérica, mas não usada)
