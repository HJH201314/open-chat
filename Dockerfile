# Stage 1: Build frontend
FROM node:20-alpine as frontend-builder
# Enable pnpm
RUN npm config set registry https://mirrors.tencent.com/npm/
RUN corepack enable

# Stage 1.1: Prepare files
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client ./client

# Stage 1.2: Prepare frontend dependencies and build
RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
    pnpm install
RUN cd client && pnpm run build-only

# Stage 2: Build backend
FROM golang:1.24-alpine as backend-builder
WORKDIR /app
COPY server/go.mod server/go.sum ./
RUN go mod download
COPY server .
RUN CGO_ENABLED=0 GOOS=linux go build -o /main

# Stage 3: Final preparation
FROM alpine:3.21
RUN apk add --no-cache nginx

# Frontend files
COPY --from=frontend-builder /app/client/dist /usr/share/nginx/html
# Backend files
COPY --from=backend-builder /main /app/main

# Configure nginx
COPY ./docker/nginx.conf /etc/nginx/http.d/default.conf
COPY ./docker/start.sh /start.sh
RUN chmod +x /app/main /start.sh

EXPOSE 9035
CMD ["/start.sh"]
