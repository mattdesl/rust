// varying vec2 vUv;
uniform float iGlobalTime;
uniform vec2 iResolution;

const vec3 color1 = #fff;
const vec3 color2 = #e1edf7;

#pragma glslify: grain = require('glsl-film-grain')

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;

  vec2 aspect = vec2(iResolution.x / iResolution.y, 1.0);
  float zoom = 0.5;
  float dist = length((uv - 0.5) * aspect * zoom);

  vec3 color = mix(color1, color2, dist);

  float grainSize = 1.0;
  float g = grain(uv, iResolution / grainSize, iGlobalTime*2.0);
  color -= mix(0.0, g*0.3, dist);

  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}