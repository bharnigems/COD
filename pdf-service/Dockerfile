FROM node:20-slim
RUN apt-get update && apt-get install -y \
    chromium fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
ENV CHROME_PATH=/usr/bin/chromium
ENV NODE_ENV=production
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY server.js .
EXPOSE 8080
CMD ["node", "server.js"]
