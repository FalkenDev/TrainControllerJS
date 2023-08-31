FROM node:16

RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN npm install && npm audit fix

RUN chmod +x db/reset_db.bash
RUN ./db/reset_db.bash

EXPOSE 1337

CMD ["npm", "start"]
