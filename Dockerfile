# # Build Stage
# FROM node:20-alpine AS base 
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# # RUN npm run build


# # Production Stage
# FROM base AS runner
# WORKDIR /app
# COPY --from=base /app/package*.json .
# COPY --from=base /app/.next .next
# COPY --from=base /app/public public
# COPY --from=base /app/node_modules node_modules
# # ENV NODE_ENV=production
# EXPOSE 3000

# # Install polling for hot reaload
# ENV WATCHPACK_POLLING=true

# CMD ["npm", "run", "dev"]


# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the Next.js app
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose port
EXPOSE 3000

# Environment for hot reload (optional)
ENV WATCHPACK_POLLING=true

# Start the app
CMD ["npm", "start"]
