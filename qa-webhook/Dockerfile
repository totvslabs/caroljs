FROM keymetrics/pm2:16-alpine

ADD . ./

RUN npm cache clean --force
RUN npm install

CMD ["pm2-runtime", "src/index.js", "--name", "qa-webhook"]
