FROM node:18-alpine as base
WORKDIR /app
RUN npm i -g pnpm@8.5

FROM base as build

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY ./src ./src
COPY tsconfig*.json ./
RUN pnpm build

FROM base as prod

COPY package.json pnpm-lock.yaml ./
COPY ./prisma ./prisma
COPY --from=build /app/dist ./dist
RUN pnpm install --frozen-lockfile --prod

ENV NODE_ENV=production
USER node
EXPOSE 80
ENTRYPOINT [ "node", "./dist/src/main.js" ]
