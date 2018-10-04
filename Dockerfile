# -------- Build environment
# Base image
FROM node:10-alpine as builder

# Set working directory
RUN mkdir /app
WORKDIR /app

# Add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Native dependencies, you'll need extra tools
RUN apk add --no-cache make gcc g++ python file libpng-dev autoconf automake build-base libtool nasm
# Used by node module `sharp`
RUN apk add --no-cache vips-dev fftw-dev vips-tools --repository https://dl-3.alpinelinux.org/alpine/edge/testing/

# Install and cache app dependencies
# COPY package.json /app/package.json
# COPY package-lock.json /app/package-lock.json
COPY package*.json /app

# RUN npm install --silent
RUN npm ci

# Copy the app and build it
COPY . /app
ENV NODE_ENV production
RUN npm run build:release

# -------- Production environment
FROM node:10-alpine
ENV NODE_ENV production
RUN mkdir /app
WORKDIR /app
COPY --from=builder /app/build /app
RUN npm i
RUN ls
RUN echo $NODE_ENV
EXPOSE 3000
CMD ["node", "./server/server.js"]

# To run:
# docker build -f Dockerfile -t webapp-sample-app .
# docker run -it -p 3000:3000 --rm webapp-sample-app
