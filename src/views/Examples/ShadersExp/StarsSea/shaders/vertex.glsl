precision mediump float;

void main() {
  // 对模型进行模型变换，将模型坐标转换为世界坐标
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // 设置顶点的坐标 = 投影矩阵 * 视图矩阵 * 模型矩阵
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
