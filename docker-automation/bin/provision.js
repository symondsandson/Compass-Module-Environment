var d      = require('../lib/client.js')
  , F      = require('fibers')
  , util   = require('../lib/util.js')
  , Future = require('fibers/future')

var traverse = Future.wrap(util.traverse);

F(function() {
  var base = traverse('.', function (f) { return (f == 'platform.rb') }).wait();

  // res = [];
  // res << d.findOrCreateContainer('compass-postgres', { Image: 'postgres_Image', Volumes: { "/data": {} }, Cmd: [ "ls -lah", "/data" ]});
  // res << d.findOrCreateContainer('compass-compass',  { Image: 'rails_Image',    Volumes: { "/data": {} }, Cmd: [ "ls -lah", "/data" ]});
  // res << d.findOrCreateContainer('compass-api',      { Image: 'rails_Image',    Volumes: { "/data": {} }, Cmd: [ "ls -lah", "/data" ]});
  d.findOrCreateContainer('compass-quill',    {"Hostname":"","Domainname":"","User":"","Memory":0,"MemorySwap":0,"CpuShares":0,"AttachStdin":true,"AttachStdout":true,"AttachStderr":true,"PortSpecs":null,"ExposedPorts":{},"Tty":false,"OpenStdin":false,"StdinOnce":false,"Env":null,"Cmd": ["ls", "-lah", "/data"],"Dns":null,"Image":"rails_Image","Volumes":{"/data":{}},"VolumesFrom":"","WorkingDir":"","Entrypoint":null,"NetworkDisabled":false,"OnBuild":null});
  // res << d.runContainer('compass-compass',  { PublishAllPorts: true, Binds: [base + '/Compass:/data'],       Links: ['postgres:pg'] });
  // res << d.runContainer('compass-api',      { PublishAllPorts: true, Binds: [base + '/Compass-API:/data'],   Links: ['postgres:pg'] });
  d.runContainer('compass-quill',    {"Binds":["/home/quinn/quill-platform/Quill-Lessons:/data"],"ContainerIDFile":"","LxcConf":[],"Privileged":false,"PortBindings":{},"Links":["postgres:pg"],"PublishAllPorts":true});

  // console.log(JSON.stringify(res1));
  // d.debugResponse(null, res1);
  // res.forEach(function (r) {
  // });
}).run();
