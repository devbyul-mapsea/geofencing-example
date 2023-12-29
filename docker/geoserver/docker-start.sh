# 1. docker build
docker build . -t geoserver/2.24.1

# 2. docker run
docker run -d -p 18080:8080 --name geoserver geoserver/2.24.1