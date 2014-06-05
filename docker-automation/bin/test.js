var d = require('./lib/client.js'), f = require('fibers');
f(function() { d.debugResponse(null, d.request('GET', '/containers/json').wait()) }).run()

// # Create a PostgreSQL role named ``docker`` with ``docker`` as the password and
// # then create a database `docker` owned by the ``docker`` role.
// # Note: here we use ``&&\`` to run commands one after the other - the ``\``
// #       allows the RUN command to span multiple lines.
// RUN /etc/init.d/postgresql start && \
//     psql --command "CREATE USER docker WITH SUPERUSER PASSWORD 'docker';" && \
//     createdb -O docker docker
