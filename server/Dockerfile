# Use the official node 8 LTS Docker image as a base
FROM node:8

# Set the current directory (this will create the dir if it doesn't exist)
WORKDIR /usr/src

# Add the bin folder to PATH for any executables resulting from installing dep's
ENV PATH /usr/src/node_modules/.bin:$PATH

# This is part one of a two part node_modules dependency trick. Here we are taking copying the package.json from the
# host, and placing it in the image. Then we call 'yarn' which installs dep's from the package.json. This is all done
# during 'build' which does not affect the Host in any way. In the docker-compose.yml file, we will make sure this
# directory containing our dep's is available to the container.
ADD package.json /tmp/package.json
RUN cd /tmp && yarn
RUN mkdir -p /usr/src && cp -a /tmp/node_modules /usr/src

# Add Tini - an init wrapper for handling signals and reaping zombies
ENV TINI_VERSION v0.17.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

USER node

CMD ["nodemon", "--legacy-watch", "server.js"]
