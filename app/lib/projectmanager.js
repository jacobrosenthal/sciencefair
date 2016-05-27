var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var untildify = require('untildify')
var mkdirp = require('mkdirp')
var fs = require('fs')
var path = require('path')
var project = require('./project.js')

inherits(ProjectManager, EventEmitter)

function ProjectManager (datadir) {
  if (!(this instanceof ProjectManager)) return new ProjectManager(datadir)
  var self = this

  self.dir = untildify('~/.sciencefair/projects')
  mkdirp(self.dir)

  self._projects = {}

  self.projects = function (cb) {
    return fs.readdirSync(self.dir).map(function (p) {
      var dir = path.join(self.dir, p)
      return self._projects[dir] ||
        (self._projects[dir] = project({ dir: dir }))
    })
  }

  self.get = function (name) {
    var projectdir = path.join(self.dir, nameToDir(name))
    return project({ name: name, dir: projectdir })
  }

  function nameToDir (name) {
    return name
      .replace(/\s+/g, ' ')
      .replace(/\s/g, '_')
      .replace(/[^a-zA-Z0-9_]+/)
      .toLowerCase()
  }
}

module.exports = ProjectManager
