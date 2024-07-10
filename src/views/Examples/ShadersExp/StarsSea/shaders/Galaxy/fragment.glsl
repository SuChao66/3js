#ifndef GL_FRAGMENT_PRECISION_HIGH
	precision mediump float;
#else
	precision lowp float;
#endif

// uv
varying vec2 vUv;
// 颜色
varying vec3 vColor;

void main() {
  // 1.gl_PointCoord：像素坐标 0 - 1
  // gl_FragColor = vec4(gl_PointCoord, 0.0, 1.0);

  // 2.设置渐变圆（中间黑色）
  // float strength = distance(gl_PointCoord, vec2(0.5, 0.5));
  // gl_FragColor = vec4(strength);

  // 3.设置渐变圆（中间白色）
  // float strength = distance(gl_PointCoord, vec2(0.5, 0.5));
  // strength *= 2.0;
  // strength = 1.0 - strength;
  // gl_FragColor = vec4(strength);

  // 4.设置圆形点
  float strength = 1.0 - distance(gl_PointCoord, vec2(0.5, 0.5));
  strength = step(0.5, strength);
  gl_FragColor = vec4(vColor, strength);
}
