docker build -t pingfu.github.io .

# Run with volume mount for hot-reload. Available at http://localhost:4000/
docker run --rm -it `
    -v ${PWD}:/srv/jekyll `
    -p 4000:4000 `
    -p 35729:35729 `
    pingfu.github.io `
    jekyll serve --host 0.0.0.0 --force_polling --incremental --livereload
