
# 1. show docker container list
docker ps
########
CONTAINER ID   IMAGE              COMMAND                  CREATED         STATUS         PORTS                     NAMES
1d398384fe6e   docker-postgis     "docker-entrypoint.s…"   3 minutes ago   Up 3 minutes   0.0.0.0:5432->5432/tcp    postgis
a82384d4e72b   docker-geoserver   "catalina.sh run"        3 minutes ago   Up 3 minutes   0.0.0.0:18080->8080/tcp   geoserver

# 2. docker container connection
docker exec -it {CONTAINER ID} /bin/sh