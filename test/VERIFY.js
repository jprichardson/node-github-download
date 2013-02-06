module.exports = VERIFY

function VERIFY (outputDir, input, transportConfig done) {
  var results = {}

  if (!fs.existsSync(outputDir)) {
    fs.removeSync(outputDir)
    fs.mkdirsSync(outputDir)
  }

  ghdownload(input, outputDir, transportConfig)
  .on('dir', function(dir) {
    if (!results['dir']) results['dir'] = []
    results['dir'].push(dir)
  })
  .on('file', function(file) {
    if (!results['file']) results['file'] = []
    results['file'].push(file)
  })
  .on('zip', function(zipUrl) {
    results['zip'] = zipUrl
  })
  .on('git', function(gitUrl) {
    results['git'] = gitUrl
  })
  .on('error', function(err) {
    if (!results['error']) results['error'] = []
    results['err'].push(err)
  })
  .on('end', function(success) {
    results['success'] = success

    var outputFiles = []

    outputFiles.push(path.join(outputDir, '.gitignore'))
    outputFiles.push(path.join(outputDir, '.travis.yml'))
    outputFiles.push(path.join(outputDir, 'CHANGELOG.md'))
    outputFiles.push(path.join(outputDir, 'LICENSE'))
    outputFiles.push(path.join(outputDir, 'README.md'))
    outputFiles.push(path.join(outputDir, 'package.json'))
    outputFiles.push(path.join(outputDir, 'lib/batchflow.js'))
    outputFiles.push(path.join(outputDir, 'test/batchflow.test.js'))
    outputFiles.push(path.join(outputDir, 'test/mocha.opts'))

    results['exist'] = {}

    outputFiles.forEach(function(file) {
      results['exist'][file] = fs.existsSync(file)
    })

    //has some correct content
    results['content'] = (fs.readFileSync(path.join(outputDir,'LICENSE'), 'utf8').indexOf('jprichardson@gmail.com') > 0)
    
    setTimeout(function() {
      done(results) 
    },250)
  })
}

