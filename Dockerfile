FROM node:lts AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 4321
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4321"]

FROM node:lts AS build
WORKDIR /app
ARG PUBLIC_GOOGLE_ANALYTICS_ID
ENV PUBLIC_GOOGLE_ANALYTICS_ID=$PUBLIC_GOOGLE_ANALYTICS_ID
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build:post-history && npm run build:astro

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
