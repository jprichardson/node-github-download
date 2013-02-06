var EventEmitter = require('events').EventEmitter
  , vcsurl = require('vcsurl')
  , request = require('request')
  , path = require('path')
  , fs = require('fs-extra')
  , os = require('os')
  
module.exports.GithubApiDownloader = GithubApiDownloader

function GithubApiDownloader (user, repo, branch, outputDir) {
  this.user = user
  this.repo = repo
  this.branch = branch || 'master'
  this.dir = outputDir
  this._log = []
  this._hasError = false
  this.on('error', function() {
    this._hasError = true
  })
}
GithubApiDownloader.prototype = new EventEmitter();

GithubApiDownloader.prototype.start = function() {
  var _this = this 
    , initialUrl = 'https://api.github.com/repos/' + this.user + '/' + this.repo + '/contents/'
    , rawUrl = 'https://raw.github.com/' + this.user + '/' + this.repo + '/' + this.branch + '/'
    , pending = 0
    , gonnaProcess = 0

  gonnaProcess += 1
  requestJSON.call(this, initialUrl, processItems)

  function processItems (items) {
    gonnaProcess -= 1

    if (items && items.length > 0) {
      pending += items.length
      items.forEach(handleItem)
    }
    checkDone()
  }

  function handleItem (item) {
    if (item.type === 'dir') {
      var dir = path.join(_this.dir, item.path)
      fs.mkdirs(dir, function (err) {
        if (err) _this.emit('error', err)
        _this._log.push(dir)
        gonnaProcess += 1
        requestJSON.call(_this, initialUrl + item.path, processItems)
        _this.emit('dir', item.path)
        pending -= 1
        checkDone()
      })
    } else if (item.type === 'file') {
      var file = path.join(_this.dir, item.path)
      fs.createFile(file, function(err) {
        if (err) _this.emit('error', err)
        request.get(rawUrl + item.path).pipe(fs.createWriteStream(file)).on('close', function() {
          _this._log.push(file)
          _this.emit('file', item.path)
          pending -= 1
          checkDone()
        })
      })
    }
    else
      _this.emit('Error', new Error(JSON.stringify(item, null, 2) + '\n does not have type.'))
  }

  function checkDone () {
    //console.log('PENDING: ' + pending + ' gonnaProcess: ' + gonnaProcess)
    if (pending === 0 && gonnaProcess === 0) {
      _this.emit('end', !_this._hasError)
    }
  }

  return this;
}



/****************************
 * PRIVATE METHODS
 ****************************/

function requestJSON (url, callback) {
  var _this = this
  request({url: url}, function(err, resp, body) {
    if (err) return this.emit('error', err)
    if (resp.statusCode !== 200) _this.emit('error', new Error(url + ': returned ' + resp.statusCode + '\n\nbody:\n' + body))

    callback(JSON.parse(body))
 })
}








