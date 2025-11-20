FROM harbor-hkidc.kcprd.com/base/node:20.10.0-bullseye-slim AS builder

ARG NODE_TLS_REJECT_UNAUTHORIZED=0

# 设置工作目录
WORKDIR /home/node/app

RUN apt-get update -y && apt-get install -y build-essential libpng-dev
#   && apt-get install -y make \
#   && apt-get install -y gcc

# 复制 package.json 和 yarn.lock 到工作目录
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn config set registry https://nexus.kcprd.com/repository/npm-group/ && \
  yarn config set "strict-ssl" false && \
  yarn install && \
  yarn cache clean

# 复制源代码并编译 Nest.js 项目
COPY . .
RUN npm run build

FROM harbor-hkidc.kcprd.com/base/node:20.10.0-bullseye-slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
ENV PUPPETEER_CACHE_DIR=/.cache/puppeteer

COPY --from=builder /home/node/app/chrome/google-chrome-stable_current_amd64.deb ./

RUN apt-get update -y \
  # Install Google Chrome Stable and fonts
  # Note: this installs the necessary libs to make the browser work with Puppeteer.
  && apt-get install -y ./google-chrome-stable_current_amd64.deb \
  && rm -f ./google-chrome-stable_current_amd64.deb \
  && apt-get clean all
# RUN apt-get update && apt-get install gnupg wget -y && \
#   wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
#   sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
#   apt-get update && \
#   apt-get install google-chrome-stable -y --no-install-recommends && \
#   rm -rf /var/lib/apt/lists/*

# 安装curl
# RUN apk --no-cache add curl


# 复制生产构建结果和依赖
COPY --from=builder /home/node/app/.vault ./.vault
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/package.json ./
COPY --from=builder /home/node/app/.env ./.env
COPY --from=builder /home/node/app/.env.production ./.env.production
# 首次上线保留
# COPY --from=builder /home/node/app/migration.data.backup ./migration.data.backup

# 暴露主机端口
EXPOSE 3300 3301

# 应用程序启动命令
CMD [ "npm", "run", "start:prod" ]
