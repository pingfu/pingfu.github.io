# Build the Docker image
docker build -t pingfu.github.io .

# Run the Docker container
docker run --rm -it -v ${PWD}:/srv/jekyll -p 4000:4000 pingfu.github.io
