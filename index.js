import { polyfill } from 'es6-promise'
polyfill()

import THREE from 'three'
import domready from 'domready'
import viewer from './src/viewer'
import loadGeometry from './src/load-json-model'
import loadTexture from './src/load-texture'
import assign from 'object-assign'

import addMesh from './src/add-mesh'
import addBackground from './src/add-background'

domready(() => { 
  const app = viewer({
    alpha: false,
    preserveDrawingBuffer: false,
    antialias: true
  })
  document.body.appendChild(app.canvas)
  assign(document.body.style, {
    background: '#000',
    overflow: 'hidden'
  })

  const texOpt = { 
    minFilter: THREE.LinearFilter,
    generateMipmaps: false,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping
  }

  const loadTextures = Promise.all([
    loadTexture('assets/factory.jpg', texOpt),
    loadTexture('assets/road.jpg', texOpt)
  ])

  Promise.all([
    loadGeometry('assets/elk.json'),
    loadTextures,
    loadTexture('assets/lut.png', {
      minFilter: THREE.LinearFilter,
      flipY: false,
      generateMipmaps: false
    })
  ])
    .then(result => {
      let [ geo, textures, lut ] = result
      addMesh(app, assign({}, geo, { 
        textures, lut
      }))
    })
    .then(null, (err) => {
      console.error("Got error")
      console.error(err.stack)
    })

  addBackground(app)
  app.controls.enabled = false
  app.start()
})

