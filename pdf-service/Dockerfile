FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app
COPY package.json .
RUN npm install --production
COPY server.js .

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server.js"]
