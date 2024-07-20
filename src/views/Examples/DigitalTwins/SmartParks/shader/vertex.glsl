attribute vec3 aPosition;
uniform float uTime;

void main() {
  vec4 currentPosition = modelMatrix * vec4(position, 1.0);

  // 获取当前点的位置与目标点位置之间的向量，构成方向向量
  vec3 direction = aPosition - currentPosition.xyz;

  // 目标点位置
  vec3 targetPosition = currentPosition.xyz + direction * 0.1 * uTime;

  // 修改顶点坐标
  vec4 vPosition = viewMatrix * vec4(targetPosition, 1.0);

  gl_Position = projectionMatrix * vPosition;
  gl_PointSize = 100.0 / vPosition.z;
}
