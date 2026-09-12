# syntax=docker/dockerfile:1

##### Base ######################################################################
FROM node:20-bookworm-slim AS base
WORKDIR /usr/src/app

##### Dependencies ################################################################
FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

##### Development #################################################################
# Usado pelo docker-compose: monta o código-fonte da máquina do host como
# volume, então qualquer alteração de arquivo local reflete automaticamente
# no navegador (HMR do Vite, com polling habilitado em vite.config.ts para
# bind mounts do Docker Desktop no Windows).
FROM dependencies AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

##### Build (produção) ############################################################
FROM dependencies AS build
COPY . .
RUN npm run build

##### Production (Nginx estático) #################################################
FROM nginx:1.27-alpine AS production
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
