# Use the official Ruby image with Jekyll pre-installed
FROM jekyll/jekyll:4.2.0

# Set the working directory
WORKDIR /srv/jekyll

# Copy the Gemfile
COPY Gemfile ./

# Install dependencies
RUN bundle install

# Copy the rest of the application code
COPY . .

# Expose the port Jekyll will run on
EXPOSE 4000

# Command to run Jekyll server with --force_polling
CMD ["jekyll", "serve", "--host", "0.0.0.0", "--force_polling"]
