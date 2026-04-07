FROM node:22-alpine

WORKDIR /app

COPY services/gateway/package*.json ./
RUN npm ci

COPY services/gateway/ ./
COPY shared/proto/ ./shared/proto/

RUN npx prisma generate
RUN npx tsc -p tsconfig.build.json

EXPOSE 3002

CMD ["node", "-r", "./dist/src/tracing.js", "dist/src/main.js"]
