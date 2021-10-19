FROM node:16.11-alpine3.11
RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . .
ENTRYPOINT npm run dev
