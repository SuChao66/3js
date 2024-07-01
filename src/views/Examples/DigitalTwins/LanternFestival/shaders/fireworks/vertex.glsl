attribute float aScale; // 烟花大小
attribute vec3 aRandom; // 烟花方向

uniform float uTime;
uniform float uSize;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // 修改顶点的坐标
  modelPosition.xyz += aRandom * uTime * 10.0;
  // 设置顶点的位置
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
  // 设置顶点大小
  gl_PointSize = uSize * aScale - (uTime * 20.0);
}
