FROM harbor-hkidc.kcprd.com/base/node:14.21.3-bullseye

ARG NODE_TLS_REJECT_UNAUTHORIZED=0

WORKDIR /app/ssg-service
COPY --chown=888:888 . /app/ssg-service

RUN apt-get update -y \
# Install Chrome
&& apt-get install -y ./google-chrome-stable_current_amd64.deb \
&& rm -f ./google-chrome-stable_current_amd64.deb \
&& apt-get clean all \
&& yarn config set "strict-ssl" false \
&& yarn install --production --registry https://nexus.kcprd.com/repository/npm-group/ \
&& yarn cache clean --all \
&& rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm \
&& apt-get install -y sudo rsync \
&& mkdir -p /app/ssg-service/logs /app/ssg-service/dist \
&& chown -R 888:888 /app

RUN chmod +x /app/ssg-service/run.sh

USER 888
# CMD ["yarn", "start"]
CMD ["bash", "/app/ssg-service/run.sh"]
