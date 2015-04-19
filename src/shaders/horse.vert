varying vec2 vUv;
varying vec3 vLightFront;

uniform float iGlobalTime;
uniform vec2 iResolution;
uniform float morphTargetInfluences[ 4 ];

const float zoom = 2.0;
const vec2 offset = vec2(0.0, -0.5);

vec3 transformDirection( in vec3 normal, in mat4 matrix ) {
  return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );
}

//env
varying vec3 vReflect;

//lighting
uniform vec3 ambientLightColor;
#if MAX_DIR_LIGHTS > 0
  uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];
  uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];
#endif

#if MAX_HEMI_LIGHTS > 0
  uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];
  uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];
  uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];
#endif

vec3 lighting(in vec3 normal) {
  vec3 lightColor = vec3(0.0);
  vec3 transformedNormal = normalize( normal );

  #if MAX_DIR_LIGHTS > 0
  for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {
    vec3 dirVector = transformDirection( directionalLightDirection[ i ], viewMatrix );

    float dotProduct = dot( transformedNormal, dirVector );
    vec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );
    lightColor += directionalLightColor[ i ] * directionalLightWeighting;
  }
  #endif
  #if MAX_HEMI_LIGHTS > 0
    for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {
      vec3 lVector = transformDirection( hemisphereLightDirection[ i ], viewMatrix );

      float dotProduct = dot( transformedNormal, lVector );
      float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;
      float hemiDiffuseWeightBack = -0.5 * dotProduct + 0.5;
      lightColor += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );
    }
  #endif
  lightColor += ambientLightColor;
  return lightColor;
}

#pragma glslify: noise = require('glsl-noise/simplex/4d')
#pragma glslify: ease = require('glsl-easings/quartic-in-out')
#pragma glslify: circ = require('glsl-easings/sine-in-out')

void main() {
  float anim = ease(sin(iGlobalTime) * 0.5 + 0.5);
  vec3 objectNormal = vec3(normalMatrix * normal);
  
  //morphtargets
  vec3 morphed = vec3(0.0);
  morphed += (morphTarget0 - position) * morphTargetInfluences[0];
  morphed += (morphTarget1 - position) * morphTargetInfluences[1];
  morphed += (morphTarget2 - position) * morphTargetInfluences[2];
  morphed += (morphTarget3 - position) * morphTargetInfluences[3];
  morphed += position;

  vec3 center = vec3(0.0, 60.0, 50.0);
  vec3 dir = normalize(position - center);
  float spin = circ(sin(iGlobalTime)*0.5+0.5)*2.0-1.0;
  
    
  // float ripple = clamp(distance(position.xyz, center) / (100.0), 0.0, 1.0);
  // ripple = smoothstep(1.0, 0.85, ripple);
  // spin = mix(spin, ripple, (sin(iGlobalTime)*0.5+0.5));
  // spin = mix(spin, spin + ripple, 0.2);

  float n = noise(vec4(normal.xyz * (spin * dir * 8.0), iGlobalTime));
  // float explode = circ((sin(iGlobalTime*0.5)*0.5+0.5))*2.0-1.0;
  morphed += (n * 4.0);

  vec4 projected = projectionMatrix *
              modelViewMatrix *
              vec4(morphed, 1.0);

  gl_Position = projected;

  //lighting
  vLightFront = lighting(objectNormal);

  //uvs
  vec2 screenPos = projected.xy / projected.w;
  vUv = screenPos;
  vUv.x *= iResolution.x / iResolution.y;
}