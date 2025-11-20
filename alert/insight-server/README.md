# 后端服务

## 项目初始化

### Mongo服务依赖

> 使用```docker```安装

```bash
docker pull mongo  
docker run --name mongodb -d -p 27017:27017 mongo

# 常用命令
docker exec -it my-app /bin/bash  
docker ps
docker logs -f my-app
```

### Nestjs项目启动

```bash
yarn install
yarn start:dev
```

### 初始化系统用户

```bash
curl --location "localhost:3300/user/sync" \
--header "Content-Type: application/json" \
--data-raw "{
    \"data\": [
        {
            \"user\": {
                \"email\": \"lucas.zhou@qakupotech.com\",
                \"displayName\": \"Lucas Zhou (QA)\"
            },
            \"roles\": [
                \"admin\"
            ]
        }
    ]
}"
```

```bash
curl --location "localhost:3300/user/sync" \
--header "Content-Type: application/json" \
--data-raw "{
    \"data\": [
        {
            \"user\": {
                \"email\": \"chrise.zhao@qakupotech.com\",
                \"displayName\": \"Chrise Zhao (QA)\"
            },
            \"roles\": [
                \"admin\"
            ]
        }
    ]
}"
```

### 首次同步数据接口

```bash
curl -X POST --location "localhost:3300/sync" 
```

### 新增模块的脚手架命令

- 常用命令

```bash
nest g module example
nest g service example
nest g controller example
```

- 查询命令

```bash
nest --help
```

## 构建和发布

```bash
# 流水线操作镜像push到生成环境
https://jenkins.kcprd.com/job/web%E7%AB%AF%E4%B8%93%E9%A1%B9%E5%BC%80%E5%8F%91/job/insight-server/
```

### 启动服务

```bash
# 服务器上 执行部署脚本，请替换镜像tag
# IMAGE_TAG="feature-indicator-2ceafa034" ./deploy-insight-server.sh
# IMAGE_TAG="feature-h5-rn-app-store-check-85d48e636" ./deploy-insight-server.sh
# IMAGE_TAG="feature-wiki-viewer-64bd2a9e5" ./deploy-insight-server.sh
# IMAGE_TAG="feature-command-terminal-e990ad3d5" ./deploy-insight-server.sh
# IMAGE_TAG="technical-solution-3.0-538544897" ./deploy-insight-server.sh
# IMAGE_TAG="technical-solution-3.0-c567f13c6" ./deploy-insight-server.sh
# IMAGE_TAG="technical-solution-3.0-ad9c72f31" ./deploy-insight-server.sh
# IMAGE_TAG="feature-2025.04.11-1d53b3e50" ./deploy-insight-server.sh
# IMAGE_TAG="feature-2025.04.11-1d53b3e50" ./deploy-insight-server.sh
# IMAGE_TAG="master-7530b4f8f" ./deploy-insight-server.sh
# IMAGE_TAG="feature-lark-908253f33" ./deploy-insight-server.sh
# IMAGE_TAG="feature-lark-9fdf9dfd7" ./deploy-insight-server.sh
# IMAGE_TAG="feature-lark-ba9b27e46" ./deploy-insight-server.sh
# IMAGE_TAG="feature-lark-53206db73" ./deploy-insight-server.sh
# IMAGE_TAG="feature-lark-c0edc5ac7" ./deploy-insight-server.sh
# IMAGE_TAG="feature-2025.04.11-1d53b3e50" ./deploy-insight-server.sh
# IMAGE_TAG="feature-lark-53206db73" ./deploy-insight-server.sh
# IMAGE_TAG="feature-lark-c0edc5ac7" ./deploy-insight-server.sh
# IMAGE_TAG="feature-alert-48e98aceb" ./deploy-insight-server.sh
# IMAGE_TAG="feature-compliance-e67ae9222" ./deploy-insight-server.sh
# IMAGE_TAG="feature-fix-2025.05.15-7b86a0187" ./deploy-insight-server.sh
IMAGE_TAG="feature-compliance-full-8510dc944" ./deploy-insight-server.sh


```

### 服务器维护镜像

