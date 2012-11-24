
/*
 * GET image from storage
 */
exports.get = function(req, res) {
  var client = require('redis').createClient();
  var key = 'image:'+req.params.key;

  client.get(key, function (err, reply) {
    if (reply) {
      res.header('Content-Type', 'image/jpg');
      res.send(new Buffer(reply, 'base64'));
    } else {
      client.srandmember(key, function (err, reply) {
        if (reply) {
          client.get(reply, function (err, reply) {
            res.header('Content-Type', 'image/jpg');
            res.send(new Buffer(reply, 'base64'));
          })
        } else {
          res.send(404, "Can't seem to find that.");
        }
      });
    }
  });
}

/*
 * POST create a new image
 */
exports.create = function(req, res){
  var formidable = require('formidable'),
    form = new formidable.IncomingForm;

  var rawImageBuffers = {};

  form.onPart = function(part) {
    if (part.filename) {
      var filename = basename(part.filename);
      rawImageBuffers[filename] = new Buffer(0);
      part.addListener('data', function() {
          rawImageBuffers[filename] = require('buffertools').concat(rawImageBuffers[filename], arguments[0]);
      });
    }
  }

  form.on('end', function() {
    persistImages(rawImageBuffers);
  })

  form.parse(req);

  function persistImages(bufferList, callback) {
    var results = [];

    var client = require('redis').createClient(),
      multi = client.multi();

    for (filename in bufferList) {
      var buffer = bufferList[filename];
      var details = imageDetails(buffer);
      multi.set(details.urn, buffer.toString('base64'));
      multi.sadd('image:'+details.key, details.urn);
      multi.sadd('images', details.key);

      results.push(details);
    }

    multi.exec(function (err, replies) {
      if (req.xhr) {
        res.send(results);
      } else {
        res.redirect('/');
      }
    });

    function imageDetails(data) {
      var info = require('imageinfo')(data);
      var image_key = require('utils').md5(data);

      var image_urn = require('util').format(
        'image:%s-%s-%s-%s',
        image_key,
        info.format.toLowerCase(),
        info.width,
        info.height
      );

      return {
        urn: image_urn,
        key: image_key,
        format: info.format.toLowerCase(),
        width: info.width,
        height: info.height
      };
    }
  }

  function basename(path, suffix) {
    var b = path.replace(/^.*[\/\\]/g, '');

    if (typeof(suffix) == 'string' && b.substr(b.length - suffix.length) == suffix) {
      b = b.substr(0, b.length - suffix.length);
    }

    return b;
  }
};
