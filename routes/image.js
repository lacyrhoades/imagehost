
/*
 * GET image from storage
 */
exports.get = function(req, res) {
    var client = require('redis').createClient();
    client.get(req.query.image_urn, function (err, reply) {
        res.header('Content-Type', 'image/jpg');
        res.send(new Buffer(reply, 'base64'));
    });
}

/*
 * POST create a new image
 */
exports.create = function(req, res){
    var fs = require('fs');
    var client = require('redis').createClient();

    if (!req.files.image) {
        res.send(403, {error: 'Must supply image file to create image resource.'});
        return;
    }

    fs.readFile(req.files.image.path, function (err, data) {
        var imageinfo = require('imageinfo');
        var image_key = require('utils').md5(data);
        var details = imageinfo(data);

        var image_urn = require('util').format(
            'urn:image:%s-%s-%s-%s',
            image_key,
            details.format.toLowerCase(),
            details.width,
            details.height
        );

        client.set(image_urn, data.toString('base64'));

        res.send({
            key: image_key,
            urn: image_urn
        });
    });
};
