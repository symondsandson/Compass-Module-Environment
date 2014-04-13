RUN git clone -b master https://github.com/empirical-org/quill-platform.git /quill

# Command to run at "docker run ..."
RUN if [ -z $BRANCH ]; then BRANCH=master; fi; \
    cd /quill && \
    git checkout $BRANCH && \
    git pull && \
    git submodule init     && git submodule update && \
    cd    quill            && git submodule init && git submodule update && bundle install && \
    cd ../questions-module && git submodule init && git submodule update && bundle install && \
    cd ../api              && git submodule init && git submodule update && bundle install \
