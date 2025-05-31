FROM node:23-slim

WORKDIR /frontend

# Install Poetry
COPY package.json .
RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
