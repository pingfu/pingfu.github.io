# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based static personal tech blog and tools website. The site features blog posts about .NET, infrastructure, and security topics, plus interactive tools like an embedded YouTube player, DNS toolbox, and password generator.

## Development Commands

### Local Development

**Using Docker with hot-reload (recommended for development):**
```powershell
.\local-preview.ps1
```
This checks for an existing Docker image, builds only if needed, and runs Jekyll with hot-reload, incremental builds, and LiveReload. The site will be available at http://localhost:4000 and auto-refreshes on file changes.

Force rebuild when dependencies change:
```powershell
.\local-preview.ps1 -Rebuild
```

**Using Docker (clean build each time):**
```powershell
.\run.ps1
```
Rebuilds the Docker image and runs the Jekyll server. Use this when you need a completely fresh build.

**Native Jekyll:**
```bash
bundle install
bundle exec jekyll serve --host 0.0.0.0
```

## Architecture

### Site Structure

- **`_posts/`**: Blog posts in markdown format with YAML frontmatter. Posts follow the naming convention `YYYY-MM-DD-title.md`
- **`_layouts/`**: Page templates
  - `default.html`: Base layout with navigation, footer, Google Analytics
  - `post.html`: Blog post layout with Disqus comments
  - `page.html`: Standard page layout
  - `tools.html`: Layout for interactive tools
- **`_includes/`**: Reusable components
  - `nav.html`: Site navigation
  - `scss/`: Inline SCSS styles (compiled via Liquid)
  - `js/`: JavaScript libraries (mustache, owl-carousel, slick)
  - `sections/`: Content sections for code discovery/projects
- **`tools/`**: Interactive web-based tools (YouTube player, DNS toolbox, password generator)
- **`reference/`**: Technical reference materials (protocol header cheatsheets)

### Configuration

**`_config.yml`** defines:
- Site metadata (name: pingfu, URL: https://pingfu.net)
- Markdown processor: kramdown
- Syntax highlighter: rouge
- Plugins: jekyll-redirect-from, jekyll-sitemap
- Excerpt separator: `<!--excerpt-->`
- Permalink structure: `/:title/`

### Key Patterns

**Layouts inheritance**: Tools and posts extend the default layout, which includes navigation and footer with analytics.

**SCSS compilation**: Styles are included inline via Liquid templating (`{% include scss/main.scss %}`) and compiled using the `scssify` filter at build time.

**URL redirects**: Uses `jekyll-redirect-from` plugin for legacy URL support (e.g., `/yt` redirects to YouTube tool).

**Interactive tools**: Self-contained pages with embedded JavaScript. The YouTube tool uses localStorage to track recently played videos and sanitizes video IDs for security.

## Creating Content

### New Tool Page

Create a markdown file in `tools/` directory with:
```yaml
---
layout: tools
title: Tool Name
redirect_from: "/shorturl"
---

<div class="container">
  <!-- Tool HTML and JavaScript here -->
</div>
```

## Dependencies

- Jekyll 4.2.0
- Plugins: jekyll-redirect-from, jekyll-sitemap
- Bootstrap 3.3.7 (CDN)
- jQuery 3.2.1 (CDN)
- Font Awesome 4.5.0 (CDN)
- Disqus for blog comments

## Notes

- Site uses Google Analytics (UA-244950-9)
- Comments powered by Disqus (shortname: 'pingfu')
- Custom domain: pingfu.net (defined in CNAME file)
- The site is hosted on GitHub Pages (repository: pingfu.github.io)
