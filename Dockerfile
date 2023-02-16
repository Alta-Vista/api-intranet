FROM node:18.14.0-alpine3.17

RUN apk add --no-cache bash curl && \
    curl https://raw.githubusercontent.com/eficode/wait-for/v2.1.3/wait-for --output /usr/bin/wait-for && \
    chmod +x /usr/bin/wait-for 

RUN npm i -g @nestjs/cli@9.2.0

USER node

WORKDIR /home/node/app

COPY --chown=root:root . .

USER root

RUN chmod +x .docker/entrypoint.sh

RUN npx prisma generate

USER node

ENTRYPOINT ["./.docker/entrypoint.sh"]