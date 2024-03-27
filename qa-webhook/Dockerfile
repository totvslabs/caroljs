FROM keymetrics/pm2:16-alpine

ADD . ./

RUN rm -rf node_modules
RUN npm cache verify
RUN npm install

CMD ["pm2-runtime", "src/index.js", "--name", "qa-webhook"]
