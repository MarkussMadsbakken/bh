FROM node:23-alpine AS builder

RUN apk add openssl

WORKDIR /build

COPY . .

RUN npm ci

ARG SKIP_ENV_VALIDATION=1

RUN npm run build

FROM node:23-alpine AS runner

WORKDIR /app

RUN apk add openssl

COPY --from=builder /build/.next/standalone ./
RUN rm -f .env
COPY --from=builder /build/.next/static ./.next/static/
COPY --from=builder /build/prisma ./prisma/
COPY --from=builder /build/public ./public/

EXPOSE 3000
ENV PORT=3000

ENV NEXT_TELEMETRY_DISABLED=1

CMD [ "node", "server.js" ]
