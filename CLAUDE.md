# CLAUDE.md

Jekyll-based static blog hosted on GitHub Pages at pingfu.net.

## Structure

- `_posts/` - Blog posts (YYYY-MM-DD-title.md)
- `_layouts/` - Templates (default.html, post.html, tools.html)
- `_includes/scss/` - Styles compiled via Liquid's `scssify` filter
- `tools/` - Interactive tools (YouTube player, DNS toolbox, password generator)

## Config

- Markdown: kramdown
- Syntax highlighting: Prism.js (client-side, auto line numbers)
- Plugins: jekyll-redirect-from, jekyll-sitemap
- Permalinks: `/:title/`

## Development

Start the site and screenshot sidecar:
```powershell
.\start.ps1
.\stop.ps1
```
Site available at http://localhost:4000. Stop with `docker compose down`.

## Taking Screenshots

Only use for significant visual changes or debugging rendering issues. Not for every small tweak.

```bash
docker exec playwright sh -c "npx playwright screenshot http://jekyll:4000/ /output/screenshot.png >/dev/null 2>&1"
```
Add `--full-page` for full page height. Read `screenshots/screenshot.png` to view. Container can only write to this single file. Directory is gitignored.

## External Services

- Google Analytics 4: G-GVTKN05RK1
- Plausible Analytics: analytics.pingfu.net (self-hosted)
- Disqus comments: shortname 'pingfu'
