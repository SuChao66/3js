export default /* glsl */`
  // 保存原本片元的颜色
  vec4 distGradColor = gl_FragColor;
  // 设置颜色混合百分比
  float percent = (vPosition.y + uHeight / 2.0) / uHeight;
  // 计算混合颜色
  vec3 gradMixColor = mix(distGradColor.xyz, uTopColor, percent);
  // 设置片元颜色
  gl_FragColor = vec4(gradMixColor, 1);
  //#end#
`;
