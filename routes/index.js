exports.index = function(req, res){
  var client = require('redis').createClient();
  client.smembers('images', function (err, results) {
    var images = [];

    for (var i in results) {
      images.push({format:'jpg', id:results[i]});
    }

    res.render('index', { images: images });
  });
};