FROM node:lts
RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/npm", "start"]
