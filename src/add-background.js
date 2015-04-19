import THREE from 'three'

var glslify = require('glslify')

export default function(app) {
  const resolution = new THREE.Vector2(app.width, app.height)
  const mat = new THREE.ShaderMaterial({
    vertexShader: glslify('./shaders/bg.vert'),
    fragmentShader: glslify('./shaders/bg.frag'),
    uniforms: {
      iResolution: { type: 'v2', value: resolution },
      iGlobalTime: { type: 'f', value: 0 },
    },
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide
  })

  const geom = new THREE.PlaneGeometry(500, 500)
  const mesh = new THREE.Mesh(geom, mat)
  mesh.rotation.y = -Math.PI
  app.scene.add(mesh)
  
  app.on('tick', dt => {
    mat.uniforms.iGlobalTime.value += dt/1000
  })

  app.on('resize', ({ width, height }) => {
    resolution.set(width, height)
  })
}