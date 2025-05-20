FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm ci
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine

USER node
WORKDIR /home/node/app

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node package*.json ./
COPY --chown=node:node wait-for.sh ./wait-for.sh
RUN chmod +x ./wait-for.sh

RUN npm ci --omit=dev

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