```bash
# 查询
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.CreatedAt}}"  

# 执行删除
# 获取当前日期  
current_date=$(date +%s)  

# 设置保留的天数  
retain_days=30  
retain_seconds=$((retain_days * 86400))  

# 查找并删除旧镜像  
docker images --format "{{.Repository}}:{{.Tag}} {{.CreatedAt}}" | while read line; do  
    # 提取镜像名称和创建时间  
    image_name=$(echo $line | awk '{print \$1}')  
    created_at=$(echo $line | awk '{for(i=2;i<=NF;i++) printf $i " "; print ""}' | xargs -I{} date -d "{}" +%s)  
    
    # 计算镜像创建时间与当前时间的差值  
    if (( current_date - created_at > retain_seconds )); then  
        echo "Deleting image: $image_name"  
        docker rmi "$image_name"  
    fi  
done

```

### 使用终端管理Mongodb

```bash
# 启动服务
docker exec -it mongodb bash   
mongosh

# 删除索引
show dbs
use agenda
db.users.getIndexes()
db.users.dropIndex('phone_1')
```

### 流水线 config file

> cert.pem   5bbd2ee9-b222-450b-ac66-aa6e1c11feff
> key.pem  55097647-1221-432f-8f42-a6414d7816e3

## 业务开发

### 环境变量的使用

> 所有全局的配置项可以环境变量的方式存储，严谨明文存储密钥

1. ```.env```文件，存储通用的配置
2. ```.env.development```文件，存储开发环境的配置，运行时会与```.env```文件合并
3. ```.env.production```文件，存储生产环境的配置，运行时会与```.env```文件合并

### 新增RestfulAPI服务

1. 创建controller
2. 创建service
3. 创建model

### websocket开发规范

1. 定义事件枚举```WsEventTypes```
2. ```websocket.gateway```中使用注解```@SubscribeMessage()```定义事件处理器
3. 使用```websocket.gateway```的 ```sendMessage```公共方法发送消息

### 调度任务开发规范

1. ```definer.constants```的```DEFINER_JOB_ENUMS```枚举中定义，调度任务的名字
2. 如需要通过结果的形式调用的任务```schedule-params.dynamic.pipeline``` 中对调度任务的```payload```做动态的```dto```校验
3. 使用```@DefineJob()```方式定义一个任务
4. 使用```@ScheduleJob()```补充定义任务为周期任务，原则上跟着代码写死的 **周期** 任务，都应该写在```system.job.definer```
5. 任务枚举```DEFINER_JOB_ENUMS```的值定义由三部分组成，`${group}:${name}:${version}`，例如```BITBUCKET:SCAN_REPO_APP_H5_OFFLINE:v1```

### Request对象的扩展规范

> 额外的request扩展，处理 **白名单** 的接口，应该所有的context下都能获取到这个信息，类型定义```auth.types```

```json
{
  id: string;
  role: AuthRoleEnum;
  name: string;
  email?: string;
  type: 'apikeys' | 'azure';
}
```

1. 如有需要扩展额外的```context```信息，只能做增量
2. 扩展信息时需要评审
3. 一定不要放置敏感信息

### Controller使用角色身份规范

> 秉承对于所有客户端的请求都不可信的处理原则，理论上需要强控权限的接口，不应该只在前端校验，接口层需要做拦截

1. 默认启用全局的守卫 ```roles.guard``` 不需要额外操作
2. 对于需要角色限制的controller上使用注解```@Roles()```定义一个限制，例如：```@Roles('admin')``` 表示这个接口必须是```admin```权限的用户才能访问，否则throw ```ForbiddenException``` 全局统一切面处理

### APIKEYs的使用规范

> 原则上，我们提供给外部，外部所有作为```client```调用我们系统的接口，都需要携带登录信息，如下之一

1. 增加header头 ```Authorization``` ```Bearer ${apikeys}```
2. 使用cookies ```INSIGHT_TOKEN``` ```${apikeys}```

### 白名单接口的使用规范

> 尽量不要使用，但总有特殊情况，如涉及第三方系统的改造，外部接口无法加入APIKEYS的请求

1. 定义常量 ```auth.constant``` 的 ```NO_AUTH_WHITE_LIST``` 下
2. 白名单定义的路径规则，全匹配例如: ```/health```，携带query的链接: ```/auth/callback*```

### 新增的HttpService规范

1. ```xxx.http.module```新增http模块
2. ```provide```新增的字符串唯一标识```XXX_HTTP_SERVICE_TOKEN```
3. ```httpAgent```实现代理，生产环境下```MWG```的代理，安全的要求
