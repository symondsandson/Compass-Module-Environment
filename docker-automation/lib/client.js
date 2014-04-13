var http        = require('http')
  , url         = require('url')
  , querystring = require('querystring');

var R_NAME_ALREADY_ASSIGNED = /^Conflict, The name .* is already assigned to ([a-f0-9]{12})\. You have to delete \(or rename\) that container to be able to assign postgres to a container again\.$/;

function path (pathname, params) {
  var u = url.parse(pathname);
  u.search = querystring.stringify(params);
  return url.format(u);
}

function request (method, pathname, params, body, callback) {
  var options = {
    socketPath: '/var/run/docker.sock',
    path: path(pathname, params),
    method: method
  };

  var req = http.request(options, function (res) {
    res.bodyString = '';
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      res.bodyString += chunk;
    });

    res.on('end', function () {
      callback(null, res);
    })
  });

  req.on('error', function(err) {
    callback(err, null);
  });

  if (body) req.write(body);
  req.end();
  return req;
}

function createContainer (name, options, callback) {
  var json = JSON.stringify(options);
  request('POST', '/containers/create', {name: name}, json, callback);
}

function findOrCreateContainer (name, options, callback) {
  createContainer(name, options, function (err, res) {
    if (err) {
      debugResponse({message: 'Error in findOrCreateContainer from http.'})
    } else {
      if (res.statusCode == 409) {
        var body    = res.bodyString.trim()
          , matched = body.match(R_NAME_ALREADY_ASSIGNED);

        if (matched) {
          callback(null, {id: matched[1]});
        } else {
          callback({message: 'Failed to parse body string for container ID in findOrCreateContainer.', body: body});
        }
      } else {
        callback(null, res);
      }
    }
  });
}

function runContainer (id, options, callback) {
  request('POST', '/containers/'+ id +'/start', null, null, callback);
}

function debugResponse (err, res) {
  if (res && res.req) console.log('debug for '+ res.req.method +' '+ res.req.path);

  if (err) {
    console.log('HTTP ERROR:' + JSON.stringify(err));
    return;
  }

  if (!res || !res.req) return;
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  console.log('BODY: ' + res.bodyString);
}

// ---------------------------------------------------------------------

function launchPostgres (err, res) {
  debugResponse(err, res);
  if (err) return;

  // docker run --rm -P -v /var/docker-data/etc/postgresql:/etc/postgresql -v /var/docker-data/var/log/postgresql:/var/log/postgresql -v /var/docker-data/var/lib/postgresql:/var/lib/postgresql --name postgres postgres
  runContainer(res.id, {
    Binds: [
      '/var/docker-data/etc/postgresql:/etc/postgresql',
      '/var/docker-data/var/log/postgresql:/var/log/postgresql',
      '/var/docker-data/var/lib/postgresql:/var/lib/postgresql'
    ],
    PublishAllPorts: true
  }, debugResponse);
}

var res = findOrCreateContainer('postgres', {
  Hostname: "",
  User: "",
  AttachStdout: true,
  AttachStderr: true,
  PortSpecs: null,
  Env: null,
  Cmd: [
    "/usr/lib/postgresql/9.3/bin/postgres", "-D", "/var/lib/postgresql/9.3/main", "-c", "config_file=/etc/postgresql/9.3/main/postgresql.conf"
  ],
  Dns: null,
  Image: "ubuntu"
}, launchPostgres);
"
# Create a PostgreSQL role named ``docker`` with ``docker`` as the password and
# then create a database `docker` owned by the ``docker`` role.
# Note: here we use ``&&\`` to run commands one after the other - the ``\``
#       allows the RUN command to span multiple lines.
RUN /etc/init.d/postgresql start && \
    psql --command "CREATE USER docker WITH SUPERUSER PASSWORD 'docker';" && \
    createdb -O docker docker
