FROM keymetrics/pm2:16-alpine

ADD ./qa-webhook/ ./

RUN rm -rf node_modules
RUN npm cache clean --force
RUN npm install

CMD ["pm2-runtime", "src/index.js", "--name", "qa-webhook"]
