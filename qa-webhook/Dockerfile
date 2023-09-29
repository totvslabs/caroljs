FROM keymetrics/pm2:16-alpine

ADD . ./

RUN npm install

CMD ["pm2-runtime", "src/carol-sub.js", "--name", "carol-sub"]