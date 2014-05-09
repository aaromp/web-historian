var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.collectData = function(req, callback) {
  var data = '';

  req.on('data', function(partial) {
    data += partial;
  });

  req.on('end', function() {
    callback(data);
  });
};

exports.return404 = function(res) {
  res.writeHead(404, headers);
  res.end('404 - page not found');
};

exports.redirect = function(url, res) {
  res.writeHead(302, {location: url});
  res.end();
};

exports.serveAssets = function(res, asset, pooItOut) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)

  if (asset === '/index.html') {
    asset = archive.paths.siteAssets + asset;
  } else {
    asset = archive.paths.archivedSites + asset;
  }
  console.log(asset)
  fs.readFile(asset, 'utf-8', function(poo, data) {
    if (poo) {
      pooItOut();
    } else {
      res.writeHead(200, headers);
      res.end(data);
    }

  });
};

// As you progress, keep thinking about what helper functions you can put here!
