FROM node:20-alpine AS builder
RUN apk update
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# Install jq to remove map files
RUN apk add --no-cache jq
# Set working directory
WORKDIR /app
COPY . .
RUN npm install
# disable sourceMap
RUN jq '.compilerOptions.sourceMap = false' tsconfig.json > temp.json && mv temp.json tsconfig.json
RUN npm run build

FROM node:20-alpine AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
RUN npm ci --omit=dev
RUN npm run prisma:generate

FROM node:20-alpine AS runner
RUN apk update
RUN apk add --no-cache openssl
WORKDIR /app
# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app .


CMD ["node", "dist/index.js"]