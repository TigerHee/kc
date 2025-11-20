#!/bin/bash  

current_date=$(date +%s)  

# 设置保留的天数  
retain_days=30  
retain_seconds=$((retain_days * 86400))  

# 查找并删除旧镜像  
docker images --format "{{.Repository}}:{{.Tag}} {{.CreatedAt}}" | while read line; do  
    # 提取镜像名称和创建时间  
    image_name=$(echo "$line" | cut -d' ' -f1)  # 使用 cut 提取镜像名称  
    created_at=$(echo "$line" | cut -d' ' -f2- | xargs -I{} date -d "{}" +%s)  # 使用 cut 提取创建时间  

    # 计算镜像创建时间与当前时间的差值  
    if (( current_date - created_at > retain_seconds )); then  
        echo "Deleting image: $image_name"  
        docker rmi "$image_name"  
    fi  
done  