#ifndef GL_FRAGMENT_PRECISION_HIGH
	precision mediump float;
#else
	precision lowp float;
#endif

// 计算出的高度传递给片元着色器(-1 - 1)
varying float vElevation;

// 最低点颜色
uniform vec3 uLowColor;
// 最高点颜色
uniform vec3 uHighColor;
// 透明度
uniform float uOpacity;

void main() {
  // 计算混合因子，随着顶点坐标值变化，顶点y轴越大，颜色越趋近于uHighColor，反之，越趋近于uLowColor
  float a = (vElevation + 1.0) / 2.0;  // 0 - 1

  // 颜色混合
  vec3 mixColor = mix(uLowColor, uHighColor, a);

  gl_FragColor = vec4(mixColor,uOpacity);
}
