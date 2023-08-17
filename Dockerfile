FROM node:20-alpine AS builder
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
COPY ["tsconfig.json",  "./"]
COPY src ./src
RUN ["npm", "install"]
RUN ["npm", "run", "build"]


FROM node:20-alpine AS start
WORKDIR /app
ENV NODE_ENV=production
COPY ["package.json", "package-lock.json*", "./"]
RUN ["npm", "install"]
COPY --from=0 /app/dist .
RUN npm install pm2 -g
EXPOSE 3000
CMD ["pm2-runtime","index.js"]

