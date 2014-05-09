var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpGet = require('http-request');
var urls = [];

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, 'utf-8', function(poo, data) {
    if (poo) throw poo;

    urls = data.split('\n');

    callback.apply(this, arguments);
  });
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function() {
    console.log('I can read things!');
    var found = urls.indexOf(url) !== -1;
    console.log('i found it? ', found)
    callback(found);
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url + '\n', function (poo) {
    if (poo) throw poo;

    console.log('aaaah push it! push it real good!')
    urls.push(url);
    callback();
  });
};

exports.isURLArchived = function(url, callback){
  console.log('path is ', exports.paths.archivedSites + '/' + url);
  fs.exists(exports.paths.archivedSites + '/' + url, function(exists) {
    var archived = exists
    console.log('is ', url, ' archived? ', archived);
    callback(archived);
  });
};

exports.downloadUrls = function(url, callback){
  httpGet.get(url, function (poo, res) {
  if (poo) throw poo;

  console.log(res.code, res.headers, res.buffer.toString());
});
};
