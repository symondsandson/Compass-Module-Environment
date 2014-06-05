# DOCKER-VERSION 0.9.0

FROM ruby_Image:latest

MAINTAINER Quinn Shanahan q.shanahan@gmail.com
# http://www.activestate.com/blog/2014/01/using-docker-run-ruby-rspec-ci-jenkins

RUN apt-get install postgresql-client-common
# RUN git clone https://github.com/empirical-org/Compass.git /tmp-checkout

EXPOSE 3000
# WORKDIR /tmp-checkout
ENV PATH /.rbenv/bin:/.rbenv/shims:$PATH
# RUN bundle install
# WORKDIR
CMD ["sh", "/data/bin/docker-run"]
