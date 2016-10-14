const C = require('../lib/constants')
const datasource = require('../lib/datasource')
const mkdirp = require('mkdirp').sync
const fs = require('fs')
const path = require('path')

mkdirp(C.DATAROOT)
mkdirp(C.COLLECTION_PATH)

if (process.env['SCIENCEFAIR_DEVMODE']) require('debug-menu').install()

start()

function start () {
  const requireDir = require('require-dir')
  const choo = require('choo')
  const app = choo()

  const model = {
    state: {
      results: [],
      tags: {
        tags: {},
        showAddField: false,
        loaded: false
      },
      datasources: { loaded: false, list: [] },
      detailshown: false,
      autocompleteshown: false,
      currentsearch: {
        query: '',
        tagquery: null,
        tags: []
      },
      contentserver: require('../lib/contentServer')(C.DATAROOT),
      collectioncount: 0,
      selection: {
        reference: null,
        papers: [],
        downloaded: 'loading'
      },
      reader: {
        visible: false,
        paper: null
      }
    },
    effects: requireDir('./effects'),
    reducers: requireDir('./reducers'),
    subscriptions: requireDir('./subscriptions')
  }

  require('../lib/localcollection')((err, db) => {
    if (err) throw err

    model.state.collection = db

    app.model(model)

    app.router('/', (route) => [
      route('/', require('./views/home'))
    ])

    const tree = app.start()
    document.body.appendChild(tree)
  })
}
