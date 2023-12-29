FROM tomcat:9.0.38-jdk11-adoptopenjdk-openj9

# Tomcat의 Java VM 최소 최대 메모리 4GB 
ENV JAVA_OPTS=-D-Xms4096m-Xmx4096m
# Geoserver 2.24.1 버전
ENV GEOSERVER_VERSION=2.24.1

RUN apt-get update
RUN apt-get install -y vim wget unzip
RUN rm -rf /usr/local/tomcat/webapps/*
RUN cd /tmp && wget https://sourceforge.net/projects/geoserver/files/GeoServer/$GEOSERVER_VERSION/geoserver-$GEOSERVER_VERSION-war.zip
RUN unzip /tmp/geoserver-$GEOSERVER_VERSION-war.zip -d /usr/local/tomcat/webapps
RUN rm -rf /tmp/geoserver-$GEOSERVER_VERSION-war.zip

# Enable CORS
RUN sed -i '\:</web-app>:i\
    <filter>\n\
    <filter-name>CorsFilter</filter-name>\n\
    <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>\n\
    <init-param>\n\
    <param-name>cors.allowed.origins</param-name>\n\
    <param-value>*</param-value>\n\
    </init-param>\n\
    <init-param>\n\
    <param-name>cors.allowed.methods</param-name>\n\
    <param-value>GET,POST,HEAD,OPTIONS,PUT</param-value>\n\
    </init-param>\n\
    </filter>\n\
    <filter-mapping>\n\
    <filter-name>CorsFilter</filter-name>\n\
    <url-pattern>*</url-pattern>\n\
    </filter-mapping>' /usr/local/tomcat/conf/web.xml