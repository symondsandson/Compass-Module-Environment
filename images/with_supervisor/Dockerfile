# DOCKER-VERSION 0.9.0

FROM with_postgres:latest

ENV PATH /.rbenv/bin:/.rbenv/shims:$PATH
RUN rbenv init -

RUN apt-get install -y supervisor
RUN mkdir -p /var/run/sshd
RUN mkdir -p /var/log/supervisor

ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord"]
