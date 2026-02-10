# ============================================================
# Multi-stage Dockerfile for React (Vite) Application
# ============================================================
# Stage 1: Build the application
# Stage 2: Serve with nginx
# ============================================================

# --- Build Stage ---
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build-time environment variables
# These are baked into the static files at build time.
# Pass them via: docker build --build-arg VITE_PEXELS_API_KEY=xxx .
ARG VITE_PEXELS_API_KEY
ARG VITE_APP_TITLE="Pexels Explorer"
ARG VITE_API_BASE_URL="https://api.pexels.com"

ENV VITE_PEXELS_API_KEY=$VITE_PEXELS_API_KEY
ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# --- Production Stage ---
FROM nginx:alpine AS production

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Security: run as non-root
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
