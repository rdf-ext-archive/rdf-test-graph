#!/usr/bin/env node

var path = require('path')
var Mocha = require('mocha')

var mocha = new Mocha()

global.rdf = require(path.join(process.cwd(), process.argv[2]))

mocha
  .addFile(path.join(__dirname, './test/spec.js'))
  .run(function (failures) {
    process.on('exit', function () {
      process.exit(failures)
    })
  })
