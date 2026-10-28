# ==============================================================================
# BOLDDEE RENTALS — MULTI-STAGE PRODUCTION DOCKERFILE
# Stage 1: Build Frontend Assets (Vite SPA)
# Stage 2: Production Express Node.js Runtime
# ==============================================================================

# STAGE 1: Frontend Build
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# STAGE 2: Production Server
FROM node:22-alpine AS production
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Install build dependencies for better-sqlite3 native compilation on Alpine
RUN apk add --no-cache python3 make g++ sqlite

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application server code
COPY server ./server
COPY --from=frontend-builder /app/dist ./dist

# Create persistent database & backups directory
RUN mkdir -p data/backups

# Expose internal API & static serving port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start Production Server
CMD ["node", "server/server.js"]
