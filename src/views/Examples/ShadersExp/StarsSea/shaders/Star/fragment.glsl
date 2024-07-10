#ifndef GL_FRAGMENT_PRECISION_HIGH
	precision mediump float;
#else
	precision lowp float;
#endif

// 透明度
uniform float uOpacity;
// 纹理
uniform sampler2D uTexture;

void main() {
  // 1.设置圆形点
  // float strength = 1.0 - distance(gl_PointCoord, vec2(0.5, 0.5));
  // strength = step(0.5, strength);

  // 2.纹理
  vec4 textureColor = texture2D(uTexture,gl_PointCoord);
  gl_FragColor = vec4(vec3(textureColor), uOpacity);
}
