varying vec2 vUv;
uniform float iGlobalTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iLookup;
uniform vec3 diffuse;
uniform float opacity;
varying vec3 vLightFront;
varying vec3 vReflect;

#pragma glslify: lut = require('glsl-lut')

void main() {
  vec4 diffuseColor = vec4(diffuse, opacity);
  vec3 outgoingLight = diffuseColor.rgb * vLightFront;

  vec2 uv = vUv * 0.5 + 0.5;
  uv.y -= 0.04; //offset coords a bit
  // uv.x += -0.0;
  vec4 color1 = texture2D(iChannel0, uv);
  vec4 color2 = texture2D(iChannel1, uv);

  float fade = smoothstep(0.7, 0.4, uv.y);
  //mix two images
  vec4 color = mix(color1, color2, fade);
  //N% tonemap
  vec4 toned = mix(color, lut(color, iLookup), 0.45);
  //show some of the model
  outgoingLight = mix(outgoingLight, toned.rgb, 0.90);

  gl_FragColor = vec4(outgoingLight, opacity);
}