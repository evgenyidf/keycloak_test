FROM node:16.17.0-alpine As development

WORKDIR /var/www/app

COPY package*.json ./
COPY yarn.lock ./
COPY . /var/www/app

RUN yarn install
RUN yarn run build


FROM node:16.17.0-alpine As production
RUN apk add busybox-extras

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PATH=$PATH:/usr/local/bin/

WORKDIR /var/www/app

COPY package*.json ./
RUN yarn install --only=production

COPY . .
COPY --from=development /var/www/app/dist ./dist

ENTRYPOINT ["node", "dist/main"]
