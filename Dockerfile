# Build Stage
FROM node:20-alpine AS base 
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


# Production Stage
FROM base AS runner
WORKDIR /app
COPY --from=base /app/package*.json .
COPY --from=base /app/.next .next
COPY --from=base /app/public public
COPY --from=base /app/node_modules node_modules
# ENV NODE_ENV=production
EXPOSE 3000

# Install polling for hot reaload
ENV WATCHPACK_POLLING=true

CMD ["npx", "next", "start"]