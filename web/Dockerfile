FROM node:8

WORKDIR /usr/src

ENV PATH /usr/src/node_modules/.bin:$PATH

# Install packages using Yarn
# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && yarn
RUN mkdir -p /usr/src && cp -a /tmp/node_modules /usr/src

CMD ["yarn", "run", "start"]
