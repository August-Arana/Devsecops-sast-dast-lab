FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src
COPY test ./test

EXPOSE 3000

# Vulnerable intencionalmente: corre como root porque no hay USER no-root definido.
CMD ["node", "src/server.js"]
