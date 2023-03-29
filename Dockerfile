FROM node:18-slim
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY tsconfig*.json .env ./
COPY src ./src

RUN npm run build

USER node
CMD ["node", "dist/index.js"]