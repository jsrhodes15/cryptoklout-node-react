## CryptoKlout using node, react, mongodb, and docker. For fun

Node 8.11.1<br>
Express 4.16.3<br>
MongoDB 3.0.15<br>
React 16.3

### Getting started

\*_just do it the easy way please_<br>
Install [Docker](https://www.docker.com/community-edition#/download) (on anything but windows)

#### Setup

Clone this repo

```sh
git clone <https/ssh> && cd cryptoklout-node-react
```

Build images and start containers

```sh
docker-compose up --build
```

\*if you get an error from the mongodb container, try `mkdir local-db` to create folder for the mongodb container to persist your data locally

#### Setup without Docker (le sigh)

**Prerequisites**

* Node.js (preferably installed via [nvm](https://github.com/creationix/nvm))
* MongoDB

Clone this repo and `cd` into it

Install dependencies  
via npm

```sh
cd web && npm install && cd ../server && npm install -g nodemon && npm install
```

\#  
\#  
\#  
\#  
\# There is more I just don't have time tonight  
\#  
\#  
\#  
\#
