var path = require('path');
var archive = require('../helpers/archive-helpers');
var helper = require('./http-helpers');
var url = require('url');
// require more modules/folders here!


// 'GET'
exports.getSite = function(req, res) {
  // the url should have the form /somesite.com. if it's just /, we want it to be /index.html
  var reqURL = url.parse(req.url).pathname;
  reqURL = reqURL === '/' ? '/index.html' : reqURL;

  helper.serveAssets(res, reqURL, function() {
    // check the list
    archive.isUrlInList(reqURL, function(found) {
      // if it's in there,
      if (found) {
        // redirect to the loading page
        helper.redirect('/loading.html', req, res);
      // if it's not in there,
      } else {
        // return a 404, not found
        helper.return404(res);
      }
    });
  });


};

// 'POST'
exports.saveSite = function(req, res) {
  helper.collectData(req, function(data) {
    // we need to know the req url
    var reqURL = data.split('=')[1];

    // check the list
    archive.isUrlInList(reqURL, function(found) {
      // if it's in there,
      if (found) {
        // check if it's in the archive
        archive.isURLArchived(reqURL, function(archived) {
          // if it's in there,
          if (archived) {
            // redirect to the req url
            helper.redirect('/' + reqURL, res);
          // if it's not in there,
          } else {
            // redirect to loading
            helper.redirect('/loading.html', res);
          }
        });
      } else {
        // we add it to the list
        archive.addUrlToList(reqURL, function() {
          // have the cron archive the page
          archive.downloadUrls(reqURL, function() {
            helper.redirect('/loading.html', res);
          });
        });
      }
    });
  });
};

var actions = {
  'GET': exports.getSite,
  'POST': exports.saveSite
};

exports.handleRequest = function (req, res) {
  //res.end(archive.paths.list);
  actions[req.method](req, res);
};
