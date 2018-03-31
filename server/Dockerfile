FROM node:8

WORKDIR /usr/src

ENV PATH /usr/src/node_modules/.bin:$PATH

RUN npm install --global nodemon

# Install packages using Yarn
ADD package.json /tmp/package.json
RUN cd /tmp && yarn
RUN mkdir -p /usr/src && cd /usr/src && ln -s /tmp/node_modules

CMD ["nodemon", "--legacy-watch"]
