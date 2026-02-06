FROM node:16-alpine AS builder

WORKDIR /app

RUN npm i -g npm@9

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:16-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN npm i -g npm@9

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=node:node /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/main"]
