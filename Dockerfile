FROM node:18

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install typescript

RUN npm install --omit=dev

COPY . .

RUN npm run build
# If you are building your code for production
# RUN npm ci --omit=dev

# COPY target/ ./

# RUN npm install -g typeorm

EXPOSE 8080


# RUN typeorm schema:sync --dataSource src/services/webservice.db.js

CMD [ "node", "target/index.js", ">> logs/app.log"]
