FROM node:22.7.0-bullseye-slim

COPY . /app

RUN apt-get update -y

WORKDIR /app/query_builder

RUN npm install -g

CMD ["npm", "start"]