FROM harbor-hkidc.kcprd.com/base/node:16.20.2-bullseye

WORKDIR /app/sentry-notice


# 信任mwg自签证书 
COPY mwg.crt /usr/local/share/ca-certificates/mwg.crt

RUN cat /usr/local/share/ca-certificates/mwg.crt >> /etc/ssl/certs/ca-certificates.crt
 
COPY . /app/sentry-notice

RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm \ 
&& yarn config set registry https://nexus.kcprd.com/repository/npm-group/ \ 
&& yarn config set "strict-ssl" false \ 
&& yarn install \ 
&& yarn cache clean

ENV MWG_URL=http://SEC-MWG-HTTP9090-a698f4bd18eabb1d.elb.ap-northeast-1.amazonaws.com:9090

# 尽量不要使用ENV来配置代理
# 如果容器运行时需要代理的话，再配置即可，不要将代理配置带入运行时
#ENV HTTP_PROXY=$MWG_URL

#ENV HTTPS_PROXY=$MWG_URL
# 更新证书
RUN update-ca-certificates

CMD [ "yarn", "start" ]