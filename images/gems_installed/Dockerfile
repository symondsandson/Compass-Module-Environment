# DOCKER-VERSION 0.9.0

FROM ubuntu:latest

MAINTAINER Quinn Shanahan q.shanahan@gmail.com
# http://www.activestate.com/blog/2014/01/using-docker-run-ruby-rspec-ci-jenkins

run apt-get -y update

RUN apt-get -y install wget
RUN apt-get -y install git
RUN apt-get -y install libxslt-dev libxml2-dev

# install Ruby 1.9.3-p484
RUN apt-get -y install build-essential zlib1g-dev libreadline-dev libssl-dev libcurl4-openssl-dev
RUN git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
RUN git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
RUN echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
RUN echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
ENV PATH /.rbenv/bin:/.rbenv/shims:$PATH
RUN rbenv init -
RUN rbenv install 1.9.3-p484 && rbenv global 1.9.3-p484

# Rails needs JS
RUN sudo apt-get -y install nodejs

# never install a ruby gem docs
RUN echo "gem: --no-rdoc --no-ri" >> ~/.gemrc

# Install bundler and the "bundle" shim
RUN gem install bundler && rbenv rehash

RUN git clone -b master https://github.com/empirical-org/quill-platform.git /quill

# pg gem requires this
RUN apt-get -y install libpq-dev

# Command to run at "docker run ..."
RUN if [ -z $BRANCH ]; then BRANCH=master; fi; \
    cd /quill && \
    git checkout $BRANCH && \
    git pull && \
    git submodule init     && git submodule update && \
    cd    quill            && git submodule init && git submodule update && bundle install && \
    cd ../questions-module && git submodule init && git submodule update && bundle install && \
    cd ../api              && git submodule init && git submodule update && bundle install \
