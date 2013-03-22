var EventEmitter = require('events').EventEmitter
  , vcsurl = require('vcsurl')
  , GithubApiDownloader = require('./transport_api').GithubApiDownloader
  , path = require('path-extra')


module.exports = function GithubDownload (params, dir, transportConfig) {
  if (typeof params === 'string') {
    var url = (vcsurl(params) || params).split('/')
    params = {user: url[url.length - 2], repo: url[url.length - 1]}
  }

  if (typeof params !== 'object')
    throw new Error('Invalid parameter type. Should be repo URL string or object containing repo and user.')

  //console.dir(params)

  dir = dir || process.cwd()
  return new GithubApiDownloader(params.user, params.repo, 'master', dir).start()
}

function doAPITransport (user, repo, branch, outputDir, options) {
  
}
