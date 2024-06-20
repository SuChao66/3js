export default /* glsl */`
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif

// https://github.com/mrdoob/three.js/pull/22425
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha + 0.1;
#endif

// 设置流线点的透明度变化
float r = distance(gl_PointCoord, vec2(0.5, 0.5));
diffuseColor.a = diffuseColor.a * pow(1.0 - r / 0.5, 6.0);

// 不考虑漫反射材质光照计算的影响 不同面没有明暗变化  没有棱角感
gl_FragColor = vec4( outgoingLight, diffuseColor.a );
`;
