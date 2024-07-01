#!/bin/bash

IMAGE_NAME="lws-snake:latest"
CONTAINER_NAME="lws-snake"

if docker ps -a --filter ancestor="$IMAGE_NAME" --format '{{.ID}}' | grep -q .; then
    echo "Es gibt bereits Container, die aus dem Image '$IMAGE_NAME' instanziiert wurden."
    docker start $CONTAINER_NAME
else
    echo "Es gibt keine Container, die aus dem Image '$IMAGE_NAME' instanziiert wurden."
    docker run -d -p 8080:80 --name $CONTAINER_NAME $IMAGE_NAME
fi

chromium-browser --kiosk --noerrdialogs --disable-infobars --disable-session-chrashed-bubble http://localhost:8080