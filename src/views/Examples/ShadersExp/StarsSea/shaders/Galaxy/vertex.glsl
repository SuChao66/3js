precision mediump float;

// 顶点大小
attribute float aScale;
// 时间
uniform float uTime;

// uv
varying vec2 vUv;
// 颜色
varying vec3 vColor;

void main() {
  // 对模型进行模型变换，将模型坐标转换为世界坐标
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // 设置旋转
  // 获取顶点的角度
  float angle = atan(modelPosition.x,modelPosition.z);
  // 获取点到中心的距离
  float distanceToCenter = length(modelPosition.xz);
  // 根据顶点到中心的距离，设置旋转偏移度数
  float angleOffset = 1.0 / distanceToCenter * uTime;
  // 目前旋转的度数 = 当前的角度 + 偏移的角度
  angle += angleOffset;
  // 计算顶点的x和z值
  modelPosition.x = cos(angle)*distanceToCenter;
  modelPosition.z = sin(angle)*distanceToCenter;

  // 视图矩阵
  vec4 viewPosition = viewMatrix*modelPosition;

  // 设置顶点的坐标 = 投影矩阵 * 视图矩阵 * 模型矩阵
  gl_Position = projectionMatrix * viewPosition;
  // 设置点的大小
  gl_PointSize = 200.0/-viewPosition.z * aScale;

  vUv = uv;
  vColor = color;
}
