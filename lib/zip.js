var AdmZip = require('adm-zip')
var fs = require('fs-extra')
var path = require('path')
var stripDirs = require('strip-dirs')

// using 'this' here is weird, TODO: improve
function extractZip (zipFile, outputDir, callback) {
  var zip = new AdmZip(zipFile)
  var entries = zip.getEntries()
  var pending = entries.length
  var _this = this

  if (!entries[0].isDirectory) {
    throw new Error('expected zip to contain root directory')
  }

  function checkDone (err) {
    if (err) _this.emit('error', err)
    pending -= 1
    if (pending === 0) callback()
  }

  entries.forEach(function (entry) {
    if (entry.isDirectory) return checkDone()

    var relativePath = stripDirs(entry.entryName, 1)
    var file = path.resolve(outputDir, relativePath)
    fs.outputFile(file, entry.getData(), checkDone)
  })
}

module.exports = {
  extractZip: extractZip
}
