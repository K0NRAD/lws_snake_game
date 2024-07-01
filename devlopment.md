# development notes 

## docker build images 

```bash
docker build --no-cache -t lws-snake:latest .
docker build --no-cache -t lws-snake:1.0.0 .
```

## run docker container

```bash
docker run -d -p 8080:80 --name lws-snake lws-snake:latest    
```
