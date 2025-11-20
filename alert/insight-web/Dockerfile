# 基于 Node.js 的 lts镜像
# FROM node:20.10.0-bullseye-slim as builder
FROM harbor-hkidc.kcprd.com/base/node:20.10.0-bullseye-slim AS builder

# 设置工作目录
WORKDIR /home/node/web

# 复制 package.json 和 yarn.lock 到工作目录
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn config set registry https://nexus.kcprd.com/repository/npm-group/ && \
  yarn config set "strict-ssl" false && \
  yarn install && \
  yarn cache clean

# 复制源代码并编译项目
COPY . .
RUN npm run build



# 使用nginx作为基础镜像来提供静态网站
# FROM nginx:1.19-alpine
From harbor-hkidc.kcprd.com/base/openresty:1.21.4.1-10

# 替换默认nginx配置
COPY --from=builder /home/node/web/./nginx/nginx.conf /etc/nginx/nginx.conf
# 将构建的应用复制到nginx目录下
COPY --from=builder /home/node/web/dist /usr/share/nginx/html


COPY --from=builder /home/node/web/.vault ./.vault
# 复制证书和密钥
COPY ./.vault/server.crt /etc/nginx/ssl/server.crt
COPY ./.vault/server.key /etc/nginx/ssl/server.key


# Copy the MWG CA certificate into the image
COPY ./.vault/mcafeeca.crt /etc/pki/ca-trust/source/anchors/

# Update the CA certificates
RUN ln -s /etc/pki/ca-trust/source/anchors/mcafeeca.crt /etc/ssl/certs/ && update-ca-certificates

# 暴露主机端口https
EXPOSE 443

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
