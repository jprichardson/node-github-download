var EventEmitter = require('events').EventEmitter
  , vcsurl = require('vcsurl')
  , request = require('request')
  , path = require('path')
  , fs = require('fs')

function GithubDownloader (user, repo, branch, dir) {
  this.user = user
  this.repo = repo
  this.branch = branch || 'master'
  this.dir = dir
}

GithubDownloader.prototype = new EventEmitter();

GithubDownloader.prototype.start = function() {
  var _this = this 
    , initialUrl = 'https://api.github.com/repos/' + this.user + '/' + this.repo + '/contents/'
    , rawUrl = 'https://raw.github.com/' + this.user + '/' + this.repo + '/' + this.branch + '/'
    , pending = 0

  requestJSON.call(this, initialUrl, processItems)

  function processItems (items) {
    pending += items.length
    items.forEach(handleItem)
  }

  function handleItem (item) {
    if (item.type === 'dir') {
      fs.mkdir(path.join(_this.dir, item.path), function (err) {
        if (err) _this.emit('error', err)
        requestJSON.call(_this, initialUrl + item.path, processItems)
        _this.emit('dir', item.path)
        checkDone()
      })
    } else if (item.type === 'file') {
      request.get(rawUrl + item.path).pipe(fs.createWriteStream(path.join(_this.dir, item.path))).on('close', function() {
        _this.emit('file', item.path)
        checkDone()
      })
    }
    else
      _this.emit('Error', new Error(JSON.stringify(item, null, 2) + '\n does not have type.'))
  }

  function checkDone () {
    pending -= 1
    if (pending === 0) {
      _this.emit('end')
    }
  }

  return this;
}

module.exports = function GithubDownload (params, dir) {
  if (typeof params === 'string') {
    var url = vcsurl(params).split('/')
    params = {repo: url[url.length - 1], user: ur[url.length - 2]}
  }

  if (typeof params !== 'object')
    throw new Error('Invalid parameter type. Should be repo URL string or object containing repo and user.')

  dir = dir || process.cwd()
  return new GithubDownloader(params.user, params.repo, 'master', dir).start()
}


/****************************
 * PRIVATE METHODS
 ****************************/

function requestJSON (url, callback) {
  var _this = this
  request({url: url, json: true}, function(err, resp, body) {
    if (err) return this.emit('error', err)
    if (resp.statusCode !== 200) _this.emit('error', new Error(url + ': returned ' + resp.statusCode))

    callback(body)
 })
}

