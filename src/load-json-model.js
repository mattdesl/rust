import THREE from 'three'
import json from 'load-json-xhr'

export default function(path) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.JSONLoader();
    json(path, (err, data) => {
      if (err)
        reject(err)
      else {
        resolve(loader.parse(data))
      }
    })
  })
}