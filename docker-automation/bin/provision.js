var d = require('../lib/client.js');

// ---------------------------------------------------------------------

Fiber(function() {
  findOrCreateContainer('compass-postgres', { Image: 'postgres_Image' });
  findOrCreateContainer('compass-compass',  { Image: 'rails_Image', });
  findOrCreateContainer('compass-api',      { Image: 'rails_Image', });
  findOrCreateContainer('compass-quill',    { Image: 'rails_Image', });

  debugResponse(null, res);

  runContainer('compass-quill', {
    PublishAllPorts: true

  })

  // // docker run --rm -P -v /var/docker-data/etc/postgresql:/etc/postgresql -v /var/docker-data/var/log/postgresql:/var/log/postgresql -v /var/docker-data/var/lib/postgresql:/var/lib/postgresql --name postgres postgres
  // runContainer(res.id, {
  //   Binds: [
  //     '/var/docker-data/etc/postgresql:/etc/postgresql',
  //     '/var/docker-data/var/log/postgresql:/var/log/postgresql',
  //     '/var/docker-data/var/lib/postgresql:/var/lib/postgresql'
  //   ],
  // });

  runContainer('compass-compass',  { PublishAllPorts: true, Links: ['postgres:pg'] });
  runContainer('compass-api',      { PublishAllPorts: true, Links: ['postgres:pg'] });
  runContainer('compass-quill',    { PublishAllPorts: true, Links: ['postgres:pg', 'compass-api:api', 'compass-compass:compass'] });
}).run();

// # Create a PostgreSQL role named ``docker`` with ``docker`` as the password and
// # then create a database `docker` owned by the ``docker`` role.
// # Note: here we use ``&&\`` to run commands one after the other - the ``\``
// #       allows the RUN command to span multiple lines.
// RUN /etc/init.d/postgresql start && \
//     psql --command "CREATE USER docker WITH SUPERUSER PASSWORD 'docker';" && \
//     createdb -O docker docker
