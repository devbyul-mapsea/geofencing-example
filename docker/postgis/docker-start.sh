# 1. docker build
docker build . -t posrgresql/16/postgis/3.4.1

# 2. docker run
docker run -d -p 5432:5432 --name postgis posrgresql/16/postgis/3.4.1