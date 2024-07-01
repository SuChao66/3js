attribute vec3 aStep;

uniform float uTime;
uniform float uSize;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // 随时间变化，修改顶点坐标
  modelPosition.xyz += (aStep * uTime);
  // 设置顶点位置
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
  // 设置顶点大小
  gl_PointSize = uSize;
}
