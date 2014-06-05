var HTTP        = require('http')
  , URL         = require('url')
  , QueryString = require('querystring')
  , Future      = require('fibers/future')
  , wait        = Future.wait;

var R_NAME_ALREADY_ASSIGNED = /^Conflict, The name .* is already assigned to ([a-f0-9]{12})/;

function path (pathname, params) {
  var url = URL.parse(pathname);
  url.search = QueryString.stringify(params);
  return URL.format(url);
}

function requestWithCallback (method, pathname, params, body, callback) {
  var options = {
    socketPath: '/tmp/proxysocket.sock',
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
  var json = JSON.stringify(options);
  return request('POST', '/containers/'+ id +'/start', {}, json).wait();
}

function runContainerWithCallback (id, options, callback) {
  return requestWithCallback('POST', '/containers/'+ id +'/start', {}, json, callback)
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

exports.request               = request;
exports.requestWithCallback   = requestWithCallback;
exports.findOrCreateContainer = findOrCreateContainer;
exports.runContainer          = runContainer;
exports.runContainerWithCallback          = runContainerWithCallback;
exports.debugResponse         = debugResponse;
