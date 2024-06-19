export default /* glsl */`
  varying vec3 vNormal;
  void main() {
    // z轴方向单位向量
    vec3 z = vec3(0.0, 0.0, 1.0);
    // 两个向量夹角余弦值dot(vNormal, z)范围[-1,1]
    float x = abs(dot(vNormal, z)); // 点乘结果余弦值绝对值范围[0,1]
    // 透明度随着余弦值线性变化
    float alpha = pow(1.0 - x, 2.0);

    gl_FragColor = vec4(vec3(1.0, 1.0, 0.3), alpha);
  }
`
