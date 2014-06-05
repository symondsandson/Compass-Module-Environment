var fs = require('fs')
  , path = require('path');

exports.traverse = function traverse (dir, test, callback) {
  var dir = path.resolve(dir);

  fs.readdir(dir, function(err, list) {
    if (err) return callback('reeddir err');

    var file = list.filter(test)[0];

    if (file) {
      return callback(null, dir);
    } else {
      if (dir == '/') return callback('File not found');
      return traverse(dir + '/..', test, callback);
    }
  });
};
