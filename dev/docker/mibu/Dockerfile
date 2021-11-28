FROM node:16.12.0-bullseye

COPY dev/docker/mibu/entrypoint.sh /usr/local/sbin/
RUN chmod a+x /usr/local/sbin/entrypoint.sh

WORKDIR /mibu/

ENTRYPOINT ["/usr/local/sbin/entrypoint.sh"]
