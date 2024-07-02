export default /* glsl */`
  // float x0 = uLightLineTime * 20.0;

  // if(vPosition.x > x0 && vPosition.x < x0 + 2.0 * uLightLineWidth){
  //   // 渐变色光带
  //   float per = 0.0;
  //   if(vPosition.x < x0 + uLightLineWidth ){
  //       per = (vPosition.x-x0) / uLightLineWidth;
  //       outgoingLight = mix( vec3(1.0, 1.0, 1.0), vec3(0.5,0.5,1.0), per);
  //       gl_FragColor = vec4( outgoingLight, diffuseColor.a );
  //   }else{
  //       per = (vPosition.x-x0-uLightLineWidth) / uLightLineWidth;
  //       outgoingLight = mix( vec3(0.5,0.5,1.0), vec3(0.0, 1.0, 1.0), per);
  //       gl_FragColor = vec4( outgoingLight, diffuseColor.a );
  //   }
  // }
  float LightLineMix = -(vPosition.x + vPosition.z - uLightLineTime) * ( vPosition.x + vPosition.z - uLightLineTime) + uLightLineWidth;

  if(LightLineMix>0.0){
    gl_FragColor = mix(gl_FragColor,vec4(0.8,1.0,1.0,1),LightLineMix /uLightLineWidth);
  }

  //#end#
`;
