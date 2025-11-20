#!/bin/bash

# if [[ $serverEnv == *"offline"* ]]; then
#     cat /app/ssg-service/host.txt >> /etc/hosts
#     cp /app/ssg-service/mwg.cert /usr/local/share/ca-certificates
#     update-ca-certificates
# fi

yarn start
