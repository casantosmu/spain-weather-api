FROM node:18-slim AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY tsconfig*.json ./
COPY src ./src

RUN npm run build

FROM build AS prod
COPY --from=build /usr/src/app/dist ./dist/
COPY --from=build /usr/src/app/package.json ./
RUN npm ci --production && npm cache clean --force
USER node
CMD ["node", "dist/index.js"]
