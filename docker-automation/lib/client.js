var HTTP        = require('http')
  , URL         = require('url')
  , QueryString = require('querystring')
  , Future      = require('fibers/future')
  , wait        = Future.wait;

var R_NAME_ALREADY_ASSIGNED = /^Conflict, The name .* is already assigned to ([a-f0-9]{12})\. You have to delete \(or rename\) that container to be able to assign postgres to a container again\.$/;

function path (pathname, params) {
  var url = URL.parse(pathname);
  url.search = QueryString.stringify(params);
  return URL.format(url);
}

function requestWithCallback (method, pathname, params, body, callback) {
  var options = {
    socketPath: '/var/run/docker.sock',
    path: path(pathname, params),
    method: method
  };

  var req = HTTP.request(options, function (res) {
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
}

var request = Future.wrap(requestWithCallback);

function createContainer (name, options) {
  var json = JSON.stringify(options);
  return request('POST', '/containers/create', {name: name}, json).wait();
}

function findOrCreateContainer (name, options) {
  var res = createContainer(name, options);

  if (res.statusCode == 409) {
    var body    = res.bodyString.trim()
      , matched = body.match(R_NAME_ALREADY_ASSIGNED);

    if (matched) {
      return { id: matched[1] };
    } else {
      throw {message: 'Failed to parse body string for container ID in findOrCreateContainer.', body: body};
    }
  } else {
    return res;
  }
}

function runContainer (id, options) {
  return request('POST', '/containers/'+ id +'/start', null, null).wait();
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

Fiber(function() {
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
  });

  // docker run --rm -P -v /var/docker-data/etc/postgresql:/etc/postgresql -v /var/docker-data/var/log/postgresql:/var/log/postgresql -v /var/docker-data/var/lib/postgresql:/var/lib/postgresql --name postgres postgres
  runContainer(res.id, {
    Binds: [
      '/var/docker-data/etc/postgresql:/etc/postgresql',
      '/var/docker-data/var/log/postgresql:/var/log/postgresql',
      '/var/docker-data/var/lib/postgresql:/var/lib/postgresql'
    ],
    PublishAllPorts: true
  });
}).run();

// # Create a PostgreSQL role named ``docker`` with ``docker`` as the password and
// # then create a database `docker` owned by the ``docker`` role.
// # Note: here we use ``&&\`` to run commands one after the other - the ``\``
// #       allows the RUN command to span multiple lines.
// RUN /etc/init.d/postgresql start && \
//     psql --command "CREATE USER docker WITH SUPERUSER PASSWORD 'docker';" && \
//     createdb -O docker docker
