#!/bin/bash

# 确保 IMAGE_TAG 已被传入
if [ -z "$IMAGE_TAG" ]; then
  echo "Error: IMAGE_TAG is not set."
  exit 1
fi

# ECR repository URL
ECR_REPO="654032016939.dkr.ecr.ap-northeast-1.amazonaws.com/front/insight-server"

# 登录 ECR
sudo aws ecr get-login-password --region ap-northeast-1 |
  sudo docker login --username AWS --password-stdin $ECR_REPO

# 拉取镜像
sudo docker pull $ECR_REPO:$IMAGE_TAG

# 停止并删除旧容器
sudo docker stop insight-server
sudo docker rm insight-server

# 启动新容器
sudo docker run --name insight-server -p 3300:3300 -p 3301:3301 --network insight-network --restart unless-stopped -v /var/log/kucoin/insight-server:/logs -d $ECR_REPO:$IMAGE_TAG 