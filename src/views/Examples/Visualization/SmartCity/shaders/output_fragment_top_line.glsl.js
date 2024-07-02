export default /* glsl */`
  float ToTopMix =  -(vPosition.y-uToTopTime)*(vPosition.y-uToTopTime)+uToTopWidth;
  if ( ToTopMix > 0.0 ) {
    gl_FragColor = mix(gl_FragColor, vec4(0.8, 0.8, 1.0, 1.0), ToTopMix / uToTopWidth);
  }
  //#end#
`;
