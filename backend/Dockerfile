# Production Dockerfile for ApnaCloud Backend
FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Create storage directory
RUN mkdir -p /home/sakshi/apnacloud-storage

EXPOSE 5000

CMD ["node", "server.js"]
