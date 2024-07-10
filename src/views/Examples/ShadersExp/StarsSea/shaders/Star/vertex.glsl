precision mediump float;

// 顶点大小
attribute float aScale;

void main() {
  // 对模型进行模型变换，将模型坐标转换为世界坐标
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // 视图矩阵
  vec4 viewPosition = viewMatrix * modelPosition;

  // 设置顶点的坐标 = 投影矩阵 * 视图矩阵 * 模型矩阵
  gl_Position = projectionMatrix * viewPosition;
  // 设置点的大小
  // gl_PointSize = 200.0 / -viewPosition.z * aScale * 20.0;
  gl_PointSize = aScale * 15.0;
}
