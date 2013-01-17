var ghdownload = require('../lib/github-download')
  , testutil = require('testutil')
  , fs =require('fs-extra')
  , path = require('path')

var TEST_DIR = ''

describe('github-download', function() {
  beforeEach(function(done) {
    TEST_DIR = testutil.createTestDir('github-download')
    done()
  })

  afterEach(function(done) {
    fs.remove(TEST_DIR, done)
  })

  describe('> when input is an object with user and repo', function() {
    it('should download the latest copy of master', function(done) {
      var files = []
        , dirs = []

      ghdownload({user: 'jprichardson', repo: 'node-batchflow'}, TEST_DIR)
      .on('dir', function(dir) {
        dirs.push(dir)
      })
      .on('file', function(file) {
        files.push(file)
      })
      .on('error', function(err) {
        done(err) //shouldn't happen
      })
      .on('end', function() {
        T (files.length > 10)
        T (dirs.length >= 2)
      
        T (fs.existsSync(path.join(TEST_DIR, '.gitignore')))
        T (fs.existsSync(path.join(TEST_DIR, '.travis.yml')))
        T (fs.existsSync(path.join(TEST_DIR, 'CHANGELOG.md')))
        T (fs.existsSync(path.join(TEST_DIR, 'LICENSE')))
        T (fs.existsSync(path.join(TEST_DIR, 'README.md')))
        T (fs.existsSync(path.join(TEST_DIR, 'package.json')))
        T (fs.existsSync(path.join(TEST_DIR, 'lib/batchflow.js')))
        T (fs.existsSync(path.join(TEST_DIR, 'test/batchflow.test.js')))
        T (fs.existsSync(path.join(TEST_DIR, 'test/mocha.opts')))

        T (fs.readFileSync('LICENSE', 'utf8').indexOf('jprichardson@gmail.com') > 0)
        done()
      })
    })
  })
})