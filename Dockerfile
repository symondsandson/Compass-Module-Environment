# DOCKER-VERSION 0.9.0

FROM with_supervisor:latest

ENV PATH /.rbenv/bin:/.rbenv/shims:$PATH
ENV DATABASE_URL postgres://localhost
RUN rbenv init -

CMD ["/usr/bin/supervisord"]
