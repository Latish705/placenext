
FROM node:19-alpine

WORKDIR /server

COPY package.json . 

RUN npm install

COPY . .

RUN npx tsc -b

EXPOSE 8000

CMD ["node", "dist/index.js"]
