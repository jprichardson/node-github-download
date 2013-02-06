var ghdownload = require('../lib/github-download')
  , testutil = require('testutil')
  , fs =require('fs-extra')
  , path = require('path')
  , nock = require('nock')
  , P = require('autoresolve')
  , VERIFY = require(P('test/VERIFY'))

var TEST_DIR = null

describe('github-download / api transport', function() {
  beforeEach(function() {
    TEST_DIR = testutil.createTestDir('github-download')
    TEST_DIR = path.join(TEST_DIR, 'transport-api')
    fs.mkdirsSync(TEST_DIR)
  })

  describe('> when input is an object with user and repo', function() {
    it('should download the latest copy of master', function(done) {
      var transportConfig = {order: ['api']}
      var input = {user: 'jprichardson', repo: 'node-batchflow'}
      VERIFY(input, TEST_DIR, transportConfig, function(results) {
        F (results['zip'])
        F (results['git'])
        T (results['dir'])
        T (results['file'])
        F (results['error'])
        T (results['success'])

        var filesExist = results['exist']
        T (Object.keys(filesExist).every(function(file) { return filesExist[file] }))
        T (results['content'])
        done()
      })
    })
  })

  describe('> when input is an relative Github repo', function() {
    it('should download the latest copy of master', function(done) {
      var transportConfig = {order: ['api']}
      var input = 'jprichardson/node-batchflow'
      VERIFY(input, TEST_DIR, transportConfig, function(results) {
        F (results['zip'])
        F (results['git'])
        T (results['dir'])
        T (results['file'])
        F (results['error'])
        T (results['success'])

        var filesExist = results['exist']
        T (Object.keys(filesExist).every(function(file) { return filesExist[file] }))
        T (results['content'])
        done()
      })
    })
  })

  describe('> when input is git path Github repo', function() {
    it('should download the latest copy of master', function(done) {
      var transportConfig = {order: ['api']}
      var input = 'git@github.com:jprichardson/node-batchflow.git'
      VERIFY(input, TEST_DIR, transportConfig, function(results) {
        F (results['zip'])
        F (results['git'])
        T (results['dir'])
        T (results['file'])
        F (results['error'])
        T (results['success'])

        var filesExist = results['exist']
        T (Object.keys(filesExist).every(function(file) { return filesExist[file] }))
        T (results['content'])
        done()
      })
    })
  })

  describe('> when Github API limit has been reached', function() {
    it('should download the zip of the repo', function(done) {
      var transportConfig = {order: ['api']}
      var input = {user: 'jprichardson', repo: 'node-batchflow'}
      
      var scope = nock('https://api.github.com/')
      .filteringPath(function(path) {
        return '*';
      })
      .get('*')
      .reply(403, {message: "API Rate Limit Exceeded for $IP"})

      VERIFY(input, TEST_DIR, transportConfig, function(results) {
        F (results['zip'])
        F (results['git'])
        F (results['dir'])
        F (results['file'])
        T (results['error'])
        F (results['success'])

        var filesExist = results['exist']
        T (Object.keys(filesExist).every(function(file) { return !filesExist[file] }))
        F (results['content'])
        done()
      })
    })
  })
})

