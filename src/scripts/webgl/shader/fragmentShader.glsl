precision highp float;

uniform sampler2D tImage;
uniform vec2 uScale;
uniform float uAspect;
uniform float uSplit;
uniform float uTime;

varying vec2 vUv;

const float PI = acos(-1.0);

mat2 rot(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, s, -s, c);
}

float easeInOutQuint(float x) {
  return (x < 0.5) ? 16.0 * x * x * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 5.0) / 2.0;
}

void main() {
  vec2 aspect = vec2(uAspect, 1.0);

  vec2 uv = vUv;
  uv = (vUv - 0.5) * aspect + 0.5;
  float dist = distance(uv, vec2(0.5));
  float split = uSplit;
  dist = floor(dist * split) / split;

  float delay = dist * 0.6;
  float progress = fract(-uTime * 0.2 + delay);
  progress = easeInOutQuint(progress);
  float angle = PI * 2.0 * progress;

  uv -= 0.5;
  uv = rot(angle) * uv;
  uv /= aspect;
  uv *= uScale;
  uv += 0.5; 

  vec3 color = texture2D(tImage, uv).rgb;
  gl_FragColor = vec4(color, 1.0);
}