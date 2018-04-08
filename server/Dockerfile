# Use the official node 8 LTS Docker image as a base
FROM node:8

# Set the current directory (this will create the dir if it doesn't exist)
WORKDIR /usr/src

# Add the bin folder to PATH for any executables resulting from installing dep's
ENV PATH /usr/src/node_modules/.bin:$PATH

RUN yarn global add nodemon

# This is part one of a two part node_modules dependency trick. Here we are taking copying the package.json from the
# host, and placing it in the image. Then we call 'yarn' which installs dep's from the package.json. This is all done
# during 'build' which does not affect the Host in any way. In the docker-compose.yml file, we will make sure this
# directory containing our dep's is available to the container.
ADD package.json /tmp/package.json
RUN cd /tmp && yarn
RUN mkdir -p /usr/src && cp -a /tmp/node_modules /usr/src

CMD ["nodemon", "--legacy-watch"]
