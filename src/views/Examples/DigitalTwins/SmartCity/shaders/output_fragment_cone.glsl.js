export default /* glsl */`
#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif

// https://github.com/mrdoob/three.js/pull/22425
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha + 0.1;
#endif

// 四棱锥的y坐标区间[0, 20]
diffuseColor.a = diffuseColor.a * mix(1.0, 0.0, vPosition.y/80.0);

// 不考虑漫反射材质光照计算的影响 不同面没有明暗变化  没有棱角感
gl_FragColor = vec4( outgoingLight, diffuseColor.a );
`;
