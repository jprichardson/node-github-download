var EventEmitter = require('events').EventEmitter
  , vcsurl = require('vcsurl')
  , request = require('request')
  , path = require('path')
  , fs = require('fs-extra')
  , os = require('os')
  , AdmZip = require('adm-zip')

function GithubDownloader (user, repo, branch, dir) {
  this.user = user
  this.repo = repo
  this.branch = branch || 'master'
  this.dir = dir
  this._log = []
  this._getZip = false
}

GithubDownloader.prototype = new EventEmitter();

GithubDownloader.prototype.start = function() {
  var _this = this 
    , initialUrl = 'https://api.github.com/repos/' + this.user + '/' + this.repo + '/contents/'
    , rawUrl = 'https://raw.github.com/' + this.user + '/' + this.repo + '/' + this.branch + '/'
    , pending = 0
    , gonnaProcess = 0

  gonnaProcess += 1
  requestJSON.call(this, initialUrl, processItems)

  function processItems (items) {
    pending += items.length
    gonnaProcess -= 1
    items.forEach(handleItem)
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
    if (pending === 0 && gonnaProcess === 0 && !this._getZip) {
      _this.emit('end')
    }
  }

  return this;
}

module.exports = function GithubDownload (params, dir) {
  if (typeof params === 'string') {
    var url = (vcsurl(params) || params).split('/')
    params = {user: url[url.length - 2], repo: url[url.length - 1]}
  }

  if (typeof params !== 'object')
    throw new Error('Invalid parameter type. Should be repo URL string or object containing repo and user.')

  //console.dir(params)

  dir = dir || process.cwd()
  return new GithubDownloader(params.user, params.repo, 'master', dir).start()
}


/****************************
 * PRIVATE METHODS
 ****************************/

function requestJSON (url, callback) {
  var _this = this
  request({url: url}, function(err, resp, body) {
    if (err) return this.emit('error', err)
    if (resp.statusCode === 403) return downloadZip.call(_this)
    if (resp.statusCode !== 200) _this.emit('error', new Error(url + ': returned ' + resp.statusCode + '\n\nbody:\n' + body))

    callback(JSON.parse(body))
 })
}

function downloadZip() {
  var _this = this;
  if (_this._getZip) return;
  _this._getZip = true

  _this._log.forEach(function(file) {
    fs.remove(file)
  })

  var tmpdir = generateTempDir()
    , zipBaseDir = _this.repo + '-' + _this.branch
    , zipFile = path.join(tmpdir, zipBaseDir + '.zip')

  var zipUrl = "https://nodeload.github.com/" + _this.user + "/" + _this.repo + "/zip/" + _this.branch
  _this.emit('zip', zipUrl)

  //console.log(zipUrl)
  fs.mkdir(tmpdir, function (err) {
    if (err) _this.emit('error', err)
    request.get(zipUrl).pipe(fs.createWriteStream(zipFile)).on('close', function() {
      //fs.createReadStream(zipFile).pipe(unzip.Extract({path: tmpdir})).on('close', function() {
      extractZip.call(_this, zipFile, tmpdir, function() {
        var oldPath = path.join(tmpdir, zipBaseDir)
        //console.log(oldPath)
        fs.rename(oldPath, _this.dir, function(err) {
          if (err) _this.emit('error', err)
          _this.emit('end')
        })
      })
    })  
  })
  
}

function generateTempDir () {
  return path.join(os.tmpDir(), Date.now().toString() + '-' + Math.random().toString().substring(2))
}

function extractZip (zipFile, outputDir, callback) {
  var zip = new AdmZip(zipFile)
    , entries = zip.getEntries()
    , pending = entries.length
    , _this = this
  
  function checkDone (err) {
    if (err) _this.emit('error', err)
    pending -= 1
    if (pending === 0) callback()
  }

  entries.forEach(function(entry) {
    if (entry.isDirectory) return checkDone()

    var file = path.resolve(outputDir, entry.entryName)
    fs.outputFile(file, entry.getData(), checkDone)
  })
}




