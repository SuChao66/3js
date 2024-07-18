varying vec3 vPosition;
uniform float uHeight;

void main() {
  // 设置颜色渐变
  float percent = (vPosition.y + uHeight / 2.0) / uHeight;

  gl_FragColor = vec4(1, 1, 0, 1.0 - percent);
}
