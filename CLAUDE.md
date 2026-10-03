# CLAUDE.md

Jekyll-based static blog hosted on GitHub Pages at pingfu.net.

## Structure

- `_posts/` - Blog posts (YYYY-MM-DD-title.md)
- `_layouts/` - Templates (default.html, post.html, tools.html)
- `_includes/scss/` - Styles compiled via Liquid's `scssify` filter
- `tools/` - Interactive tools (YouTube player, DNS toolbox, password generator)
- `js/` - Static page scripts (not run through Liquid). `js/youtube.js` drives `/tools/youtube/`
- `_includes/scss/youtube.scss` - Styles for the YouTube page only, pulled in via the `extra_scss` front matter key

The site header is one component, `_includes/nav.html`, styled as `.site-nav` in main.scss. By default it sits in the centred Bootstrap container; a page can set `nav_full: true` for the full-width projection and `nav_slot: some-include.html` to render an include in its middle column. The YouTube page uses both and includes the nav itself inside its app shell.

Pages can set `app_shell: true` in front matter to drop the layout's nav and footer, `fonts:` to add a Google Fonts stylesheet, and `extra_scss:` to compile an extra SCSS include.

The YouTube page is deliberately light on YouTube: one oEmbed call and one thumbnail fetch when a video is first played, then everything is served from localStorage (`pingfu.history.v2`) and IndexedDB (`pingfu-history`, thumbnail blobs). Do not add calls that run on every visit.

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
Add `--full-page` for full page height. Read `.screenshots/screenshot.png` to view. Container can only write to this single file. Directory is gitignored.

## External Services

- Google Analytics 4: G-GVTKN05RK1
- Plausible Analytics: analytics.pingfu.net (self-hosted)
- Disqus comments: shortname 'pingfu'

## Writing Style

- Do not use em dashes (—). Use commas, colons, full stops, or restructure the sentence instead.
