#!/bin/bash
cp /data/scripts/mcafeeca.crt ./
docker build -t $1 .