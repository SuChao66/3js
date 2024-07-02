export default /* glsl */`
  float r0 = uSpreadTime * 20.0;
  // 顶点坐标距离圆心距离center的距离
  float L = distance(vPosition.xz, uSpreadCenter);

  if(L > r0 && L < r0 + 2.0 * uSpreadWidth){
    // 渐变色光带
    float per = 0.0;
    if(L < r0 + uSpreadWidth){
        per = (L - r0) / uSpreadWidth;
        // outgoingLight = mix( vec3(0.0, 1.0, 1.0), vec3(1.0,1.0,1.0), per);
        gl_FragColor = mix( vec4(0.0,1.0,1.0,1.0), gl_FragColor, per);
    }else{
        per = (L - r0 - uSpreadWidth) / uSpreadWidth;
        // outgoingLight = mix( vec3(1.0,1.0,1.0), vec3(0.0, 1.0, 1.0), per);
        gl_FragColor = mix( gl_FragColor, vec4(0.0,1.0,1.0,1.0), per);
    }
  }
  //#end#
`;
