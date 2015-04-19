import THREE from 'three'
import assign from 'object-assign'
var glslify = require('glslify')
// var ease = require('eases/sine-in-out')

export default function(app, assets) {
  const resolution = new THREE.Vector2(app.width, app.height)
  const mat = new THREE.ShaderMaterial({
    vertexShader: glslify('./shaders/horse.vert'),
    fragmentShader: glslify('./shaders/horse.frag'),
    uniforms: assign({}, THREE.UniformsLib.lights, {
      iResolution: { type: 'v2', value: resolution },
      iChannel0: { type: 't', value: assets.textures[0] },
      iChannel1: { type: 't', value: assets.textures[1] },
      iLookup: { type: 't', value: assets.lut },
      opacity: { type: 'f', value: 1 },
      morphTargetInfluences: { type: 'f', value: 0 },
      diffuse: { type: 'c', value: new THREE.Color(0xffffff) },
      iGlobalTime: { type: 'f', value: 0 },
    }),
    shading: THREE.FlatShading,
    lights: true,
    morphTargets: true,
    defines: {
      USE_MORPHTARGETS: '',
      USE_MAP: ''
    }
  })

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(6, 10, -10);
  app.scene.add(directionalLight);

  app.scene.add(new THREE.HemisphereLight(0xecfbff, 0xb0ddff, 0.75))

  const mesh = new THREE.Mesh(assets.geometry, mat)
  mesh.scale.multiplyScalar(0.01)
  mesh.position.set(-0.1, -0.6, 0)
  // mesh.rotation.y = 140 * Math.PI/180
  mesh.rotation.y = 90 * Math.PI/180
  app.scene.add(mesh)

  const animation = new THREE.MorphAnimation(mesh)
  animation.play()
  let time = 0

  app.on('tick', (dt) => { 
    time += dt/1000
    mat.uniforms.iGlobalTime.value = time
    animation.update(dt)

    // rotate mesh?
    // let rotation = Math.sin(time) * 0.5 + 0.5
    // rotation = ease(rotation) * 2 - 1
    // rotation = rotation * Math.PI*0.5
    // mesh.rotation.y = Math.PI/2 + rotation*0.1
  })

  app.on('resize', ({ width, height}) => {
    resolution.set(width, height)
  })
}