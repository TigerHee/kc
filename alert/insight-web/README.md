#

## 开发

```bash
# 推荐使用taobao源，nexus会很慢
yarn global add nrm
# OR
nrm use taobao

# 安装依赖
yarn install

# 启动开发
yarn start:dev
```

## 构建和发布

```bash
# 流水线操作镜像push到生成环境
https://jenkins.kcprd.com/job/web%E7%AB%AF%E4%B8%93%E9%A1%B9%E5%BC%80%E5%8F%91/job/insight-web/
```

### 启动服务

```bash
# 服务器上 执行部署脚本，请替换镜像tag
# IMAGE_TAG="feature-lottie_tools-e966122ea" ./deploy-insight-web.sh
# IMAGE_TAG="feature-h5-rn-app-store-check-6f6fe0f6f" ./deploy-insight-web.sh
# IMAGE_TAG="feature-wiki-viewer-40497fc74" ./deploy-insight-web.sh
# IMAGE_TAG="feature-command-terminal-54014e82e" ./deploy-insight-web.sh
# IMAGE_TAG="technical-solution-3.0-f84bf7cf3" ./deploy-insight-web.sh
# IMAGE_TAG="technical-solution-3.0-822ddf50b" ./deploy-insight-web.sh
# # IMAGE_TAG="feature-2025.04.11-27442ff25" ./deploy-insight-web.sh
# IMAGE_TAG="feature-lark-96f85ea35" ./deploy-insight-web.sh
# IMAGE_TAG="feature-lark-96f85ea35" ./deploy-insight-web.sh
# IMAGE_TAG="feature-lark-b09858da6" ./deploy-insight-web.sh
# IMAGE_TAG="feature-alert-6952d7344" ./deploy-insight-web.sh
# IMAGE_TAG="feature-compliance-42d903a9d" ./deploy-insight-web.sh
# IMAGE_TAG="feature-fix-2025.05.15-62dda0a1f" ./deploy-insight-web.sh
IMAGE_TAG="feature-compliance-full-d3aa7ed48" ./deploy-insight-web.sh

```

### config/file

```bash
mcafeeca.crt 7ea77632-b11b-4428-b5e2-b45cae4921f0
server.crt f2507678-99de-4c03-a226-2ed14bc859a7
server.key 4bbf8fde-8e36-45b8-a229-91e2fcc1d4e0
```

## 组件文档

- [Ant Design](https://ant.design/components/overview-cn/)
- [Ant Design Pro](https://procomponents.ant.design/components)

## 框架文档

- [UmiJs](https://umijs.org/docs/api/api)

## 主题

- 主题色：#01bc8d
